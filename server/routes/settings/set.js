import Validate from '~/helpers/validate';

const set = async (ctx) => {
  const { ...input } = JSON.parse(ctx.request.body);
  if (Validate('settings', input) == 'error') {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Form contains errors'
    }
    return;
  }

  try {
    await ctx.db.collection('stores').updateOne(
      { _store: ctx.store },
      { $set: { settings: input } }
    );

    ctx.body = {
      status: 'success'
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

export default set;