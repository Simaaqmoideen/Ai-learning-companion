const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { signToken } = require("../utils/jwt");

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    currentRole: user.role_title,
    proficiencyLevel: user.proficiency_level,
    interests: user.interests || [],
    weeklyTargetHours: user.weekly_target_hours,
    streakCount: user.streak_count,
    lastActiveOn: user.last_active_on
  };
}

async function signup(req, res, next) {
  try {
    const {
      fullName,
      email,
      password,
      currentRole = "",
      proficiencyLevel = "beginner",
      interests = [],
      weeklyTargetHours = 5
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Full name, email, and password are required." });
    }

    const existingUser = await db.query("SELECT id FROM users WHERE email = $1", [email.toLowerCase()]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { rows } = await db.query(
      `INSERT INTO users (full_name, email, password_hash, role_title, proficiency_level, interests, weekly_target_hours)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, full_name, email, role_title, proficiency_level, interests, weekly_target_hours, streak_count, last_active_on`,
      [
        fullName,
        email.toLowerCase(),
        passwordHash,
        currentRole,
        proficiencyLevel,
        interests,
        weeklyTargetHours
      ]
    );

    const user = rows[0];
    const token = signToken({ id: user.id, email: user.email });

    return res.status(201).json({
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken({ id: user.id, email: user.email });

    return res.json({
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
}

async function me(req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT id, full_name, email, role_title, proficiency_level, interests, weekly_target_hours, streak_count, last_active_on
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    return res.json({ user: sanitizeUser(rows[0]) });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
  me,
  signup
};
