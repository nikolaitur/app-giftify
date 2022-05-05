const { HOST } = process.env;
import Shopify from '~/helpers/shopify';

const activate = async (ctx) => {
  const { ...input } = JSON.parse(ctx.request.body);
  const s = await Shopify(ctx);

  try {
    let scriptTagId = null, OS20 = false;

    if (input.active) {

      const s = await Shopify(ctx);
      const themes_list = await s.theme.list(
        { fields: 'id, name, role' }
      );
      let theme_live = null;

      themes_list.forEach((theme) => {
        if (theme.role == 'main') theme_live = theme.id;
      });

      const assets_list = await s.asset.list(
        theme_live
      );

      const cart_json_template = assets_list.filter(function(file) {
        return file.key == 'templates/cart.json';
      });

      if (cart_json_template.length > 0) {
        const asset = await s.asset.get(
          theme_live,
          { 'asset[key]': cart_json_template[0].key }
        );

        const json = JSON.parse(asset.value)
        const mains = Object.entries(json.sections).filter(([id, section]) => id === 'main' || section.type.startsWith("main-"))
        let main_cart_asset = {}, main_cart_file = {}, match = [], schema = {}, acceptsAppBlock = false;

        for (const main of mains) {
          main_cart_asset = assets_list.find((file) => file.key === `sections/${main[1].type}.liquid`);
          main_cart_file = await s.asset.get(
            theme_live,
            { 'asset[key]': main_cart_asset.key }
          );

          match = main_cart_file.value.match(/\{\%\s+schema\s+\%\}([\s\S]*?)\{\%\s+endschema\s+\%\}/m)
          schema = JSON.parse(match[1]);

          if (schema && schema.blocks) {
            acceptsAppBlock = schema.blocks.some((b => b.type === '@app'));
          }

          if (acceptsAppBlock) {
            OS20 = true;
          }
        }
      }

      if (!OS20) {
        const query = `mutation {
          scriptTagCreate(
            input: {
              src: "${ HOST }/app.js"
            }
          )
          {
            scriptTag {
              id
            }
            userErrors {
              field
              message
            }
          }
        }`;
        const response = await s.graphql(query);
        scriptTagId = response.scriptTagCreate.scriptTag.id.split('/').pop();
      }

    } else {
      const doc = await ctx.db.collection('stores').findOne(
        { _store: ctx.store },
        { fields: { scripttag: 1 } }
      );

      if (doc.scripttag) {

        const query = `mutation {
          scriptTagDelete(
            id: "gid://shopify/ScriptTag/${ doc.scripttag }"
          )
          {
            userErrors {
              field
              message
            }
          }
        }`;
        const response = await s.graphql(query);

      }
    }

    await ctx.db.collection('stores').updateOne(
      { _store: ctx.store },
      { $set: { active: input.active, scripttag: scriptTagId } }
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

export default activate;