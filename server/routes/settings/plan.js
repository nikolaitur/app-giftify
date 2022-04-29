const { HOST, NODE_ENV } = process.env;
import CryptoJS from 'crypto-js';
import ShopifyApi from 'shopify-api-node';
import subscribe from '../../subscribe';

const plan = async (ctx) => {

	const store = await ctx.db.collection('stores').findOne(
    { _store: ctx.store },
    { fields: { plan: 1, token: 1 } }
  );
  const shop = ctx.store + '.myshopify.com';

	if (ctx.request.method == 'POST') {
		const { ...input } = JSON.parse(ctx.request.body);
		const dev = NODE_ENV !== "production" || ctx.store == 'minion-made-apps' || ctx.store == 'minionmadeapps';
		const trial = 7 - parseInt(Math.floor((Date.now() - parseInt(store._id.toString().substring(0,8), 16) * 1000) / (60*60*24*1000)));

		const bytes = CryptoJS.AES.decrypt(store.token, process.env.SHOPIFY_API_SECRET);
	  const token = bytes.toString(CryptoJS.enc.Utf8);

		let redirect = null;

		if (input.plan != store.plan) {

		  redirect = await subscribe(shop, token, `${ HOST }/confirm?shop=${ shop }&action=upgrade`, trial, dev, parseInt(input.plan));

		}
		
	  ctx.body = {
	    status: 'success',
	    redirect: redirect
	  };

	} else {

	  ctx.body = {
	    status: 'success',
	    plan: store.plan
	  };

	}
};

export default plan;