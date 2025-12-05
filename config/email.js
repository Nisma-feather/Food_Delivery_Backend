const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: false, 
  requireTLS:true,
  logger:true,
  debug:true,
  auth: {
    user: process.env.EMAIL_USER, // example: 9d64dc001@smtp-brevo.com
    pass: process.env.EMAIL_PASS, // your Brevo SMTP key
  },
});

module.exports = transporter;
