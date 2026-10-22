import { useEffect, useState } from "react";
import { api } from "../api/client";
import ProgressBar from "../components/ProgressBar";
import TopicStatusCard from "../components/TopicStatusCard";

export default function ProgressTrackerPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getProgress()
      .then(setData)
      .catch((requestError) => setError(requestError.message));
  }, []);

  async function handleSave(topicId, payload) {
    const response = await api.updateProgress(topicId, payload);
    setData(response);
  }

  if (error) {
    return <p className="form-error">{error}</p>;
  }

  if (!data) {
    return <p className="section-copy">Loading progress tracker...</p>;
  }

  return (
    <div className="page-grid">
      <section className="feature-card feature-card-wide">
        <p className="eyebrow">Progress tracker</p>
        <h2>{data.goal.title}</h2>
        <p>Update each topic as you progress so the AI coach can keep your roadmap relevant.</p>
        <ProgressBar value={data.stats.completionPercent} />
      </section>

      <section className="topic-grid feature-card-wide">
        {data.topics.map((topic) => (
          <TopicStatusCard key={topic.id} topic={topic} onSave={handleSave} />
        ))}
      </section>
    </div>
  );
}

