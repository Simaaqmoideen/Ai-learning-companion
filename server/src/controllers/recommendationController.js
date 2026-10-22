const db = require("../config/db");
const { generateRecommendations } = require("../services/aiService");
const {
  getGoalForUser,
  getLatestRecommendation,
  getTopicsForGoal,
  getUserProfile
} = require("../services/learningService");

async function generateRecommendationSet(req, res, next) {
  try {
    const user = await getUserProfile(req.user.id);
    const goal = await getGoalForUser(req.user.id, req.body.goalId || null);

    if (!goal) {
      return res.status(404).json({ message: "No learning goal found for this user." });
    }

    const topics = await getTopicsForGoal(req.user.id, goal.id);
    if (topics.length === 0) {
      return res.status(400).json({ message: "Generate a learning path before requesting recommendations." });
    }

    const recommendation = await generateRecommendations(user, goal, topics);

    const { rows } = await db.query(
      `INSERT INTO recommendations (user_id, goal_id, recommendation_type, summary, payload)
       VALUES ($1, $2, 'next-step', $3, $4::jsonb)
       RETURNING *`,
      [req.user.id, goal.id, recommendation.summary, JSON.stringify(recommendation)]
    );

    return res.status(201).json({
      goal,
      recommendation: rows[0]
    });
  } catch (error) {
    return next(error);
  }
}

async function getLatestRecommendations(req, res, next) {
  try {
    const goal = await getGoalForUser(req.user.id, req.query.goalId || null);
    if (!goal) {
      return res.status(404).json({ message: "No learning goal found for this user." });
    }

    const recommendation = await getLatestRecommendation(req.user.id, goal.id);
    return res.json({
      goal,
      recommendation
    });
  } catch (error) {
    return next(error);
  }
}

async function getInsights(req, res, next) {
  try {
    const goal = await getGoalForUser(req.user.id, req.query.goalId || null);
    if (!goal) {
      return res.status(404).json({ message: "No learning goal found for this user." });
    }

    const recommendation = await getLatestRecommendation(req.user.id, goal.id);
    if (!recommendation) {
      return res.json({
        goal,
        insights: {
          message: "No AI insights yet. Generate recommendations after updating your progress."
        }
      });
    }

    return res.json({
      goal,
      insights: recommendation.payload
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  generateRecommendationSet,
  getInsights,
  getLatestRecommendations
};

