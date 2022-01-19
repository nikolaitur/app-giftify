import fs from 'fs';
import path from 'path';
import config from './../../scripttag/partials/_config';

const get = async (ctx) => {
  const store = await ctx.db.collection('stores').findOne(
    { _store: ctx.store },
    { fields: { settings: 1, plan: 1 } }
  );

  Object.assign(config, store.settings);

  if (config.pro.emails.confirmation.tmpl == '') {
    const confirmation_tmpl = fs.readFileSync(path.join(__dirname, './../../emails/gift.liquid'), 'utf8');
    config.pro.emails.confirmation.tmpl = confirmation_tmpl.toString();
  }

  if (config.pro.emails.update.tmpl == '') {
    const update_tmpl = fs.readFileSync(path.join(__dirname, './../../emails/ship.liquid'), 'utf8');
    config.pro.emails.update.tmpl = update_tmpl.toString();
  }

  ctx.body = {
    status: 'success',
    data: config,
    plan: store.plan
  };
};

export default get;