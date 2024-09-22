import express from "express";
import {fetchAndSaveGenres, getGenres} from "../controllers/genresController.js";

const router = express.Router();

router.get("/api/fetch-genres", fetchAndSaveGenres);
router.get("/api/genres", getGenres);

export default router;
