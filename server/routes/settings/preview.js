const { HOST } = process.env;

const preview = async (ctx) => {
  const { ...input } = JSON.parse(ctx.request.body);

  try {
    await ctx.db.collection('stores').updateOne(
      { _store: ctx.store },
      { $set: { 'settings.pro.preview': input } }
    );

    ctx.body = {
      status: 'success',
      url: HOST + '/preview?shop=' + ctx.store + '.myshopify.com'
    };

  } catch(e) {
    console.log(ctx.store, e);
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: e
    }
  }
};

export default preview;