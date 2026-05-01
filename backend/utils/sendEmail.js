import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Auth App" <no-reply@test.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
  });
};

export default sendEmail;
