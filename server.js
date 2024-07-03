import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import expressLayouts from "express-ejs-layouts";
import flash from "connect-flash";
import session from "express-session";
import passport from "passport";
import auth from "./routes/authRouter.js";
import index from "./routes/indexRouter.js";
import movieRouter from "./routes/movieRouter.js";
import "./config/passportGoogle.js";
import cors from "cors"

//Créer une application Express
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

//------------ Passport Configuration ------------//
// import configurePassport from './config/passport.js';
// configurePassport(passport);

//Configuration de mon application pour qu'elle puisse servir du contenu statique
app.use(express.static('public'));

//Configuration de dotenv pour qu'il puisse lire les variables d'environnement de mon fichier .env
dotenv.config();

//Connexion à la base de données MongoDB avec Mongoose
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connexion à la base de données réussie.'))
  .catch(err => console.error('Erreur de connexion ', err));

// Configure mon application pour qu'elle utlise ejs comme moteur de templating
// l'outil qui va generer de l'html
app.use(expressLayouts);
app.use("/assets", express.static('./assets'));
app.set("view engine", "ejs");
app.set("views", "views");

//------------ Bodyparser Configuration ------------//
app.use(express.urlencoded({ extended: false }))

//------------ Express session Configuration ------------//
app.use(
  session({
    secret: process.env.SESSION_SECRET, // session secret
    resave: false,
    saveUninitialized: false,
  })
);

//------------ Passport Middlewares ------------//
app.use(passport.initialize());
app.use(passport.session());

//------------ Connecting flash ------------//
app.use(flash());

//------------ Global variables ------------//
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
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
  passport.authenticate("google", {
    access_type: "offline",
    scope: ["email", "profile"],
  }),
  (req, res) => {
    if (!req.user) {
      res.status(400).json({ error: "Authentication failed" });
    } else {
      res.redirect('http://localhost:4001/');
      //res.status(200).json({ user: req.user });
    }
  }
);

//------------ Routes ------------//
app.get("/", (req, res) => {
    res.render("index", {});
});

app.use('/', index);
app.use('/auth', auth);
app.use('/', movieRouter);

//Ecoute du serveur sur le port 4000
const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};
start();