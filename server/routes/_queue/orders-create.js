const { MONGO_CRON, MAILGUN_API, MAILGUN_PUBLIC } = process.env;
import { ObjectId } from 'mongodb';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import Fdate from '~/helpers/fdate';

const ordersCreate = async (ctx) => {
  const queue = ctx.request.body;

  if (queue.secret != MONGO_CRON) {
    console.log('401 Mongo Cron');
    ctx.body = {
      status: 'success'
    };
    return;
  }

  try {
    const order = queue.doc.details,
          giftify = {};

    if (order.note_attributes.length) {
      order.note_attributes.forEach(function(attr) {
        if (attr.name.indexOf('Giftify') != -1) {
          giftify[attr.name.split(' • ')[1]] = attr.value;
        }
      });

      if (giftify.To) {
        const doc = await ctx.db.collection('stores').findOne(
          { _store: queue.store },
          { fields: { status: 1, 'settings.active': 1 } }
        );

        if (doc && doc.status == 'active' && doc.settings.active) {
          await ctx.db.collection('gifts').insertOne({ 
            _store: queue.store,
            gift: giftify,
            order: JSON.stringify(order), // NEED TO BE REDUCED
            created_at: Fdate().format('server')
          });

          const to = giftify.To.split('(');
          const mailgun = new Mailgun(formData);
          const mg = mailgun.client({ username: 'api', key: MAILGUN_API });

          await mg.messages.create('mg.galianowine.com', {
            to: to[1].replace(')', ''),
            from: queue.store + '<noreply@mg.galianowine.com>',
            subject: to[0] + ' got you a gift!',
            html: 'Hello, this is sample email'
          }).catch(function(err) {
            console.log('Error during email Orders Create: ', err);
          });
        }
      }
    }

    await ctx.db.collection('queue').deleteOne(
      { _id: ObjectId(queue.doc._id.$oid) }
    );

  } catch (e) {
    console.log('Webhook Orders Create error for: ' + queue.store, e);
  }

  ctx.body = {
    status: 'success'
  };
};

export default ordersCreate;