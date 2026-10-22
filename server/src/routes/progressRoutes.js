const express = require("express");
const { getProgressSummary, updateTopicProgress } = require("../controllers/progressController");

const router = express.Router();

router.get("/", getProgressSummary);
router.patch("/:topicId", updateTopicProgress);

module.exports = router;

