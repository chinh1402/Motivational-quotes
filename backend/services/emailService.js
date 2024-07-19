const nodemailer = require('nodemailer');
require('dotenv').config();

// console.log(process.env.ADMIN_EMAIL)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_GMAIL_PASSWORD
  }
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: `Motivational Quote <${process.env.ADMIN_EMAIL}>`,
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendEmail;
