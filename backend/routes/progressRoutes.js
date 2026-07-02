import express from "express";
import { streamProgress } from "../controllers/progressController.js";

const router = express.Router();

router.get("/progress/:documentId", streamProgress);

export default router;