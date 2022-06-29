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
          { fields: { status: 1, settings: 1, active: 1, plan: 1 } }
        );

        if (doc && doc.status == 'active' && doc.active) {
          
          order.line_items.forEach(function(line_item, index) {
            order.line_items[index].image = HOST + '/img?shop=' + queue.store + '.myshopify.com&pid=' + line_item.product_id + '&vid=' + line_item.variant_id
          });

          const blacklist = ['admin_graphql_api_id', 'browser_ip', 'cancel_reason', 'cancelled_at', 'cart_token', 'client_details', 'closed_at', 'confirmed', 'device_id', 'landing_site', 'landing_site_ref', 'reference', 'referring_site', 'source_identifier', 'source_name', 'source_url', 'subtotal_price_set',
          'total_discounts_set', 'total_line_items_price_set', 'total_price_set', 'total_shipping_price_set', 'total_tax_set', 'user_id', 'payment_details'];

          blacklist.forEach(function(key) {
            delete order[key];
          });

          Object.keys(order).forEach(function(key) {
            if (key.indexOf('current_') > -1) {
              delete order[key];
            }
          });

          await ctx.db.collection('gifts').insertOne({ 
            _store: queue.store,
            gift: giftify,
            order: order,
            created_at: Fdate().format('server')
          });

          ctx.store = queue.store;

          const s = await Shopify(ctx);
          const order_update = await s.order.update(
            order.id,
            { tags: order.tags + ',Giftify' }
          );

          if (order_update.errors) {
            console.log('Error adding tag: ' + order.id + ', for: ' + queue.store);
          }

          const to = giftify.To.split('('), from = giftify.From.split('(');
          const mailgun = new Mailgun(formData);
          const mg = mailgun.client({ username: 'api', key: MAILGUN_API });

          const engine = new Liquid();
          const confirmation_tmpl = fs.readFileSync(path.join(__dirname, './../../emails/confirmation.liquid'), 'utf8');
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

          if (doc.plan == 2 && doc.settings.pro.emails.confirmation.tmpl != '') {
            render_body = await engine.parseAndRender(doc.settings.pro.emails.confirmation.tmpl, data);
            render_subject = await engine.parseAndRender(doc.settings.pro.emails.confirmation.subject, data);
          } else {
            render_body = await engine.parseAndRender(confirmation_tmpl, data);
            render_subject = from[0] + ' got you a gift!';
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
                console.log('Error during email SMTP Orders Create: ', err);

                mg.messages.create('mg.giftify.email', {
                  to: to[1].replace(')', ''),
                  from: doc.settings.general.name + '<noreply@mg.giftify.email>',
                  'h:Reply-To': from[1].replace(')', ''),
                  subject: render_subject,
                  html: render_body
                }).catch(function(err) {
                  console.log('Error during email SMTP/MG Orders Create: ', err);
                });
              }
            });

          } else {
            mg.messages.create('mg.giftify.email', {
              to: to[1].replace(')', ''),
              from: doc.settings.general.name + '<noreply@mg.giftify.email>',
              'h:Reply-To': from[1].replace(')', ''),
              subject: render_subject,
              html: render_body
            }).catch(function(err) {
              console.log('Error during email MG Orders Create: ', err);
            });
          }
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