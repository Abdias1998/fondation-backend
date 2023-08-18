const mongoose = require("mongoose");
const twilio = require("twilio");

// Remplacez ces valeurs par vos propres informations d'identification Twilio
const accountSid = "VOTRE_ACCOUNT_SID";
const authToken = "VOTRE_AUTH_TOKEN";
const client = twilio(accountSid, authToken);

// Connexion à votre base de données MongoDB avec Mongoose
mongoose.connect("URL_DE_CONNEXION_MONGODB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Création du schéma Mongoose pour les destinataires
const destinataireSchema = new mongoose.Schema({
  nom: String,
  numero: String,
});

// Création du modèle Mongoose
const Destinataire = mongoose.model("Destinataire", destinataireSchema);

// Fonction pour envoyer un SMS
async function envoyerSMS(destinataire) {
  try {
    const message = await client.messages.create({
      body: "Ceci est un exemple d'envoi de SMS avec Twilio et Mongoose!",
      from: "NUMERO_DE_TELEPHONE_TWILIO", // Remplacez par votre numéro Twilio
      to: destinataire.numero,
    });

    console.log(
      "SMS envoyé avec succès à",
      destinataire.nom,
      ". SID du message:",
      message.sid
    );
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi du SMS à",
      destinataire.nom,
      ":",
      error
    );
  }
}

// Récupération des destinataires dans la base de données et envoi des SMS
Destinataire.find({}, (err, destinataires) => {
  if (err) {
    console.error("Erreur lors de la recherche des destinataires:", err);
  } else {
    destinataires.forEach((destinataire) => {
      envoyerSMS(destinataire);
    });
  }
});
