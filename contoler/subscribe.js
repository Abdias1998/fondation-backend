// /* global __dirname */
// /* global process */

const SUBSCRIBE = require("../model/subscribe");
const express_async = require("express-async-handler");
const validator = require(`validator`);
const fs = require("fs");
const mongoose = require("mongoose");
const sendEmail_request = require(`../utils/send.email`);

const sendEmail = sendEmail_request.sendEmail;

module.exports.subscribe = express_async(async (req, res) => {
  const { email } = req.body;
  let existingUser;

  // Vérification si c'est un email valide et non vide
  if (!validator.isEmail(email) || validator.isEmpty(email)) {
    return res
      .status(400)
      .json({ message: "Veuillez saisir une adresse e-mail valide" });
  }

  try {
    // Recherche de l'utilisateur dans la base de données
    existingUser = await SUBSCRIBE.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Vous êtes déjà abonné au service" });
    }

    // Création d'un nouvel utilisateur avec l'email
    existingUser = new SUBSCRIBE({ email });
    await existingUser.save();

    // Lecture du template HTML avant de l'envoyer par nodemailer
    fs.readFile(
      "./template/subscribe.template.html",
      "utf-8",
      async (err, data) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Erreur lors de la lecture du modèle" });
        } else {
          try {
            // Envoi de l'email avec le contenu du template
            await sendEmail(
              existingUser.email,
              "Fondation La Grâce Parle - Août 2023",
              data
            );
            res.status(200).json({
              message: `Merci pour votre abonnement à notre newsletter ! Vous recevrez nos dernières actualités et mises à jour.`,
            });
          } catch (error) {
            return res.status(500).json({
              message: "L'envoi de l'email a échoué, veuillez réessayer",
            });
          }
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      message: `Erreur interne du serveur, veuillez réessayer ${error}`,
    });
  }
});

module.exports.getAllUsers = express_async(async (req, res) => {
  try {
    /**Recuperer avec la méthode find de mongoose sans les mots de passe */
    const users = await SUBSCRIBE.find({}, "-password");
    res.send(users);
  } catch (error) {
    return res.status(500).json({
      message: `Impossible de récupérer les données des utilisateurs`,
    });
  }
});

module.exports.deleteUser = express_async(async (req, res) => {
  /**Vérifiez si l'id est conforme à celui d'un _id mongoose */
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res
      .status(400)
      .json({ message: `Utilisateur inconnu ${req.params.id}` });
  }

  try {
    /**Rechercher l'utilisateur avec l'id passé en paramètres */
    const user = await SUBSCRIBE.findById(req.params.id);

    if (!user)
      return res.status(403).json({ message: `L'identifiant n'existe pas` });

    /**Si l'utilisateur existe, le supprimer de la base de données */
    await SUBSCRIBE.findByIdAndRemove(req.params.id);

    /**Réponse finale */
    return res
      .status(200)
      .json({ message: `L'utilisateur supprimé avec succès` });
  } catch (error) {
    return res.status(500).json({
      message: `Erreur interne du serveur, veuillez réessayer plus tard lors de la suppression de l'utilisateur ${req.params.id}`,
    });
  }
});
