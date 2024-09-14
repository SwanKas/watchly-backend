import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import expressLayouts from "express-ejs-layouts";
import flash from "connect-flash";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import index from "./routes/indexRouter.js";
import movieRouter from "./routes/movieRouter.js";
import commentRouter from "./routes/commentRouter.js";
import configurePassport from "./config/passport.js";
import { testConnection, searchMovies } from "./config/elasticsearch.js";
import "./config/passportGoogle.js"; // Assurez-vous que ce fichier est importé

// Connexion à ElasticSearch
testConnection(); // Teste la connexion à ElasticSearch au démarrage

// Créer une application Express
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
let websiteUrl;
if (process.env.ENVIRONMENT === "PROD") {
  websiteUrl = process.env.WEBSITE_URL_PROD;
} else if (process.env.ENVIRONMENT === "DEV") {
  websiteUrl = process.env.WEBSITE_URL_DEV;
} else {
  websiteUrl = process.env.WEBSITE_URL_DEFAULT;
}

const corsOptions = {
  origin: 'http://localhost:4001',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

//------------ Bodyparser Configuration ------------//
app.use(express.urlencoded({ extended: false }));

//------------ Express session Configuration ------------//
app.use(
  session({
    secret: process.env.SESSION_SECRET, // session secret
    resave: false,
    saveUninitialized: false,
  })
);

//------------ Passport Configuration ------------//
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

//------------ Connecting flash ------------//
app.use(flash());

//------------ Global variables ------------//
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Configuration de mon application pour qu'elle puisse servir du contenu statique
app.use(express.static("public"));

// Connexion à la base de données MongoDB avec Mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connexion à la base de données réussie."))
  .catch((err) => console.error("Erreur de connexion ", err));

// Configure mon application pour qu'elle utilise ejs comme moteur de templating
app.use(expressLayouts);
app.use("/assets", express.static("./assets"));
app.set("view engine", "ejs");
app.set("views", "views");
app.use('/api', commentRouter); 

// Exemple de route pour la recherche de films avec ElasticSearch
app.get("/search-movies", async (req, res) => {
  const query = req.query.q;
  try {
    const results = await searchMovies(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la recherche" });
  }
});

// authentication route
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Call back route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Authentification réussie, rediriger vers la page d'accueil.
    res.redirect(websiteUrl + ":4001/");
  }
);

// Route de déconnexion
app.get("/logout", async (req, res) => {
  if (req.user && req.user.googleToken) {
    const url = `https://accounts.google.com/o/oauth2/revoke?token=${req.user.googleToken}`;
    await fetch(url, { method: "POST" });
  }

  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect(websiteUrl + ":4001/");
    });
  });
});

//------------ Routes ------------//
app.get("/", (req, res) => {
  res.render("index", {});
});

app.use("/", index);
app.use("/", movieRouter);
app.use("/auth", authRouter);

// Ecoute du serveur sur le port 4000
const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};
start();