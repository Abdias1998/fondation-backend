// /* global __dirname */
/* global process */

const SUBSCRIBE = require("../model/contact");
const express_async = require("express-async-handler");
const validator = require(`validator`);
const fs = require("fs");
const mongoose = require("mongoose");
const sendEmail_request = require(`../utils/send.email`);
const jwt = require("jsonwebtoken");

module.exports.receiveMessage = express_async(async (req, res) => {
  const { names, subject, email, message } = req.body;
  let existingUser;
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
    existingUser = new SUBSCRIBE({
      email,
      subject,
      message,
      names,
    });
    await existingUser.save();
    return res.status(200).json({
      message: `Nous avons reçu votre message ${names}, nous vous reviendrons au plus vite.`,
    });
  } catch (error) {
    res.status(500).json({
      message: `Erreur interne du serveur, veuillez réessayer ${error}`,
    });
  }
});
