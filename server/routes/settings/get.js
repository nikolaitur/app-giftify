import config from './../../scripttag/partials/_config';

const get = async (ctx) => {
  const store = await ctx.db.collection('stores').findOne(
    { _store: ctx.store },
    { fields: { settings: 1, plan: 1 } }
  );

  Object.assign(config, store.settings);

  ctx.body = {
    status: 'success',
    data: config,
    plan: store.plan
  };
};

export default get;