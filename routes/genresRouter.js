import express from "express";
import fetchAndSaveGenres from "../controllers/genresController.js";

const router = express.Router();

router.get("/fetch-genres", fetchAndSaveGenres);

export default router;
