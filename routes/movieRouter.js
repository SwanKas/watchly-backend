import express from "express";
import fetchMovies from "../controllers/movieController.js";
import { getMoviesFromDB, getMovieByTmdbId } from "../controllers/movieController.js";

const router = express.Router();

router.get("/fetch-movies", fetchMovies);
router.get("/movies", getMoviesFromDB);
router.get('/movies/:id', getMovieByTmdbId);

export default router;