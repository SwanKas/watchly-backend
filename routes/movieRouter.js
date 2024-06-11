import express from 'express';
import fetchMoviesAndSeries  from '../controllers/movieController.js';

const router = express.Router();

router.get('/fetch-moviesAndSeries', fetchMoviesAndSeries);

export default router;

