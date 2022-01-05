const get = async (ctx) => {
  const settings = {};

  ctx.body = {
    status: 'success',
    settings: settings
  };
};

export default get;