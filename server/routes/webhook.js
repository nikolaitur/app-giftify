const webhook = async (ctx) => {
  if (ctx._matchedRoute.indexOf('gdpr') != -1) {
    ctx.body = {
      status: 'success'
    };
    return;
  }

  await ctx.db.collection('queue').insertOne({
    _action: ctx._matchedRoute.replace(/\//g, '-').replace('-webhook-', ''),
    _store: ctx.state.webhook.domain.replace('.myshopify.com', ''),
    details: JSON.stringify(ctx.state.webhook.payload)
  });

  ctx.body = {
    status: 'success'
  };
};

export default webhook;