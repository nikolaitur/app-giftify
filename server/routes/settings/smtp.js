import nodemailer from 'nodemailer';

const smtp = async (ctx) => {
  const { ...input } = JSON.parse(ctx.request.body);

  try {
    let smtp_options = {
      host: input.host,
      port: input.port
    };
    if (parseInt(input.port) == 465) {
      smtp_options.secure = true;
    }
    if (input.authentication) {
      smtp_options.auth = {
        user: input.username,
        pass: input.password
      };
    }
    const transporter = nodemailer.createTransport(smtp_options);
    transporter.verify(function (error, success) {
      if (error) {
        ctx.status = 400;
        ctx.body = {
          status: 'error',
          message: error
        }
      } else {
        ctx.body = {
          status: 'success'
        };
      }
    });

  } catch(e) {
    console.log(ctx.store, e);
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: e
    }
  }
};

export default smtp;