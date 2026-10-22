const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});
const express = require("express");
const cors = require("cors");
const { requireAuth } = require("./middleware/auth");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const goalRoutes = require("./routes/goalRoutes");
const pathRoutes = require("./routes/pathRoutes");
const progressRoutes = require("./routes/progressRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());
const localDevOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

app.use(
  cors({
    origin(origin, callback) {
      const isAllowedOrigin = !origin ||
        allowedOrigins.includes(origin) ||
        localDevOriginPattern.test(origin);

      if (isAllowedOrigin) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", requireAuth, profileRoutes);
app.use("/api/goals", requireAuth, goalRoutes);
app.use("/api/learning-path", requireAuth, pathRoutes);
app.use("/api/progress", requireAuth, progressRoutes);
app.use("/api/recommendations", requireAuth, recommendationRoutes);
app.use("/api/dashboard", requireAuth, dashboardRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    message: error.message || "Unexpected server error."
  });
});

module.exports = app;
