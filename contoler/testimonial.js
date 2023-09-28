// /* global __dirname */
/* global process*/

// const SUBSCRIBE = require("../model/contact");
const express_async = require("express-async-handler");
const validator = require(`validator`);
const sendEmail_request = require(`../utils/send.email`);
const fs = require("fs");

const sendEmail = sendEmail_request.sendEmail;
module.exports.receiveMessageTestimonial = express_async(async (req, res) => {
  const { names, pays, message } = req.body;

  if (!validator.isLength(message, { min: 2, max: 5000 }))
    return res.status(401).json({
      message: `La longueur de votre message ne respecte pas nos standards de validation.`,
    });

  try {
    fs.readFile("./template/testimonial.html", "utf-8", async (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erreur lors de la lecture du modèle" });
      } else {
        try {
          // Envoi de l'email avec le contenu du template
          const html = data
            .replace(/{names}/g, names)
            .replace(/{pays}/g, pays)
            // .replace(/{sexe}/g, sexe)
            // .replace(/{tel}/g, tel)
            .replace(/{message}/g, message);

          await sendEmail(`${process.env.USER}`, "Témoignages", html);
          return res.status(200).json({
            message: ` Nous vous remercions sincèrement d'avoir partagé votre témoignage avec nous. Nous tenons à vous informer que nous avons bien reçu votre demande et que nous allons la prendre en compte dans nos publications de témoignagessssss.`,
          });
        } catch (error) {
          return res.status(500).json({
            message: "L'envoi de l'email a échoué, veuillez réessayer",
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      message: `Erreur interne du serveur, veuillez réessayer ${error}`,
    });
  }
});
