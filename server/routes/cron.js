const { MONGO_CRON } = process.env;

const cron = async (ctx) => {
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
      { status: 'scheduled', _utc: { $lte: new Date(queue.date + ':00.000Z') } }
    ).toArray();

    if (items.length) {
      await ctx.db.collection('events').updateMany(
        { status: 'scheduled', _utc: { $lte: new Date(queue.date + ':00.000Z') } },
        { $set: { status: 'run' } }
      );
      await ctx.db.collection('queue').insertMany(items.map((item) => {
        return {
          _action: 'publish',
          _store: item._store,
          details: {
            event_id: item._id,
            utc: item._utc,
            theme: item.theme,
            title: item.title
          }
        }
      }));
    }
  } catch(e) {
    console.log('Cron Error', e);
  }

  ctx.body = {
    status: 'success'
  };
};

export default cron;