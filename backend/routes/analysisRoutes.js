const express = require("express");
const router = express.Router();

const {
  analyzeTerms,
  getHistory,
  deleteHistoryItem,
  clearHistory,
} = require("../controllers/analysisController");

router.post("/analyze", analyzeTerms);

router.get("/history", getHistory);

router.delete("/history/:id", deleteHistoryItem);

router.delete("/history", clearHistory);

module.exports = router;