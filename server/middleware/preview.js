const { HOST } = process.env;
import { Liquid } from 'liquidjs';

const handlePreview = async (ctx) => {
  if (!ctx.query.shop) {
    ctx.status = 401;
    ctx.body = {
      status: 'error',
      message: 'You are not authorized'
    }
    return;
  }
  const shop = ctx.query.shop;
  const store = shop.replace('.myshopify.com', '');
  const doc = await ctx.db.collection('stores').findOne(
    { _store: store },
    { fields: { status: 1, plan: 1, settings: 1 } }
  );

  if (!doc || doc.status != 'active' || doc.plan == 1) {
    ctx.redirect(`/auth?shop=${shop}`);
  } else {
    ctx.status = 200;

    try {
      const engine = new Liquid();
      const data = {
        giftify: {
          to: {
            name: 'John Recipient',
            email: 'smith@recipient.com'
          },
          from: {
            name: 'Joe Sender',
            email: 'joe@sender.com'
          },
          message: 'Happy Birthday! This is your gift message :)'
        },
        order: {
          id: 1234567890,
          confirmed: true,
          created_at: '2022-01-01T09:00:00-5:00',
          currency: 'USD',
          customer_locale: 'en',
          email: 'joe@sender.com',
          financial_status: 'paid',
          gateway: 'bogus',
          name: '#0123',
          note: 'Sample note',
          note_attributes: [
            { name: 'Attr Name', value: 'Attr Value' },
            { name: 'Attr Name 1', value: 'Attr Value 2' }
          ],
          number: 1,
          order_number: 1001,
          order_status_url: 'https://www.yourstore.com/status_url/of/your/order',
          phone: '1200123456789',
          subtotal_price: '5.00',
          tags: 'Tag1,Tag2',
          tax_lines: [
            { price: 0.04, rate: 0.00375, title: 'Kings County Tax' },
            { price: 0.40, rate: 0.04, title: 'New York State Tax' },
            { price: 0.45, rate: 0.045, title: 'Brooklyn City Tax' },
          ],
          taxes_included: false,
          test: true,
          token: '314cfc6eb11111111111111',
          total_discounts: '0.00',
          total_line_items_price: '5.00',
          total_price: '10.79',
          total_tax: '0.89',
          total_weight: 0,
          billing_address: {
            first_name: 'Joe',
            address1: '100 Billing Street',
            phone: '1200123456789',
            city: 'New York',
            zip: '11099',
            province: 'New York',
            country: 'United States',
            last_name: 'Sender',
            address2: 'Apt. 909',
            company: 'Sender Co.',
            name: 'Joe Sender',
            country_code: 'US',
            province_code: 'NY'
          },
          shipping_address: {
            first_name: 'John',
            address1: '100 Shipping Street',
            phone: '98765321200',
            city: 'New York',
            zip: '10001',
            province: 'New York',
            country: 'United States',
            last_name: 'Recipient',
            address2: 'Apt. 101',
            company: 'Recipient Co.',
            name: 'John Recipient',
            country_code: 'US',
            province_code: 'NY'
          },
          customer: {
            id: 123456789,
            email: 'joe@sender.com',
            accepts_marketing: true,
            created_at: '2022-01-01T09:00:00-5:00',
            first_name: 'Joe',
            last_name: 'Sender',
            orders_count: 1,
            total_spent: '5.00',
            note: 'Customer Note',
            phone: '1200123456789',
            tags: 'CustomerTag1,CustomerTag2'
          },
          line_items: [
            {
              id: 101,
              name: 'T-Shirt',
              title: 'T-Shirt',
              price: '5.00',
              product_id: 2,
              properties: {
                prop1: 'val1',
                prop2: 'val2'
              },
              quantity: 1,
              requires_shipping: true,
              sku: 'tshirt0001',
              variant_title: 'Red',
              vendor: 'Shirt Company Co',
              image: 'https://giftify-mm.herokuapp.com/tshirt.jpg'
            }
          ],
          shipping_lines: [
            {
              id: 1010101,
              code: 'standard-shipping',
              price: '4.90',
              title: 'Standard Shipping'
            }
          ]
        },
        shop: {
          name: doc.settings.general.name,
          permanent_domain: store + '.myshopify.com',
          email: doc.settings.general.email,
          logo: doc.settings.general.logo
        },  
        host: HOST
      };
      const tmpl = await engine.parseAndRender(doc.settings.pro.preview.data.tmpl, data);
      const subject = await engine.parseAndRender(doc.settings.pro.preview.data.subject, data);

      ctx.body = `
        <div style="padding:20px">
        <style>body{box-sizing:border-box;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;}</style>
        <h3 style="margin:0;padding:0"><span style="color:#009870">Subject:</span> ${ subject }</h3>
        <hr style="margin-bottom:20px" />
        ${ tmpl }
        </div>
      `;

    } catch (e) {
      ctx.body = `
        <div style="padding:20px">
        <style>body{box-sizing:border-box;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;}</style>
        ${ e }
        </div>
      `;
    }
  }
};

export default handlePreview;