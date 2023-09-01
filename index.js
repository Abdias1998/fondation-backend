/* global process */
/* global __dirname */
const express = require("express");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const subscribeRoute = require("./routes/subscribes.routes");
const contactRoute = require("./routes/contact.routes");
const prayerRoute = require("./routes/prayer.routes");
const useragent = require("express-useragent");
const path = require("path");
const app = express();
const port = process.env.PORT;
const origineClient = process.env.CLIENT_URL;
// app.use(cors({ credentials: true, origin: origineClient })); //L'origine des requêtes
app.use(
  cors({
    origin: "https://capable-creponne-29ce5a.netlify.app",
    credentials: true,
  })
);

app.use(useragent.express());
app.use(cookieParser()); //Lire les cookies
app.use(cookieParser());
app.use(helmet());

app.use(bodyParser.json()); //Transformer nos corps en json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build", "index.html"));
});
app.use("/api/v1", subscribeRoute);
app.use("/api/v2", contactRoute);
app.use("/api/v3", prayerRoute);
const faq = [
  "Foi et Croyances",
  "Activités de la Fondation",
  "Dons et Soutien",
  "Engagement Chrétien",
  "Événements et Rassemblements",
  "Engagement Social et Humanitaire",
  "Questions Théologiques",
  "Contact et Support",
  "Partenariats et Collaborations",
  "Ressources et Enseignements",
];
const mot = "Foi et Croyances    ";

// Vérifier si le mot est égal à l'un des éléments du tableau faq
if (faq.includes(mot.trim())) {
  console.log(`Le mot "${mot}" existe dans le tableau faq.`);
} else {
  console.log(`Le mot "${mot}" n'existe pas dans le tableau faq.`);
}

app.listen(port, () =>
  console.log(`Le serveur est démarrer sur le port ${port}`)
);
