const db = require("../config/db");

async function getUserProfile(userId) {
  const { rows } = await db.query(
    `SELECT id, full_name, email, role_title, proficiency_level, interests, weekly_target_hours, streak_count, last_active_on, created_at, updated_at
     FROM users
     WHERE id = $1`,
    [userId]
  );

  return rows[0] || null;
}

async function getGoalForUser(userId, goalId) {
  if (goalId) {
    const explicitGoal = await db.query(
      `SELECT *
       FROM learning_goals
       WHERE id = $1 AND user_id = $2`,
      [goalId, userId]
    );
    return explicitGoal.rows[0] || null;
  }

  const activeGoal = await db.query(
    `SELECT *
     FROM learning_goals
     WHERE user_id = $1
     ORDER BY
       CASE WHEN status = 'active' THEN 0 ELSE 1 END,
       priority ASC,
       created_at DESC
     LIMIT 1`,
    [userId]
  );

  return activeGoal.rows[0] || null;
}

async function getTopicsForGoal(userId, goalId) {
  const { rows } = await db.query(
    `SELECT
        t.id,
        t.title,
        t.description,
        t.phase,
        t.order_index,
        t.estimated_hours,
        t.difficulty,
        t.status AS topic_status,
        t.resource_links,
        t.practice_project,
        t.ai_notes,
        COALESCE(up.status, 'pending') AS progress_status,
        COALESCE(up.completion_percent, 0) AS completion_percent,
        COALESCE(up.notes, '') AS notes,
        COALESCE(up.confidence_score, 50) AS confidence_score,
        up.completed_at
     FROM topics t
     LEFT JOIN user_progress up
       ON up.topic_id = t.id
      AND up.user_id = $1
     WHERE t.user_id = $1 AND t.goal_id = $2
     ORDER BY t.order_index ASC`,
    [userId, goalId]
  );

  return rows;
}

function computeDashboardStats(topics, streakCount) {
  const totalTopics = topics.length;
  const completedTopics = topics.filter((topic) => topic.progress_status === "completed").length;
  const inProgressTopics = topics.filter((topic) => topic.progress_status === "in_progress").length;
  const completionPercent = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);
  const averageConfidence = totalTopics === 0
    ? 0
    : Math.round(
        topics.reduce((sum, topic) => sum + Number(topic.confidence_score || 0), 0) / totalTopics
      );

  return {
    totalTopics,
    completedTopics,
    inProgressTopics,
    pendingTopics: Math.max(totalTopics - completedTopics - inProgressTopics, 0),
    completionPercent,
    averageConfidence,
    streakCount
  };
}

async function getLatestRecommendation(userId, goalId) {
  const { rows } = await db.query(
    `SELECT *
     FROM recommendations
     WHERE user_id = $1 AND goal_id = $2
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId, goalId]
  );

  return rows[0] || null;
}

module.exports = {
  computeDashboardStats,
  getGoalForUser,
  getLatestRecommendation,
  getTopicsForGoal,
  getUserProfile
};
