const { MONGO_CRON } = process.env;
import { ObjectId } from 'mongodb';
import Gall from '~/helpers/gall';
import Shopify from '~/helpers/shopify';

const publish = async (ctx) => {
  const queue = ctx.request.body;

  if (queue.secret != MONGO_CRON) {
    console.log('401 Mongo Cron');
    ctx.body = {
      status: 'success'
    };
    return;
  }

  try {
    ctx.store = queue.store;

    const s = await Shopify(ctx);
    const theme_update = await s.theme.update(
      queue.doc.details.theme,
      { role: 'main' }
    );

    if (theme_update.errors) {
      console.log('Error publishing theme: ' + queue.details.theme + ', for: ' + queue.store);
      ctx.body = {
        status: 'success'
      };
      return;
    }

    await ctx.db.collection('events').updateOne(
      { _id: ObjectId(queue.doc.details.event_id.$oid) },
      { $set: { status: 'completed' } },
      { new: true }
    );
    await ctx.db.collection('queue').deleteOne(
      { _id: ObjectId(queue.doc._id.$oid) }
    );

    Gall('event-completed', {
      title: queue.doc.details.title,
      theme: queue.doc.details.theme,
      theme_name: theme_update.name
    }, ctx);

  } catch (e) {
    console.log('Publish error for ' + queue.store, e);
  }

  ctx.body = {
    status: 'success'
  };
};

export default publish;