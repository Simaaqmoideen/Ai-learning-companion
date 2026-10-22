const db = require("../config/db");
const { computeDashboardStats, getGoalForUser, getTopicsForGoal, getUserProfile } = require("../services/learningService");

function nextStreak(lastActiveOn, currentStreak) {
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const previous = lastActiveOn ? new Date(lastActiveOn) : null;

  if (!previous) {
    return 1;
  }

  const previousUtc = Date.UTC(previous.getUTCFullYear(), previous.getUTCMonth(), previous.getUTCDate());
  const diffInDays = Math.round((todayUtc - previousUtc) / (1000 * 60 * 60 * 24));
  if (diffInDays <= 0) {
    return currentStreak;
  }

  if (diffInDays === 1) {
    return currentStreak + 1;
  }

  return 1;
}

async function updateTopicProgress(req, res, next) {
  const connection = await db.pool.connect();

  try {
    const topicId = Number(req.params.topicId);
    const {
      status = "pending",
      completionPercent,
      confidenceScore = 50,
      notes = ""
    } = req.body;

    const topicResult = await connection.query(
      `SELECT id, goal_id
       FROM topics
       WHERE id = $1 AND user_id = $2`,
      [topicId, req.user.id]
    );

    const topic = topicResult.rows[0];
    if (!topic) {
      return res.status(404).json({ message: "Topic not found." });
    }

    const normalizedCompletionPercent =
      typeof completionPercent === "number"
        ? completionPercent
        : status === "completed"
          ? 100
          : status === "in_progress"
            ? 50
            : 0;
    const completedAt = status === "completed" ? new Date().toISOString() : null;

    await connection.query("BEGIN");

    await connection.query(
      `UPDATE user_progress
       SET
         status = CAST($1 AS VARCHAR(30)),
         completion_percent = $2,
         confidence_score = $3,
         notes = $4,
         completed_at = $5,
         updated_at = NOW()
       WHERE user_id = $6 AND topic_id = $7`,
      [status, normalizedCompletionPercent, confidenceScore, notes, completedAt, req.user.id, topicId]
    );

    await connection.query(
      `UPDATE topics
       SET status = CAST($1 AS VARCHAR(30)), updated_at = NOW()
       WHERE id = $2`,
      [status, topicId]
    );

    if (status === "completed") {
      const user = await getUserProfile(req.user.id);
      await connection.query(
        `UPDATE users
         SET streak_count = $1, last_active_on = CURRENT_DATE, updated_at = NOW()
         WHERE id = $2`,
        [nextStreak(user.last_active_on, user.streak_count), req.user.id]
      );
    }

    await connection.query("COMMIT");

    const goal = await getGoalForUser(req.user.id, topic.goal_id);
    const user = await getUserProfile(req.user.id);
    const topics = await getTopicsForGoal(req.user.id, topic.goal_id);
    const stats = computeDashboardStats(topics, user.streak_count);

    return res.json({
      goal,
      topics,
      stats
    });
  } catch (error) {
    await connection.query("ROLLBACK");
    return next(error);
  } finally {
    connection.release();
  }
}

async function getProgressSummary(req, res, next) {
  try {
    const goal = await getGoalForUser(req.user.id, req.query.goalId || null);
    if (!goal) {
      return res.status(404).json({ message: "No learning goal found for this user." });
    }

    const user = await getUserProfile(req.user.id);
    const topics = await getTopicsForGoal(req.user.id, goal.id);

    return res.json({
      goal,
      stats: computeDashboardStats(topics, user.streak_count),
      topics
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProgressSummary,
  updateTopicProgress
};
