const express = require("express");
const {
  generateRecommendationSet,
  getInsights,
  getLatestRecommendations
} = require("../controllers/recommendationController");

const router = express.Router();

router.get("/latest", getLatestRecommendations);
router.get("/insights", getInsights);
router.post("/generate", generateRecommendationSet);

module.exports = router;

