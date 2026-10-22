const express = require("express");
const { createGoal, listGoals } = require("../controllers/goalController");

const router = express.Router();

router.get("/", listGoals);
router.post("/", createGoal);

module.exports = router;

