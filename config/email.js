const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER, // example: 9d64dc001@smtp-brevo.com
    pass: process.env.SMTP_PASS, // your Brevo SMTP key
  },
});

module.exports = transporter;
