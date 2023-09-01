// /* global __dirname */
/* global process*/

// const SUBSCRIBE = require("../model/contact");
const express_async = require("express-async-handler");
const validator = require(`validator`);
const sendEmail_request = require(`../utils/send.email`);
const fs = require("fs");

const sendEmail = sendEmail_request.sendEmail;
module.exports.receiveMessagePrayer = express_async(async (req, res) => {
  const { sexe, names, pays, subject, email, message, tel } = req.body;
  // let existingUser;
  // Vérification si c'est un email valide et non vide
  if (!validator.isEmail(email) || validator.isEmpty(email)) {
    return res
      .status(400)
      .json({ message: "Veuillez saisir une adresse e-mail valide" });
  }
  if (!validator.isLength(message, { min: 2, max: 5000 }))
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
    fs.readFile("./template/prayer.html", "utf-8", async (err, data) => {
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
            .replace(/{sexe}/g, sexe)
            .replace(/{subject}/g, subject)
            .replace(/{email}/g, email)
            .replace(/{tel}/g, tel)
            .replace(/{message}/g, message);

          await sendEmail(
            `${process.env.USER}`,
            "Confirmation de Demande de Prière",
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
      message: `,

      Nous vous remercions sincèrement d'avoir partagé votre demande de prière avec nous. Nous tenons à vous informer que nous avons bien reçu votre demande et que nous allons la prendre en compte dans nos prières.
      
      La foi est une force puissante, et nous croyons que Dieu entend nos prières et répond à nos besoins selon Sa volonté. Nous vous encourageons à garder la foi et à croire que Dieu est à l'œuvre dans votre vie. Même lorsque les réponses ne sont pas immédiates, continuez à prier et à avoir confiance en Sa bonté et en Sa sagesse.
      
      Nous sommes là pour vous soutenir dans cette période de prière et d'attente. Si vous avez d'autres besoins spirituels ou des questions, n'hésitez pas à nous contacter à tout moment.
      
      Que la paix de Dieu qui dépasse toute compréhension vous remplisse et que Sa grâce abonde dans votre vie.
      
      
      `,
    });
  } catch (error) {
    res.status(500).json({
      message: `Erreur interne du serveur, veuillez réessayer ${error}`,
    });
  }
});
