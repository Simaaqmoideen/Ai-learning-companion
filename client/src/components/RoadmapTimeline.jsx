export default function RoadmapTimeline({ topics = [] }) {
  if (topics.length === 0) {
    return (
      <div className="empty-state">
        <h3>No roadmap yet</h3>
        <p>Create your goal and generate an AI learning path to see your roadmap here.</p>
      </div>
    );
  }

  return (
    <div className="timeline">
      {topics.map((topic) => (
        <article key={topic.id} className={`timeline-card status-${topic.progress_status}`}>
          <div className="timeline-index">{topic.order_index}</div>
          <div className="timeline-content">
            <div className="timeline-meta">
              <span>{topic.phase}</span>
              <span>{topic.estimated_hours} hrs</span>
            </div>
            <h3>{topic.title}</h3>
            <p>{topic.description}</p>
            <div className="timeline-footer">
              <strong>{topic.progress_status.replace("_", " ")}</strong>
              <span>{topic.difficulty}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

