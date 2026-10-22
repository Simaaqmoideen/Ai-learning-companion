import { Link } from "react-router-dom";

const pillars = [
  "AI-generated learning paths built from your goals and interests",
  "Progress tracking with completion stats, confidence scores, and streaks",
  "Personalized next-step recommendations, revision ideas, and project prompts"
];

export default function LandingPage() {
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Personalized Learning Recommendation System</p>
          <h1>Learn with an adaptive roadmap that evolves with your progress.</h1>
          <p className="hero-text">
            Turn big goals like becoming a full stack developer or learning machine
            learning into a guided plan with AI recommendations, weekly focus, and
            practical project ideas.
          </p>
          <div className="hero-actions">
            <Link to="/auth" className="primary-button">
              Start your roadmap
            </Link>
            <a href="#features" className="ghost-button">
              Explore features
            </a>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-badge">Adaptive AI Coach</div>
          <div className="hero-roadmap">
            <span>HTML</span>
            <span>CSS</span>
            <span>JavaScript</span>
            <span>React</span>
            <span>Node.js</span>
            <span>Deployment</span>
          </div>
          <div className="hero-metrics">
            <article>
              <strong>76%</strong>
              <span>Roadmap complete</span>
            </article>
            <article>
              <strong>4</strong>
              <span>AI suggestions ready</span>
            </article>
            <article>
              <strong>9 days</strong>
              <span>Current streak</span>
            </article>
          </div>
        </div>
      </section>

      <section id="features" className="landing-grid">
        {pillars.map((pillar) => (
          <article key={pillar} className="feature-card">
            <p className="eyebrow">What you get</p>
            <h3>{pillar}</h3>
          </article>
        ))}
      </section>
    </div>
  );
}

