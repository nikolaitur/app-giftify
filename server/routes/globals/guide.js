const guide = async (ctx) => {
  const store = await ctx.db.collection('stores').findOne(
    { _store: ctx.store },
    { fields: { guide: 1, active: 1 } }
  );

  if (store.guide) {
    await ctx.db.collection('stores').updateOne(
      { _store: ctx.store },
      { $set: { guide: false } }
    );
  }

  ctx.body = {
    status: 'success',
    guide: store.guide,
    active: store.active
  };
};

export default guide;