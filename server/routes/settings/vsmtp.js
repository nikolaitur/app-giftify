import nodemailer from 'nodemailer';

const vsmtp = async (ctx) => {
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
    let info = await transporter.verify();

    ctx.body = {
      status: 'success'
    };

  } catch(e) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: e.response
    }
  }
};

export default vsmtp;