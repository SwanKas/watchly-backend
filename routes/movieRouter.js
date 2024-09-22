import express from "express";
import fetchMoviesAndSeries from "../controllers/movieController.js";
import { getMoviesFromDB } from "../controllers/movieController.js";
import { getMovieByTmdbId } from '../controllers/movieController.js';

const router = express.Router();

router.get("/api/fetch-movies", fetchMoviesAndSeries);

router.get("/api/movies", getMoviesFromDB);

router.get('/api/movies/:id', getMovieByTmdbId);

export default router;
