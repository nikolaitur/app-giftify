const { HOOK_ZAPIER } = process.env;

import fetch from 'node-fetch';
import ShopifyApi from 'shopify-api-node';

const getShopInfo = async (shop, accessToken) => {
  const s = new ShopifyApi(
    { shopName: shop, accessToken: accessToken, autoLimit: true }
  );

  const info = await s.shop.get(
    { fields: 'name, email' }
  );

  await fetch(HOOK_ZAPIER, {
		method: 'post',
		body: JSON.stringify({
			name: info.name,
			email: info.email,
			action: 'install',
			app: 'Giftify'
		}),
		headers: {'Content-Type': 'application/json'}
	});

  return info;
}

module.exports = getShopInfo;