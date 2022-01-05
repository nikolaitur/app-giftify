const get = async (ctx) => {
  const store = await ctx.db.collection('stores').findOne(
    { _store: ctx.store },
    { fields: { settings: 1, info: 1 } }
  );

  ctx.body = {
    status: 'success',
    data: {
    	settings: store.settings,
    	info: store.info
    }
  };
};

export default get;