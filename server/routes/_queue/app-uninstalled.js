const { MONGO_CRON } = process.env;
import { ObjectId } from 'mongodb';

const appUninstalled = async (ctx) => {
  const queue = ctx.request.body;

  if (queue.secret != MONGO_CRON) {
    console.log('401 Mongo Cron');
    ctx.body = {
      status: 'success'
    };
    return;
  }

  try {
    await ctx.db.collection('stores').updateOne(
      { _store: queue.store },
      { 
        $set: { status: 'uninstalled' },
        $unset: { token: "" } 
      }
    );

    await ctx.db.collection('queue').deleteOne(
      { _id: ObjectId(queue.doc._id.$oid) }
    );

  } catch (e) {
    console.log('App Uninstalled error for: ' + queue.store, e);
  }

  ctx.body = {
    status: 'success'
  };
};

export default appUninstalled;