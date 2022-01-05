import ShopifyApi from 'shopify-api-node';

const getShopInfo = async (shop, accessToken) => {
  const s = new ShopifyApi(
    { shopName: shop, accessToken: accessToken, autoLimit: true }
  );

  const info = await s.shop.get(
    { fields: 'name, email' }
  );

  return info;
}

module.exports = getShopInfo;