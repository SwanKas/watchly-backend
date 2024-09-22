import express from "express";
import fetchSeries from "../controllers/serieController.js";
import { getSeriesFromDB } from "../controllers/serieController.js";
import { getSerieByTmdbId } from "../controllers/serieController.js";

const router = express.Router();

router.get("api/fetch-series", fetchSeries);

router.get("api/series", getSeriesFromDB);

router.get('api/series/:id', getSerieByTmdbId);

export default router;
