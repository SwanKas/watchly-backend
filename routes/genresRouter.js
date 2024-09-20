import express from "express";
import {fetchAndSaveGenres, getGenres} from "../controllers/genresController.js";

const router = express.Router();

router.get("/fetch-genres", fetchAndSaveGenres);
router.get("/genres", getGenres);

export default router;
