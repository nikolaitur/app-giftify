import { ObjectId } from 'mongodb';
import Gall from '~/helpers/gall';

const destroy = async (ctx) => {
  try {
    const item = await ctx.db.collection('gifts').findOne(
      { _id: ObjectId(ctx.params.id) }
    );
    await ctx.db.collection('gifts').deleteOne(
      { _id: ObjectId(ctx.params.id) }
    );

    await Gall('gift-destroy', {
      title: item.title
    }, ctx);

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

export default destroy;