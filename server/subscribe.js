import ShopifyApi from 'shopify-api-node';

const getSubscriptionUrl = async (shop, accessToken, returnUrl, trial, dev) => {
  const query = `mutation {
    appSubscriptionCreate(
      name: "Theme on Time Monthly Plan"
      returnUrl: "${returnUrl}"
      test: ${ dev ? true : null }
      ${ trial > 0 ? "trialDays: " + trial : "" }
      lineItems: [
        {
          plan: {
            appRecurringPricingDetails: {
              price: { amount: 5, currencyCode: USD }
            }
          }
        }
      ]
    )
    {
      userErrors {
        field
        message
      }
      confirmationUrl
      appSubscription {
        id
      }
    }
  }`;

  const client = new ShopifyApi(
    { shopName: shop, accessToken: accessToken, autoLimit: true }
  );
  const response = await client.graphql(query);

  return response.appSubscriptionCreate.confirmationUrl;
};

module.exports = getSubscriptionUrl;