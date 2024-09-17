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
      userId: req.user._id, 
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

router.post('/:listId/movies', async (req, res) => {
  const { listId } = req.params;
  const { movie } = req.body; 
  
  if (!movie || !movie.tmdb_id) {
    return res.status(400).json({ message: "Le film est requis" });
  }

  try {
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "Liste non trouvée" });
    }
    const movieExists = list.movies.some((m) => m.tmdb_id === movie.tmdb_id);
    if (movieExists) {
      return res.status(400).json({ message: "Le film est déjà dans la liste" });
    }

    list.movies.push(movie);
    await list.save();

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout du film à la liste", error });
  }
});

// Route pour ajouter une série à une liste
router.post('/:listId/series', async (req, res) => {
  const { listId } = req.params;
  const { serie } = req.body; 
  
  if (!serie || !serie.tmdb_id) {
    return res.status(400).json({ message: "La série est requise" });
  }

  try {
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "Liste non trouvée" });
    }
    const serieExists = list.series.some((s) => s.tmdb_id === serie.tmdb_id);
    if (serieExists) {
      return res.status(400).json({ message: "La série est déjà dans la liste" });
    }

    list.series.push(serie);
    await list.save();

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout de la série à la liste", error });
  }
});

// Route pour supprimer un film d'une liste
router.delete('/:listId/movies/:movieId', ensureAuthenticated, async (req, res) => {
  const { listId, movieId } = req.params;

  try {
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "Liste non trouvée" });
    }

    // Supprimer le film de la liste
    list.movies = list.movies.filter((movie) => movie.tmdb_id !== parseInt(movieId));

    await list.save();

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du film", error });
  }
});

// Route pour supprimer une série d'une liste
router.delete('/:listId/series/:serieId', ensureAuthenticated, async (req, res) => {
  const { listId, serieId } = req.params;

  try {
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "Liste non trouvée" });
    }

    // Supprimer la série de la liste
    list.series = list.series.filter((serie) => serie.tmdb_id !== parseInt(serieId));

    await list.save();

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la série", error });
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