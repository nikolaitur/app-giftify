const nonce = require('nonce');
const createNonce = nonce();

const { HOST, SHOPIFY_API_KEY, SCOPES } = process.env;

const start = async (ctx) => {
  const { query } = ctx.request.body;
  const scopes = SCOPES;
  const redirect_uri = HOST + '/auth/callback';

  if (!query.shop) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Required Query or Shop missing." });
  }

  const authUrl = `https://${query.shop}/admin/oauth/authorize?client_id=${
    SHOPIFY_API_KEY
  }&scope=${scopes}&redirect_uri=${redirect_uri}&state=${createNonce()}`;

  ctx.res.status(200).json({
    redirectTo: authUrl,
  });
};

export default start;