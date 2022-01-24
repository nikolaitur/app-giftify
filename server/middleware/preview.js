const { HOST } = process.env;
import { Liquid } from 'liquidjs';

const handlePreview = async (ctx) => {
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
    { fields: { status: 1, plan: 1, settings: 1 } }
  );

  if (!doc || doc.status != 'active' || doc.plan == 1) {
    ctx.redirect(`/auth?shop=${shop}`);
  } else {
    ctx.status = 200;

    try {
      const engine = new Liquid();
      const data = {
        giftify: {
          to: {
            name: 'John Recipient',
            email: 'smith@recipient.com'
          },
          from: {
            name: 'Joe Sender',
            email: 'joe@sender.com'
          },
          message: 'Happy Birthday! This is your gift message :)'
        },
        order: {},
        shop: {
          name: doc.settings.general.name,
          permanent_domain: store + '.myshopify.com',
          email: doc.settings.general.email,
          logo: doc.settings.general.logo
        },  
        host: HOST
      };
      const tmpl = await engine.parseAndRender(doc.settings.pro.preview.data.tmpl, data);
      const subject = await engine.parseAndRender(doc.settings.pro.preview.data.subject, data);

      ctx.body = `
        <div style="padding:20px">
        <style>body{box-sizing:border-box;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;}</style>
        <h3 style="margin:0;padding:0"><span style="color:#009870">Subject:</span> ${ subject }</h3>
        <hr style="margin-bottom:20px" />
        ${ tmpl }
        </div>
      `;

    } catch (e) {
      ctx.body = `
        <div style="padding:20px">
        <style>body{box-sizing:border-box;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;}</style>
        ${ e }
        </div>
      `;
    }
  }
};

export default handlePreview;