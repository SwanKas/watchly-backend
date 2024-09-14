import express from 'express';
import Comment from '../models/Comment.js';
import { ensureAuthenticated } from '../middleware/auth.js'; 

const router = express.Router();

const debugAuth = (req, res, next) => {
  console.log('User:', req.user);
  console.log('Is Authenticated:', req.isAuthenticated());
  next();
};

router.post('/movies/:movieId/comments', debugAuth, ensureAuthenticated, async (req, res) => {
  const { movieId } = req.params;
  const { text, rating } = req.body;

  if (!text || !rating) {
    return res.status(400).json({ error: 'Le texte et la note sont requis' });
  }

  try {
    const newComment = new Comment({
      movieId,
      user: req.user._id,
      text,
      rating,
      createdAt: new Date()
    });

    await newComment.save();
    res.status(201).json({ message: 'Commentaire ajouté avec succès', comment: newComment });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire :', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du commentaire', details: error.message });
  }
});

// Route pour récupérer les commentaires d'un film
router.get('/movies/:movieId/comments', async (req, res) => {
  const { movieId } = req.params;

  try {
    const comments = await Comment.find({ movieId })
      .populate('user', 'name')  
      .sort({ createdAt: -1 }); 
    res.status(200).json(comments);
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des commentaires' });
  }
});

export default router;