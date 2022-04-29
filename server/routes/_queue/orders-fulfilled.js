const { HOST, MONGO_CRON, MAILGUN_API, MAILGUN_PUBLIC } = process.env;
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { ObjectId } from 'mongodb';
import { Liquid } from 'liquidjs';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import Fdate from '~/helpers/fdate';
import Shopify from '~/helpers/shopify';

const ordersFulfilled = async (ctx) => {
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
          { fields: { status: 1, plan: 1, settings: 1, active: 1 } }
        );

        if (doc && doc.status == 'active') {
          await ctx.db.collection('gifts').updateOne(
            { 'order.id': order.id }, 
            { '$set': { 'order.fulfillment_status': order.fulfillment_status } }
          );

          if (doc.plan == 2 && doc.active && doc.settings.pro.updates) {
            order.line_items.forEach(function(line_item, index) {
              order.line_items[index].image = HOST + '/img?shop=' + queue.store + '.myshopify.com&pid=' + line_item.product_id + '&vid=' + line_item.variant_id
            });
            order.fulfillment = order.fulfillments ? order.fulfillments[0] : {};

            const to = giftify.To.split('('), from = giftify.From.split('(');
            const mailgun = new Mailgun(formData);
            const mg = mailgun.client({ username: 'api', key: MAILGUN_API });

            const engine = new Liquid();
            const update_tmpl = fs.readFileSync(path.join(__dirname, './../../emails/update.liquid'), 'utf8');
            const data = {
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
              order: order,
              shop: {
                name: doc.settings.general.name,
                permanent_domain: queue.store + '.myshopify.com',
                email: doc.settings.general.email,
                logo: doc.settings.general.logo
              },  
              host: HOST
            };

            let render_body = '';
            let render_subject = '';

            if (doc.plan == 2 && doc.settings.pro.emails.update.tmpl != '') {
              render_body = await engine.parseAndRender(doc.settings.pro.emails.update.tmpl, data);
              render_subject = await engine.parseAndRender(doc.settings.pro.emails.update.subject, data)
            } else {
              render_body = await engine.parseAndRender(update_tmpl, data);
              render_subject = 'A shipment for your gift is on the way!';
            }

            if (doc.plan == 2 && doc.settings.pro.smtp.active) {
              let smtp_options = {
                host: doc.settings.pro.smtp.host,
                port: doc.settings.pro.smtp.port
              };
              if (parseInt(doc.settings.pro.smtp.port) == 465) {
                smtp_options.secure = true;
              }
              if (doc.settings.pro.smtp.authentication) {
                smtp_options.auth = {
                  user: doc.settings.pro.smtp.username,
                  pass: doc.settings.pro.smtp.password
                };
              }

              const transporter = nodemailer.createTransport(smtp_options);
              transporter.sendMail({
                to: to[1].replace(')', ''),
                from: doc.settings.general.name + '<' + doc.settings.general.email + '>',
                replyTo: from[1].replace(')', ''),
                subject: render_subject,
                html: render_body
              }, function(err, info) {
                if (err) {
                  console.log('Error during email SMTP Orders Fulfilled: ', err);

                  mg.messages.create('mg.giftify.email', {
                    to: to[1].replace(')', ''),
                    from: doc.settings.general.name + '<noreply@giftify.email>',
                    'h:Reply-To': from[1].replace(')', ''),
                    subject: render_subject,
                    html: render_body
                  }).catch(function(err) {
                    console.log('Error during email SMTP/MG Orders Fulfilled: ', err);
                  });
                }
              });

            } else {
              mg.messages.create('mg.giftify.email', {
                to: to[1].replace(')', ''),
                from: doc.settings.general.name + '<noreply@giftify.email>',
                'h:Reply-To': from[1].replace(')', ''),
                subject: render_subject,
                html: render_body
              }).catch(function(err) {
                console.log('Error during email MG Orders Fulfilled: ', err);
              });
            }
          }
        }
      }
    }

    await ctx.db.collection('queue').deleteOne(
      { _id: ObjectId(queue.doc._id.$oid) }
    );

  } catch (e) {
    console.log('Webhook Orders Fulfilled error for: ' + queue.store, e);
  }

  ctx.body = {
    status: 'success'
  };
};

export default ordersFulfilled;