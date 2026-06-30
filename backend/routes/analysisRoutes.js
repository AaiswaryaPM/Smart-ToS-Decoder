import express from "express";

import {
  analyzeTerms,
  getHistory,
  deleteHistoryItem,
  clearHistory,
} from "../controllers/analysisController.js";

const router = express.Router();

router.post("/analyze", analyzeTerms);

router.get("/history", getHistory);

router.delete("/history/:id", deleteHistoryItem);

router.delete("/history", clearHistory);

export default router;