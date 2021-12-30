import Fdate from '~/helpers/fdate';

const get = async (ctx) => {
  const page = ctx.params.page ? ctx.params.page : 1;
  const items = await ctx.db.collection('history').find(
    { _store: ctx.store },
    { limit: 11, skip: 10 * (page - 1), sort: { _id: -1 } }
  ).map((item) => {
  	const ObjectIdToMili = parseInt(item._id.toString().substring(0, 8), 16) * 1000;
    item.created_at = Fdate(ObjectIdToMili, ctx.request.headers['x-offset'] * -1).format('client');
    if (item.details.date) {
    	item.details.date = Fdate(item.details.date, ctx.request.headers['x-offset'] * -1).format('client');
    }
    return item;
  }).toArray();

  ctx.body = {
    status: 'success',
    items: items
  };
};

export default get;