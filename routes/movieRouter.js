import express from "express";
import fetchMoviesAndSeries from "../controllers/movieController.js";

const router = express.Router();

router.get("/fetch-movies", fetchMoviesAndSeries);

export default router;
