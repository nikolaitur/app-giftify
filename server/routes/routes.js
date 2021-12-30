import 'isomorphic-fetch'
import Router from 'koa-router';
import { verifyRequest } from '@shopify/koa-shopify-auth';
import { receiveWebhook } from '@shopify/koa-shopify-webhooks';
import combineRouters from 'koa-combine-routers';
import verify from '../middleware/verify';
import load from 'import-modules';
import webhook from './webhook';
import cron from './cron';

// --- GLOBAL ----------------------------------------------------- //
const globals = new Router({ prefix: '/a/global' });
const global = load('globals');

globals.get('/guide', verify(), global.guide.default);

// --- EVENTS ----------------------------------------------------- //
const gifts = new Router({ prefix: '/a/gifts' });
const gift = load('gifts');

gifts.get('/:page?', verify(), gift.get.default);
gifts.delete('/:id', verify(), gift.destroy.default);

// --- HISTORY ---------------------------------------------------- //
const history = new Router({ prefix: '/a/history' });
const story = load('history');

history.get('/:page?', verify(), story.get.default);

// --- WEBHOOKS --------------------------------------------------- //
const { SHOPIFY_API_SECRET } = process.env;
const webhookValidate = receiveWebhook({ secret: SHOPIFY_API_SECRET });
const webhooks = new Router({ prefix: '/webhook' });
const webhooks_list = ['themes/delete', 'app/uninstalled', 'gdpr/customers/redact', 'gdpr/shop/redact', 'gdpr/customers/data_request'];

for(const value of webhooks_list) {
  webhooks.post('/' + value, webhookValidate, webhook);
}

// --- CRON ------------------------------------------------------- //
const crons = new Router({ prefix: '/cron' });
crons.post('/', cron);

// --- QUEUES ----------------------------------------------------- //
const queues = new Router({ prefix: '/queue' });
const queue = load('_queue', { camelize: false });

for(const value of Object.keys(queue)) {
  queues.post('/' + value, queue[value].default);
}

const router = combineRouters(
	globals,
  gifts,
  history,
  webhooks,
  crons,
  queues
)

export default router;