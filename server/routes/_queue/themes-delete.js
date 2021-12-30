const { MONGO_CRON } = process.env;
import { ObjectId } from 'mongodb';
import Gall from '~/helpers/gall';

const themesDelete = async (ctx) => {
  const queue = ctx.request.body;

  if (queue.secret != MONGO_CRON) {
    console.log('401 Mongo Cron');
    ctx.body = {
      status: 'success'
    };
    return;
  }

  try {
    const items = await ctx.db.collection('events').find(
      { theme: queue.doc.details.id.$numberDouble }
    ).toArray();

    await ctx.db.collection('events').deleteMany(
      { theme: queue.doc.details.id.$numberDouble }
    );

    await ctx.db.collection('queue').deleteOne(
      { _id: ObjectId(queue.doc._id.$oid) }
    );

    const elements = items.map((item) => {
      return {
        details: {
          title: item.title,
          theme: item.theme,
          theme_name: item._theme_name
        }
      }
    });

    ctx.store = queue.store;

    await Gall('themes-delete', elements, ctx);

  } catch (e) {
    console.log('Webhook Themes Delete error for: ' + queue.store, e);
  }

  ctx.body = {
    status: 'success'
  };
};

export default themesDelete;