import fs from 'fs';
import path from 'path';
import init from './../../scripttag/partials/_config';

const get = async (ctx) => {
  const store = await ctx.db.collection('stores').findOne(
    { _store: ctx.store },
    { fields: { settings: 1, plan: 1 } }
  );

  const superReplace = (object, value) => {
    let replace = {};

    Object.keys(object).forEach(prop => {
      if (value[prop] !== undefined) {
        if (typeof object[prop] === 'object' && object[prop] !== null) {
          replace[prop] = superReplace(object[prop], value[prop]);
        } else replace[prop] = value[prop];
      } else replace[prop] = object[prop];
    });

    Object.keys(value).forEach(prop => {
      if (object[prop] === undefined) {
        replace[prop] = value[prop];
      }
    });

    return replace;
  };
  let config = superReplace(init, store.settings);

  if (!config.pro.emails) {
    config.pro.emails = {}
  }

  const confirmation_tmpl = fs.readFileSync(path.join(__dirname, './../../emails/confirmation.liquid'), 'utf8');
  config.pro.emails.confirmation.default = confirmation_tmpl.toString();

  if (config.pro.emails.confirmation.tmpl == '') {
    config.pro.emails.confirmation.tmpl = confirmation_tmpl.toString();
  }

  const update_tmpl = fs.readFileSync(path.join(__dirname, './../../emails/update.liquid'), 'utf8');
  config.pro.emails.update.default = update_tmpl.toString();

  if (config.pro.emails.update.tmpl == '') {
    config.pro.emails.update.tmpl = update_tmpl.toString();
  }

  ctx.body = {
    status: 'success',
    data: config,
    plan: store.plan
  };
};

export default get;