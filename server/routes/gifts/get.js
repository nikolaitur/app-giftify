import Fdate from '~/helpers/fdate';
import Shopify from '~/helpers/shopify';

const get = async (ctx) => {
  const page = ctx.params.page ? ctx.params.page : 1;
  const items = await ctx.db.collection('gifts').find(
    { _store: ctx.store },
    { limit: 11, skip: 10 * (page - 1), sort: { _id: -1 }, fields: { _store: 0 } }
  ).toArray();

  if (ctx.params.page) {
    ctx.body = {
      status: 'success',
      items: items
    };
    return;
  }

  ctx.body = {
    status: 'success',
    items: items
  };
};

export default get;