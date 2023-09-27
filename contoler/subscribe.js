// /* global __dirname */
/* global process */

const SUBSCRIBE = require("../model/subscribe");
const express_async = require("express-async-handler");
const validator = require(`validator`);
const fs = require("fs");
const mongoose = require("mongoose");
const sendEmail_request = require(`../utils/send.email`);
const jwt = require("jsonwebtoken");
const User = require("../model/subscribe");
const sendEmail = sendEmail_request.sendEmail;

module.exports.subscribe = express_async(async (req, res) => {
  const { names, email } = req.body;
  let existingUser;

  // Vérification si c'est un email valide et non vide
  if (!validator.isEmail(email) || validator.isEmpty(email)) {
    return res
      .status(400)
      .json({ message: "Veuillez saisir une adresse e-mail valide" });
  }
  function generateId(length = 24) {
    const characters = "abcdef0123456789";
    let id = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters[randomIndex];
    }

    return id;
  }

  // Utilisation de la fonction pour générer un ID de longueur par défaut (24 caractères)
  const defaultId = generateId();
  function extractSixFirstCharacters(inputWord) {
    const regex = /^[a-zA-Z0-9]{1,6}/; // Expression régulière pour correspondre aux six premiers caractères alphanumériques
    const match = inputWord.match(regex);

    if (match) {
      return match[0];
    } else {
      return null; // Pas de correspondance trouvée
    }
  }
  const extractedChars = extractSixFirstCharacters(defaultId);
  // Recherche de l'utilisateur dans la base de données
  existingUser = await SUBSCRIBE.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      message:
        "Vous êtes déjà abonné au service à ce mail, si ce n'est le cas veuillez nous écrire pour être supprimer.",
    });
  }

  /**Rnvoyer un token dans url avec les l'identifiant de l'utilisateur qui expire dans aprés 24 heure */
  const confirmToken = jwt.sign(
    { generateId: defaultId },
    process.env.confirmToken,
    {
      expiresIn: 3600 * 24, // Expire après 24h
    }
  );
  existingUser = new SUBSCRIBE({
    email,
    names,
    generateId: defaultId,
    confirmToken: confirmToken,
    confirmExpires: Date.now() + 3600000 * 24,
    minds: true,
  });
  await existingUser.save();
  try {
    const url = `${process.env.CLIENT_URL}/newsletter.html?id1=${extractedChars}&id2=${confirmToken}`;
    console.log(url);
    // Lecture du template HTML avant de l'envoyer par nodemailer
    fs.readFile("./template/confirmation.html", "utf-8", async (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erreur lors de la lecture du modèle" });
      } else {
        try {
          // Envoi de l'email avec le contenu du template
          const html = data
            .replace(/{name}/g, existingUser.names)
            .replace(/{confirm_link}/g, url);
          await sendEmail(
            existingUser.email,
            "Fondation La Grâce Parle - Août 2023",
            html
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
    });
  } catch (error) {
    res.status(500).json({
      message: `Erreur interne du serveur, veuillez réessayer ${error}`,
    });
  }
});

module.exports.confirmSubscribe = express_async(async (req, res) => {
  /**Vérifions si les informations dans notre url est bien celle de l'user ou il n'a pas été cliquer ou s'il a déjà expirer */
  try {
    /**Vérifer les données saisir par l'user */

    /**Verifie si le token est celle que nous avons générer avec un key forget_password_key  */
    const decoded = jwt.verify(req.params.id2, process.env.confirmToken);
    const user = await User.findById(decoded._id);
    if (!user)
      return res.status(403).json({
        message: `Authentification échoué, veuillez récommencez l'opération du changement du mot de passe.
    `,
      });
    /**Vérifez si le lien à expirer */
    if (user.confirmExpires < Date.now()) {
      return res.status(403).json({
        message:
          "Le lien de réinitialisation a expiré ou a déjà été cliquer,veuillez récommencez l'opération du changement du mot de passe",
      });
    }

    await user.updateOne({
      confirmToken: ``,
      generateId: ``,
      confirmExpires: ``,
    });
  } catch (error) {
    return res.status(400).json({
      message: `Votre lien de vérification à probablement expirer ou a déjà été cliquer. Veuillez recommencer le processus de changement du mot de passe. ${error}
`,
    });
  }
  /**Réponse finale  */
  return res.status(200).json({
    message:
      "Votre mot de passe a été changé avec succès. Veuillez-vous connectez à présent avec le nouveau mot de passe.",
  });
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
