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

  const confirmation_tmpl = fs.readFileSync(path.join(__dirname, './../../emails/gift.liquid'), 'utf8');
  const update_tmpl = fs.readFileSync(path.join(__dirname, './../../emails/ship.liquid'), 'utf8');

  if (confirmation_tmpl.toString() == input.pro.emails.confirmation.tmpl) {
    input.pro.emails.confirmation.tmpl = '';
  }
  if (update_tmpl.toString() == input.pro.emails.update.tmpl) {
    input.pro.emails.update.tmpl = '';
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