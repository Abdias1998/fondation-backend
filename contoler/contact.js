// /* global __dirname */
/* global process*/

// const SUBSCRIBE = require("../model/contact");
const express_async = require("express-async-handler");
const validator = require(`validator`);
const sendEmail_request = require(`../utils/send.email`);
const fs = require("fs");

const sendEmail = sendEmail_request.sendEmail;
const sendEmailAdoris = sendEmail_request.sendEmailAdoris;
module.exports.receiveMessage = express_async(async (req, res) => {
  const { names, subject, email, message, tel, pays } = req.body;
  // let existingUser;
  // Vérification si c'est un email valide et non vide
  if (!validator.isEmail(email) || validator.isEmpty(email)) {
    return res
      .status(400)
      .json({ message: "Veuillez saisir une adresse e-mail valide" });
  }
  if (!validator.isLength(message, { min: 5, max: 300 }))
    return res.status(401).json({
      message: `La longueur de votre message ne respecte pas nos standards de validation.`,
    });

  try {
    fs.readFile("./template/contact.html", "utf-8", async (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erreur lors de la lecture du modèle" });
      } else {
        try {
          // Envoi de l'email avec le contenu du template
          const html = data
            .replace(/{name}/g, names)
            .replace(/{subject}/g, subject)
            .replace(/{email}/g, email)
            .replace(/{pays}/g, pays)
            .replace(/{tel}/g, tel)
            .replace(/{message}/g, message);

          await sendEmail(
            `${process.env.USER}`,
            "Message de Contact - Fondation La Grâce Parle",
            html
          );
          res.status(200).json({
            message: `Nous avons reçu votre message, nous vous reviendrons au plus vite!`,
          });
        } catch (error) {
          return res.status(500).json({
            message: "L'envoi de l'email a échoué, veuillez réessayer",
          });
        }
      }
    });
    // await existingUser.save();
    return res.status(200).json({
      message: `Nous avons reçu votre message ${names}, nous vous reviendrons au plus vite!`,
    });
  } catch (error) {
    res.status(500).json({
      message: `Erreur interne du serveur, veuillez réessayer ${error}`,
    });
  }
});
module.exports.receiveMessageAdoris = express_async(async (req, res) => {
  const { names, subject, email, message, tel } = req.body;
  // let existingUser;
  // Vérification si c'est un email valide et non vide
  if (!validator.isEmail(email) || validator.isEmpty(email)) {
    return res
      .status(400)
      .json({ message: "Veuillez saisir une adresse e-mail valide" });
  }
  if (!validator.isLength(message, { min: 5, max: 300 }))
    return res.status(401).json({
      message: `La longueur de votre message ne respecte pas nos standards de validation.`,
    });

  try {
    fs.readFile("./template/adoris.html", "utf-8", async (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erreur lors de la lecture du modèle" });
      } else {
        try {
          // Envoi de l'email avec le contenu du template
          const html = data
            .replace(/{name}/g, names)
            .replace(/{email}/g, email)
            .replace(/{tel}/g, tel)
            .replace(/{message}/g, message);

          await sendEmailAdoris(
            `${process.env.USERAdoris}`,
            "Message de Contact - guide.bj",
            html
          );
          res.status(200).json({
            message: `Nous avons reçu votre message, nous vous reviendrons au plus vite!`,
          });
        } catch (error) {
          return res.status(500).json({
            message: "L'envoi de l'email a échoué, veuillez réessayer",
          });
        }
      }
    });
    // await existingUser.save();
    return res.status(200).json({
      message: `Nous avons reçu votre message ${names}, nous vous reviendrons au plus vite!`,
    });
  } catch (error) {
    res.status(500).json({
      message: `Erreur interne du serveur, veuillez réessayer ${error}`,
    });
  }
});
