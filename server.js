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

//Créer une application Express
const app = express();

app.use(express.json());

//------------ Passport Configuration ------------//
import configurePassport from './config/passport.js';
configurePassport(passport);

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

app.get("/", (req, res) => {
    res.render("index", {});
  });

//------------ Express session Configuration ------------//
app.use(
  session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
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

//------------ Routes ------------//
app.use('/', index);
app.use('/auth', auth);
app.use('/', movieRouter);

const PORT = process.env.PORT || 4000;
//Ecoute du serveur sur le port 4000
app.listen(PORT, console.log(`Server running on PORT ${PORT}`));