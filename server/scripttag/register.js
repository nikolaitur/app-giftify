import ShopifyApi from 'shopify-api-node';

const registerScriptTag = async (HOST, shop, accessToken) => {
  const query = `mutation {
    scriptTagCreate(
      input: {
        src: "${ HOST }/app.js"
      }
    )
    {
      userErrors {
        field
        message
      }
    }
  }`;

  const client = new ShopifyApi(
    { shopName: shop, accessToken: accessToken, autoLimit: true }
  );

  await client.graphql(query);

};

module.exports = registerScriptTag;