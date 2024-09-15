import express from "express";
import fetchSeries from "../controllers/serieController.js";

const router = express.Router();

router.get("/fetch-series", fetchSeries);

export default router;
