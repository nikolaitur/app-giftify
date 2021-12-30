import CryptoJS from 'crypto-js';
import ShopifyApi from 'shopify-api-node';

const confirm = async (ctx) => {
  if (!ctx.query.shop || !ctx.query.charge_id) {
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
    { fields: { status: 1, token: 1 } }
  );

  if (doc && doc.status == 'active') {
  	ctx.redirect(`/?shop=${shop}`);
  }

  const bytes = CryptoJS.AES.decrypt(doc.token, process.env.SHOPIFY_API_SECRET);
  const token = bytes.toString(CryptoJS.enc.Utf8);

  const s = new ShopifyApi(
    { shopName: store, accessToken: token, autoLimit: true }
  );
  const charge = await s.recurringApplicationCharge.get(ctx.query.charge_id,
  	{ fields: 'id, status' }
  );

  if (charge && charge.status == 'active') {
    await ctx.db.collection('stores').updateOne(
      { _store: store },
      { $set: { status: 'active' } }
    );
    ctx.redirect(`/?shop=${shop}`);
  } else {
    ctx.redirect(`/auth?shop=${shop}`);
  }
}

module.exports = confirm;