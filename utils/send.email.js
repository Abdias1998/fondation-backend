/* global process */
// /* global __dirname */
const nodemailer = require("nodemailer");
const path = require("path");
const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  service: process.env.SERVICE,
  port: Number(process.env.EMAIL_PORT),
  secure: Boolean(process.env.SECURE),
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});
const transporterAdoris = nodemailer.createTransport({
  host: process.env.HOST,
  service: process.env.SERVICE,
  port: Number(process.env.EMAIL_PORT),
  secure: Boolean(process.env.SECURE),
  auth: {
    user: process.env.USERAdoris,
    pass: process.env.PASSAdoris,
  },
});
/**Function principale d'envoi d'email */
module.exports.sendEmail = async (email, subject, text) => {
  try {
    await transporter.sendMail({
      from: `La Grâce Parle <${process.env.USER}>`,
      to: email,
      subject: subject,
      html: text,
    });

    console.log("Email envoyé");
  } catch (error) {
    console.log("Email not sent" + error);
  }
};
module.exports.sendEmailAdoris = async (email, subject, text) => {
  try {
    await transporterAdoris.sendMail({
      from: `Guide.bj<${process.env.USERAdoris}>`,
      to: email,
      subject: subject,
      html: text,
    });

    console.log("Email envoyé");
  } catch (error) {
    console.log("Email not sent" + error);
  }
};
