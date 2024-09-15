import express from "express";
import fetchMoviesAndSeries from "../controllers/movieController.js";
import { getMoviesFromDB } from "../controllers/movieController.js";
import { getMovieByTmdbId } from '../controllers/movieController.js';

const router = express.Router();

router.get("/fetch-movies", fetchMoviesAndSeries);

router.get("/movies", getMoviesFromDB);

router.get('/movies/:id', getMovieByTmdbId);

export default router;
