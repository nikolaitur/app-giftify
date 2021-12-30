import CryptoJS from 'crypto-js';
import ShopifyApi from 'shopify-api-node';

const Shopify = async (ctx) => {
  const doc = await ctx.db.collection('stores').findOne(
    { _store: ctx.store },
    { fields: { token: 1 } }
  );

  const bytes = CryptoJS.AES.decrypt(doc.token, process.env.SHOPIFY_API_SECRET);
  const token = bytes.toString(CryptoJS.enc.Utf8);

  return new ShopifyApi(
    { shopName: ctx.store, accessToken: token, autoLimit: true }
  );
};

export default Shopify;