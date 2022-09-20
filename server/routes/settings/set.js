import fs from 'fs';
import path from 'path';
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

  const doc = await ctx.db.collection('stores').findOne(
    { _store: ctx.store },
    { fields: { plan: 1 } }
  );

  const confirmation_tmpl = fs.readFileSync(path.join(__dirname, './../../emails/confirmation.liquid'), 'utf8');
  const update_tmpl = fs.readFileSync(path.join(__dirname, './../../emails/update.liquid'), 'utf8');

  delete input.pro.emails.confirmation.default;
  delete input.pro.emails.update.default;

  if (confirmation_tmpl.toString() == input.pro.emails.confirmation.tmpl || doc.plan == 1) {
    input.pro.emails.confirmation.tmpl = '';
  }
  if (update_tmpl.toString() == input.pro.emails.update.tmpl || doc.plan == 1) {
    input.pro.emails.update.tmpl = '';
  }

  input.pro.preview = {
    data: {
      tmpl: '',
      subject: ''
    }
  };

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