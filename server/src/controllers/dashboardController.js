const {
  computeDashboardStats,
  getGoalForUser,
  getLatestRecommendation,
  getTopicsForGoal,
  getUserProfile
} = require("../services/learningService");

async function getDashboard(req, res, next) {
  try {
    const user = await getUserProfile(req.user.id);
    const goal = await getGoalForUser(req.user.id, req.query.goalId || null);

    if (!goal) {
      return res.json({
        user,
        goal: null,
        roadmap: [],
        stats: computeDashboardStats([], user.streak_count),
        recommendation: null
      });
    }

    const topics = await getTopicsForGoal(req.user.id, goal.id);
    const recommendation = await getLatestRecommendation(req.user.id, goal.id);
    const stats = computeDashboardStats(topics, user.streak_count);

    return res.json({
      user,
      goal,
      roadmap: topics,
      stats,
      recommendation
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getDashboard
};

