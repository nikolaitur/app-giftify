const { HOST, MONGO_CRON, MAILGUN_API, MAILGUN_PUBLIC } = process.env;
import path from 'path';
import { ObjectId } from 'mongodb';
import { Liquid } from 'liquidjs';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import Fdate from '~/helpers/fdate';
import Shopify from '~/helpers/shopify';

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
    const order = JSON.parse(queue.doc.details),
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
          { fields: { status: 1, settings: 1, active: 1 } }
        );

        if (doc && doc.status == 'active' && doc.active) {
          
          order.line_items.forEach(function(line_item, index) {
            order.line_items[index].image = HOST + '/img?shop=' + queue.store + '.myshopify.com&pid=' + line_item.product_id + '&vid=' + line_item.variant_id
          });

          await ctx.db.collection('gifts').insertOne({ 
            _store: queue.store,
            gift: giftify,
            order: order, // NEED TO BE REDUCED
            created_at: Fdate().format('server')
          });

          const to = giftify.To.split('('), from = giftify.From.split('(');
          const mailgun = new Mailgun(formData);
          const mg = mailgun.client({ username: 'api', key: MAILGUN_API });

          const engine = new Liquid({
            root: path.resolve(__dirname, './../../emails/'),
            extname: '.liquid'
          });
          await engine.renderFile('gift', {
            giftify: {
              to: {
                name: to[0],
                email: to[1].replace(')', '')
              },
              from: {
                name: from[0],
                email: from[1].replace(')', '')
              },
              message: giftify.Message
            },
            line_items: order.line_items,
            shop: {
              name: doc.settings.general.name,
              permanent_domain: queue.store + '.myshopify.com',
              email: doc.settings.general.email,
              logo: doc.settings.general.logo
            },  
            host: HOST
          }).then(function(html) {
            mg.messages.create('mg.giftify.email', {
              to: to[1].replace(')', ''),
              from: queue.store + '<noreply@giftify.email>',
              'h:Reply-To': from[1].replace(')', ''),
              subject: from[0] + ' got you a gift!',
              html: html
            }).catch(function(err) {
              console.log('Error during email Orders Create: ', err);
            });
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