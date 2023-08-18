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

app.listen(port, () =>
  console.log(`Le serveur est démarrer sur le port ${port}`)
);
