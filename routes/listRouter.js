import express from 'express';
import List from '../models/List.js';
import { ensureAuthenticated } from '../middleware/auth.js'; 

const router = express.Router();

// Route pour créer une nouvelle liste
router.post("/", ensureAuthenticated, async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Le nom de la liste est requis." });
  }

  try {
    const newList = new List({
      name: name.trim(),
      userId: req.user._id, // Utilisation de l'ID de l'utilisateur authentifié
    });
    await newList.save();
    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la liste.", error });
  }
});

router.get("/", ensureAuthenticated, async (req, res) => {
    try {
      const lists = await List.find({ userId: req.user._id });
      res.status(200).json(lists);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des listes.", error });
    }
  });


// Route pour ajouter un film à une liste
router.post('/:listId/movies', async (req, res) => {
  const { listId } = req.params;
  const { movie } = req.body; // L'objet film à ajouter
  
  if (!movie) {
    return res.status(400).json({ message: "Le film est requis" });
  }

  try {
    // Trouver la liste correspondante
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "Liste non trouvée" });
    }

    // Vérifier si le film est déjà dans la liste
    const movieExists = list.movies.some((m) => m.id === movie.id);
    if (movieExists) {
      return res.status(400).json({ message: "Le film est déjà dans la liste" });
    }

    // Ajouter le film à la liste
    list.movies.push(movie);
    await list.save();

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout du film à la liste", error });
  }
});

// Route pour supprimer un film d'une liste
router.delete('/:listId/movies/:movieId', ensureAuthenticated, async (req, res) => {
    const { listId, movieId } = req.params;
  
    try {
      // Trouver la liste correspondante
      const list = await List.findById(listId);
      if (!list) {
        return res.status(404).json({ message: "Liste non trouvée" });
      }
  
      // Supprimer le film de la liste
      list.movies = list.movies.filter((movie) => movie.id !== parseInt(movieId));
  
      await list.save();
  
      res.status(200).json(list);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression du film", error });
    }
  });
  
  // Route pour supprimer une liste
router.delete('/:listId', ensureAuthenticated, async (req, res) => {
    const { listId } = req.params;
  
    try {
      const list = await List.findById(listId);
      if (!list) {
        return res.status(404).json({ message: "Liste non trouvée" });
      }
  
      await List.findByIdAndDelete(listId);
      res.status(200).json({ message: "Liste supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression de la liste", error });
    }
  });

export default router;


