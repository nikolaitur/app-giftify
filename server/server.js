require('newrelic');
import '@babel/polyfill';
import 'isomorphic-fetch';
import dotenv from 'dotenv';
import next from 'next';
import Koa from 'koa';
import session from 'koa-session';
import KoaBody from 'koa-body';
import Router from 'koa-router';
import CryptoJS from 'crypto-js';
import { MongoClient } from "mongodb";
import { Shopify, ApiVersion } from '@shopify/shopify-api';
import shopifyAuth, { verifyRequest } from '@shopify/koa-shopify-auth';
import { registerWebhook } from "@shopify/koa-shopify-webhooks";
import routes from './routes/routes';
import thumb from './routes/thumb';
import subscribe from './subscribe';
import confirm from './confirm';
import RedisStore from './redis';
import generateScriptTag from './scripttag/app';
import generateConfig from './scripttag/config';
import getShopInfo from './info';
import handlePreview from './middleware/preview';

// --- ENV ----------------------------------------------------- //
dotenv.config();

const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const { HOST, SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES, API_VERSION } = process.env;
const { MONGO_DATABASE, MONGO_USERNAME, MONGO_PASSWORD, MONGO_CLUSTER } = process.env;

const sessionStorage = dev ? null : new RedisStore();

Shopify.Context.initialize({
  API_KEY: SHOPIFY_API_KEY,
  API_SECRET_KEY: SHOPIFY_API_SECRET,
  SCOPES: SCOPES.split(","),
  HOST_NAME: HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.April21,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: dev ? new Shopify.Session.MemorySessionStorage() : new Shopify.Session.CustomSessionStorage(
    sessionStorage.storeCallback,
    sessionStorage.loadCallback,
    sessionStorage.deleteCallback,
  ),
});

// --- FUNCTIONS ---------------------------------------------- //
const webhook = async (shop, accessToken, hook) => {
  const registration = await registerWebhook(
    { address: `${ HOST }/webhook/${ hook }`, topic: hook.replace('/', '_').toUpperCase(), accessToken: accessToken, shop: shop, apiVersion: API_VERSION }
  );
};

// --- DATABASE ----------------------------------------------- //
const mc = new MongoClient(
  `mongodb+srv://${ MONGO_USERNAME }:${ MONGO_PASSWORD }@${ MONGO_CLUSTER }/${ MONGO_DATABASE }`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mc.close();
mc.connect();
let cachedb = null;
console.log('Connected to Mongo: ' + MONGO_DATABASE);

// --- APP ---------------------------------------------------- //
app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  server.use(session(
    {
      sameSite: "none",
      secure: true,
    },
    server
  ));
  server.use(async (ctx, next) => {
    // Cache Mongo connection
    if (!cachedb && mc.isConnected) {
      cachedb = mc.db(MONGO_DATABASE);
    }
    
    ctx.db = cachedb;

    await next();
  });
  server.keys = [SHOPIFY_API_SECRET];
  server.use(async (ctx, next) => {
    if (ctx.path.includes('/webhook')) {
      return await next();
    }

    await KoaBody({
      includeUnparsed: true,
      multipart: true,
      jsonLimit: '2mb',
      textLimit: '2mb',
      formLimit: '2mb'
    })(ctx, next);
  });
  server.use(
    shopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],
      accessMode: 'offline',

      async afterAuth(ctx) {
        const { shop, accessToken, scope } = ctx.state.shopify;
        const store = shop.replace('.myshopify.com', '');

        // Set store's offline token for webhooks
        const info = await getShopInfo(shop, accessToken);
        const doc = await ctx.db.collection('stores').findOneAndUpdate(
          { _store: store },
          { $set: { 
            token: CryptoJS.AES.encrypt(accessToken, SHOPIFY_API_SECRET).toString(), 
            status: 'pending', 
            guide: true,
            active: false, 
            plan: 1,
            settings: { 
              general: info
            }
          } },
          { upsert: true }
        );

        // Calculate trial days
        const id = doc.value ? doc.value._id : doc.lastErrorObject.upserted;
        let trial = 7;

        if (doc.value) {
          trial = trial - parseInt(Math.floor((Date.now() - parseInt(id.toString().substring(0,8), 16) * 1000) / (60*60*24*1000)));
        }

        // Add webhooks
        webhook(shop, accessToken, 'app/uninstalled');
        webhook(shop, accessToken, 'orders/create');
        webhook(shop, accessToken, 'orders/fulfilled');
        webhook(shop, accessToken, 'orders/partially_fulfilled');
        webhook(shop, accessToken, 'fulfillment_events/create');

        // Redirect to app with shop parameter upon auth and subscription
        const subscriptionUrl = await subscribe(shop, accessToken, `${ HOST }/confirm?shop=${ shop }`, trial, dev || store == 'minion-made-apps' || store == 'minionmadeapps');

        ctx.redirect(subscriptionUrl);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  const handleJS = async (ctx) => {
    ctx.res.statusCode = 200;
    ctx.res.type = 'text/javascript';
    const store = ctx.query.shop.replace('.myshopify.com', '');
    const doc = await ctx.db.collection('stores').findOne(
      { _store: store },
      { fields: { status: 1, settings: 1, active: 1 } }
    );

    if (doc && doc.status == 'active' && doc.active) {
      ctx.res.write(generateScriptTag(doc.settings, dev));
    } else {
      ctx.res.write('');
    }
    
    ctx.res.end();
  };

  const handleProxy = async (ctx) => {
    ctx.res.statusCode = 200;
    ctx.res.type = 'application/json';
    const store = ctx.query.shop.replace('.myshopify.com', '');
    const doc = await ctx.db.collection('stores').findOne(
      { _store: store },
      { fields: { status: 1, settings: 1, active: 1 } }
    );

    if (doc && doc.status == 'active' && doc.active) {
      ctx.res.write(generateConfig(doc.settings));
    } else {
      ctx.res.write('{"error":"Not Active"}');
    }
    
    ctx.res.end();
  };

  const handleThumbnails = async (ctx) => {
    ctx.res.statusCode = 200;
    const store = ctx.query.shop.replace('.myshopify.com', '');
    ctx.store = store;
    const thumbnail = await thumb(ctx);
    if (thumbnail.mime) {
      ctx.res.type = thumbnail.mime;
      ctx.res.write(thumbnail.stream);
    }
    ctx.res.end();
  };

  const handlePages = async (ctx) => {
    if (!ctx.query.shop) {
      ctx.status = 401;
      ctx.body = {
        status: 'error',
        message: 'You are not authorized'
      }
      return;
    }
    const shop = ctx.query.shop;
    const store = shop.replace('.myshopify.com', '');
    const doc = await ctx.db.collection('stores').findOne(
      { _store: store },
      { fields: { status: 1, plan: 1 } }
    );

    if (!doc || doc.status != 'active') {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      if (!ctx.query.host) {
        ctx.redirect(`https://${ ctx.query.shop }/admin/apps/${ SHOPIFY_API_KEY }`);
      } else {
        await handleRequest(ctx);
      }
    }
  };

  router.get("/", handlePages);
  router.get("/settings", handlePages);
  router.get("/plan", handlePages);
  router.get("/confirm", confirm);
  router.get("/preview", handlePreview);
  server.use(routes());

  router.get("(/_next/image)", handleRequest);
  router.get("(/_next/static/.*)", handleRequest);
  router.get("/_next/webpack-hmr", handleRequest);
  router.get("/app.js", handleJS);
  router.post("/proxy", handleProxy);
  router.get("/img", handleThumbnails);
  router.get("(.*)", verifyRequest({accessMode: 'offline'}), handleRequest);

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
