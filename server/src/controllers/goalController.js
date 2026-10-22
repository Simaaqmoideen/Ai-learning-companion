const db = require("../config/db");

async function listGoals(req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT *
       FROM learning_goals
       WHERE user_id = $1
       ORDER BY
         CASE WHEN status = 'active' THEN 0 ELSE 1 END,
         priority ASC,
         created_at DESC`,
      [req.user.id]
    );

    return res.json({ goals: rows });
  } catch (error) {
    return next(error);
  }
}

async function createGoal(req, res, next) {
  try {
    const {
      title,
      description = "",
      goalType = "career",
      targetDate = null,
      priority = 1,
      status = "active"
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "A goal title is required." });
    }

    if (status === "active") {
      await db.query(
        `UPDATE learning_goals
         SET status = 'paused', updated_at = NOW()
         WHERE user_id = $1 AND status = 'active'`,
        [req.user.id]
      );
    }

    const { rows } = await db.query(
      `INSERT INTO learning_goals (user_id, title, description, goal_type, target_date, priority, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, title, description, goalType, targetDate, priority, status]
    );

    return res.status(201).json({ goal: rows[0] });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createGoal,
  listGoals
};

