import jwt from 'jsonwebtoken';

const verify = handler => {
  return async (ctx, next) => {
    const token = ctx.request.header.authorization.replace(/Bearer /, '');

    try {
      const decoded = await jwt.verify(
        token,
        process.env.SHOPIFY_API_SECRET,
        { clockTolerance: 300 }
      );

      ctx.request.sessionToken = decoded;
      ctx.request.shopDomain = decoded.dest;
      ctx.request.shopName = decoded.dest.replace('https://', '');
      ctx.store = ctx.request.shopName.replace('.myshopify.com', '');

      await next();

      ctx.request;

    } catch (err) {
	    ctx.status = 401;
	    ctx.body = {
	      status: 'error',
	      message: err.message
	    }
    }
  };
};


export default verify;