const db = require("../config/db");
const { generateLearningPath } = require("../services/aiService");
const { getGoalForUser, getTopicsForGoal, getUserProfile } = require("../services/learningService");

async function getLearningPath(req, res, next) {
  try {
    const goal = await getGoalForUser(req.user.id, req.query.goalId || null);
    if (!goal) {
      return res.status(404).json({ message: "No learning goal found for this user." });
    }

    const topics = await getTopicsForGoal(req.user.id, goal.id);
    return res.json({ goal, topics });
  } catch (error) {
    return next(error);
  }
}

async function generatePath(req, res, next) {
  const connection = await db.pool.connect();

  try {
    const user = await getUserProfile(req.user.id);
    const goal = await getGoalForUser(req.user.id, req.body.goalId || null);
    const forceRegenerate = Boolean(req.body.forceRegenerate);

    if (!goal) {
      return res.status(404).json({ message: "Create a learning goal before generating a path." });
    }

    const existingTopics = await getTopicsForGoal(req.user.id, goal.id);
    if (existingTopics.length > 0 && !forceRegenerate) {
      return res.json({
        goal,
        topics: existingTopics,
        message: "Existing learning path returned. Use forceRegenerate=true to rebuild it."
      });
    }

    const generatedTopics = await generateLearningPath(user, goal);

    await connection.query("BEGIN");

    if (existingTopics.length > 0) {
      await connection.query("DELETE FROM topics WHERE user_id = $1 AND goal_id = $2", [req.user.id, goal.id]);
    }

    const insertedTopics = [];
    for (const topic of generatedTopics) {
      const topicResult = await connection.query(
        `INSERT INTO topics (user_id, goal_id, title, description, phase, order_index, estimated_hours, difficulty, status, resource_links, practice_project, ai_notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9::jsonb, $10, $11)
         RETURNING *`,
        [
          req.user.id,
          goal.id,
          topic.title,
          topic.description,
          topic.phase,
          topic.orderIndex,
          topic.estimatedHours,
          topic.difficulty,
          JSON.stringify(topic.resources || []),
          topic.practiceProject,
          topic.aiNotes
        ]
      );

      const inserted = topicResult.rows[0];
      insertedTopics.push(inserted);

      await connection.query(
        `INSERT INTO user_progress (user_id, topic_id, status, completion_percent, confidence_score)
         VALUES ($1, $2, 'pending', 0, 50)`,
        [req.user.id, inserted.id]
      );
    }

    await connection.query("COMMIT");

    const topics = await getTopicsForGoal(req.user.id, goal.id);
    return res.status(201).json({ goal, topics });
  } catch (error) {
    await connection.query("ROLLBACK");
    return next(error);
  } finally {
    connection.release();
  }
}

module.exports = {
  generatePath,
  getLearningPath
};

