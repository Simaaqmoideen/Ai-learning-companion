export default function RecommendationPanel({ recommendation }) {
  const payload = recommendation?.payload || recommendation;

  if (!payload) {
    return (
      <div className="empty-state">
        <h3>No AI recommendation yet</h3>
        <p>Generate suggestions once you have a roadmap and some progress data.</p>
      </div>
    );
  }

  return (
    <div className="recommendation-grid">
      <section className="feature-card feature-card-wide">
        <p className="eyebrow">AI summary</p>
        <h2>{payload.summary}</h2>
        <p>{payload.encouragement}</p>
      </section>

      <section className="feature-card">
        <h3>Learn next</h3>
        <ul className="detail-list">
          {(payload.nextTopics || []).map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.reason}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="feature-card">
        <h3>Practice projects</h3>
        <ul className="detail-list">
          {(payload.practiceProjects || []).map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="feature-card">
        <h3>Resources</h3>
        <ul className="detail-list">
          {(payload.resources || []).map((item) => (
            <li key={item.url}>
              <a href={item.url} target="_blank" rel="noreferrer">
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="feature-card">
        <h3>Revision areas</h3>
        <ul className="detail-list">
          {(payload.revisionAreas || []).map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.reason}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

