// routes/indexProductRouter.js
import express from 'express';
import { searchMovies } from '../controllers/elasticSearchController.js';

const router = express.Router();

router.post('/search', (req, res, next) => {
  console.log('Received POST request on /search');
  next(); // Passe à la fonction de traitement suivante
}, searchMovies);

export default router;
