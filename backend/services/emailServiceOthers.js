const nodemailer = require('nodemailer');
require('dotenv').config("../.env");

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ADMIN_EMAIL_OTHER_SERVICES,
    pass: process.env.ADMIN_APP_PASSWORD_OTHER_SERVICES
  },
});

const sendEmail = (to, subject, html) => {
  const mailOptions = {
    from: `Motivational Quote <${process.env.ADMIN_EMAIL_OTHER_SERVICES}>`,
    to,
    subject,
    html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error while sending emails: " + error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendEmail;

