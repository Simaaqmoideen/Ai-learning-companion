import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import InsightCard from "../components/InsightCard";
import ProgressBar from "../components/ProgressBar";
import RoadmapTimeline from "../components/RoadmapTimeline";
import StatCard from "../components/StatCard";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getDashboard()
      .then(setDashboard)
      .catch((requestError) => setError(requestError.message));
  }, []);

  if (error) {
    return <p className="form-error">{error}</p>;
  }

  if (!dashboard) {
    return <p className="section-copy">Loading your dashboard...</p>;
  }

  const { goal, roadmap, recommendation, stats } = dashboard;

  return (
    <div className="page-grid">
      <section className="feature-card feature-card-wide">
        <p className="eyebrow">Current goal</p>
        <h2>{goal?.title || "Create your first learning goal"}</h2>
        <p>{goal?.description || "Define a goal to unlock your AI-generated roadmap and progress insights."}</p>
        <ProgressBar value={stats.completionPercent} />
      </section>

      <section className="stats-grid feature-card-wide">
        <StatCard label="Completed topics" value={stats.completedTopics} subtext="Milestones finished" />
        <StatCard label="In progress" value={stats.inProgressTopics} subtext="Topics actively being studied" />
        <StatCard label="Average confidence" value={`${stats.averageConfidence}%`} subtext="Self-assessed confidence" />
        <StatCard label="Current streak" value={`${stats.streakCount} days`} subtext="Consecutive active days" />
      </section>

      <section className="feature-card">
        <p className="eyebrow">Smart insight</p>
        <h3>{recommendation?.summary || "Generate AI recommendations to see smart insights."}</h3>
        <p>
          {recommendation?.payload?.encouragement ||
            "Once you start completing topics, the AI coach will suggest what to revise and what to learn next."}
        </p>
        <Link to="/recommendations" className="ghost-button">
          Open AI coach
        </Link>
      </section>

      <section className="feature-card">
        <p className="eyebrow">Roadmap health</p>
        <div className="insight-grid">
          <InsightCard
            label="Pending topics"
            value={stats.pendingTopics}
            detail="Topics not started yet"
          />
          <InsightCard
            label="Roadmap size"
            value={stats.totalTopics}
            detail="Total topics in the current path"
          />
        </div>
      </section>

      <section className="feature-card feature-card-wide">
        <div className="section-head">
          <div>
            <p className="eyebrow">Learning roadmap</p>
            <h2>Your sequenced path</h2>
          </div>
          <Link to="/progress" className="ghost-button">
            Update progress
          </Link>
        </div>
        <RoadmapTimeline topics={roadmap} />
      </section>
    </div>
  );
}

