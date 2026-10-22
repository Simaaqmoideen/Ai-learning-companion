const db = require("../config/db");

async function getProfile(req, res, next) {
  try {
    const userResult = await db.query(
      `SELECT id, full_name, email, role_title, proficiency_level, interests, weekly_target_hours, streak_count, last_active_on
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    const goalsResult = await db.query(
      `SELECT id, title, description, goal_type, target_date, priority, status, created_at
       FROM learning_goals
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    return res.json({
      user: userResult.rows[0],
      goals: goalsResult.rows
    });
  } catch (error) {
    return next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const {
      fullName,
      currentRole,
      proficiencyLevel,
      interests,
      weeklyTargetHours
    } = req.body;

    const { rows } = await db.query(
      `UPDATE users
       SET
         full_name = COALESCE($1, full_name),
         role_title = COALESCE($2, role_title),
         proficiency_level = COALESCE($3, proficiency_level),
         interests = COALESCE($4, interests),
         weekly_target_hours = COALESCE($5, weekly_target_hours),
         updated_at = NOW()
       WHERE id = $6
       RETURNING id, full_name, email, role_title, proficiency_level, interests, weekly_target_hours, streak_count, last_active_on`,
      [
        fullName || null,
        currentRole || null,
        proficiencyLevel || null,
        interests || null,
        weeklyTargetHours || null,
        req.user.id
      ]
    );

    return res.json({ user: rows[0] });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile
};
