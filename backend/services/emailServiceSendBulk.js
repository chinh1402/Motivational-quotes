const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config("../.env");

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  pool: true, 
  // server can handle max 7 connections simul, so change this to 6 just to be safe
  maxConnections: 6,
  maxMessages: 500,
  auth: {
    user: process.env.ADMIN_EMAIL_BULK_SENDING,
    pass: process.env.ADMIN_APP_PASSWORD_BULK_SENDING
  },
});

const sendEmail = (to, subject, html) => {
  const token = jwt.sign(
    { email: to }, // Payload (email address)
    process.env.JWT_SECRET, // Secret key
    { expiresIn: '7d' } // Token expiry (optional)
  );
  
  // Unsubscribe link with the JWT token
  const unsubscribeUrl = `https://c9a9-59-153-220-160.ngrok-free.app/api/unsubscribeFromEmail?token=${token}`;

  const mailOptions = {
    from: `Motivational Quote <${process.env.ADMIN_EMAIL_BULK_SENDING}>`,
    to,
    subject,
    html,
    headers: {
      'List-Unsubscribe': `<${unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
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

