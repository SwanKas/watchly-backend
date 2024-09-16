import express from "express";
import fetchSeries from "../controllers/serieController.js";
import { getSeriesFromDB } from "../controllers/serieController.js";
import { getSerieByTmdbId } from "../controllers/serieController.js";

const router = express.Router();

router.get("/fetch-series", fetchSeries);

router.get("/series", getSeriesFromDB);

router.get('/series/:id', getSerieByTmdbId);

export default router;
