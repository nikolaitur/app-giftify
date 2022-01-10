import ShopifyApi from 'shopify-api-node';

const getSubscriptionUrl = async (shop, accessToken, returnUrl, trial, dev, plan = 1) => {
  const query = `mutation {
    appSubscriptionCreate(
      name: "${ plan == 1 ? 'Giftify Basic Plan' : 'Giftify Premium Plan' }"
      returnUrl: "${returnUrl}"
      test: ${ dev ? true : null }
      ${ trial > 0 ? "trialDays: " + trial : "" }
      lineItems: [
        {
          plan: {
            appRecurringPricingDetails: {
              price: { amount: ${ plan == 1 ? '5' : '10' }, currencyCode: USD }
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