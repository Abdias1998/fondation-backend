// /* global __dirname */
/* global process*/

// const SUBSCRIBE = require("../model/contact");
const express_async = require("express-async-handler");
const validator = require(`validator`);
const sendEmail_request = require(`../utils/send.email`);
const fs = require("fs");

const sendEmail = sendEmail_request.sendEmail;
module.exports.receiveMessage = express_async(async (req, res) => {
  const faq = [
    "Foi et Croyances",
    "Activités de la Fondation",
    "Dons et Soutien",
    "Engagement Chrétien",
    "Événements et Rassemblements",
    "Engagement Social et Humanitaire",
    "Questions Théologiques",
    "Contact et Support",
    "Ressources et Enseignements",
  ];

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
  // Recherche de l'utilisateur dans la base de données
  // existingUser = await SUBSCRIBE.findOne({ email });

  // if (existingUser) {
  //   return res.status(400).json({
  //     message:
  //       "Nous avons déjà répondu à l'une de vos préoccupations. Veuillez nous contacter directement par e-mail ou WhatsApp pour toute communication ultérieure",
  //   });
  // }

  // if (faq.includes(subject.trim())) {
  //   return res.status(400).json({
  //     message:
  //       "Nous disposons d'une liste de questions sur ce sujet. Nous vous encourageons à consulter la section FAQ dans la rubrique contactez-nous pour obtenir de plus amples informations.",
  //   });
  // }

  try {
    // existingUser = new SUBSCRIBE({
    //   email,
    //   subject,
    //   message,
    //   names,
    // });
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
            .replace(/{tel}/g, tel)
            .replace(/{message}/g, message);

          await sendEmail(
            `${process.env.USER}`,
            "Fondation La Grâce Parle - Août 2023",
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
