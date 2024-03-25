import Express from "express";
//Créer une application Express
const app = Express();

//Configuration de mon application pour qu'elle puisse servir du contenu statique
app.use(Express.static('public'));

// Configure mon application pour qu'elle utlise ejs comme moteur de templating
// l'outil qui va generer de l'html
app.set("view engine", "ejs");
app.set("views", "views");


app.get("/", (req, res) => {
    res.render("index", {});
  });

//Ecoute du serveur sur le port 4000
app.listen(4000, () => {
    console.log("Le serveur s'éxécute sur le port 4000.");
  });
  