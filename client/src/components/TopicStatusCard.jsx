import { useEffect, useState } from "react";

export default function TopicStatusCard({ topic, onSave }) {
  const [status, setStatus] = useState(topic.progress_status);
  const [confidenceScore, setConfidenceScore] = useState(topic.confidence_score);
  const [notes, setNotes] = useState(topic.notes || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setStatus(topic.progress_status);
    setConfidenceScore(topic.confidence_score);
    setNotes(topic.notes || "");
  }, [topic]);

  async function handleSave() {
    setIsSaving(true);
    try {
      await onSave(topic.id, {
        status,
        confidenceScore: Number(confidenceScore),
        notes
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <article className="topic-card">
      <div className="topic-card-head">
        <div>
          <span className="chip">{topic.phase}</span>
          <h3>{topic.title}</h3>
        </div>
        <strong>{topic.estimated_hours} hrs</strong>
      </div>

      <p>{topic.description}</p>

      <label>
        Status
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="pending">Pending</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </label>

      <label>
        Confidence score: {confidenceScore}
        <input
          type="range"
          min="0"
          max="100"
          value={confidenceScore}
          onChange={(event) => setConfidenceScore(event.target.value)}
        />
      </label>

      <label>
        Notes
        <textarea
          rows="3"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="What felt difficult? What clicked?"
        />
      </label>

      <button type="button" className="primary-button" onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save progress"}
      </button>
    </article>
  );
}
