const express = require("express");
const { generatePath, getLearningPath } = require("../controllers/pathController");

const router = express.Router();

router.get("/", getLearningPath);
router.post("/generate", generatePath);

module.exports = router;

