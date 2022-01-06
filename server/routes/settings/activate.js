const { HOST } = process.env;
import Shopify from '~/helpers/shopify';

const activate = async (ctx) => {
  const { ...input } = JSON.parse(ctx.request.body);
  const s = await Shopify(ctx);

  try {
    let scriptTagId = null;

    if (input.active) {
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

    } else {
      const doc = await ctx.db.collection('stores').findOne(
        { _store: ctx.store },
        { fields: { scripttag: 1 } }
      );

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