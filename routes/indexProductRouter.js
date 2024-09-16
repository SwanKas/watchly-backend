import express from "express";
import indexAll from "../controllers/elasticSearchController.js";

const router = express.Router();

router.get("/index-product", indexAll);

export default router;
