import { useEffect, useState } from "react";
import { api } from "../api/client";
import RecommendationPanel from "../components/RecommendationPanel";

export default function RecommendationsPage() {
  const [goal, setGoal] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getLatestRecommendation()
      .then((response) => {
        setGoal(response.goal);
        setRecommendation(response.recommendation);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleGenerate() {
    setGenerating(true);
    setError("");
    try {
      const response = await api.generateRecommendations({});
      setGoal(response.goal);
      setRecommendation(response.recommendation);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return <p className="section-copy">Loading AI recommendations...</p>;
  }

  return (
    <div className="page-grid">
      <section className="feature-card feature-card-wide">
        <div className="section-head">
          <div>
            <p className="eyebrow">AI recommendation engine</p>
            <h2>{goal?.title || "Generate your first recommendation set"}</h2>
          </div>
          <button type="button" className="primary-button" onClick={handleGenerate} disabled={generating}>
            {generating ? "Generating..." : "Generate insights"}
          </button>
        </div>
        <p>
          The recommendation engine analyzes what you completed, where your confidence is low,
          and what topic will create the most momentum.
        </p>
        {error ? <p className="form-error">{error}</p> : null}
      </section>

      <RecommendationPanel recommendation={recommendation} />
    </div>
  );
}
