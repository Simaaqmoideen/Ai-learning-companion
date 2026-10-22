import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { interestOptions } from "../data/interestOptions";
import { useAuth } from "../context/AuthContext";

export default function InterestSelectionPage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    currentRole: "",
    proficiencyLevel: "beginner",
    weeklyTargetHours: 5,
    interests: [],
    goalTitle: "",
    goalDescription: "",
    targetDate: ""
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm((current) => ({
        ...current,
        fullName: user.fullName || "",
        currentRole: user.currentRole || "",
        proficiencyLevel: user.proficiencyLevel || "beginner",
        weeklyTargetHours: user.weeklyTargetHours || 5,
        interests: user.interests || []
      }));
    }
  }, [user]);

  function toggleInterest(interest) {
    setForm((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest]
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setStatus("Saving your profile and building a roadmap...");
    setSaving(true);

    try {
      await api.updateProfile({
        fullName: form.fullName,
        currentRole: form.currentRole,
        proficiencyLevel: form.proficiencyLevel,
        interests: form.interests,
        weeklyTargetHours: Number(form.weeklyTargetHours)
      });

      const goalResponse = await api.createGoal({
        title: form.goalTitle,
        description: form.goalDescription,
        targetDate: form.targetDate || null,
        goalType: "career",
        priority: 1,
        status: "active"
      });

      await api.generateLearningPath({
        goalId: goalResponse.goal.id
      });

      await refreshUser();
      navigate("/dashboard");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
      setStatus("");
    }
  }

  return (
    <div className="page-grid">
      <section className="feature-card feature-card-wide">
        <p className="eyebrow">Onboarding</p>
        <h2>Tell the system what you want to learn.</h2>
        <p>
          We’ll use your interests, role, and goal to generate a structured path and
          smarter recommendations.
        </p>
      </section>

      <form className="form-grid feature-card feature-card-wide" onSubmit={handleSubmit}>
        <label>
          Full name
          <input
            value={form.fullName}
            onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
            required
          />
        </label>

        <label>
          Current role
          <input
            value={form.currentRole}
            onChange={(event) =>
              setForm((current) => ({ ...current, currentRole: event.target.value }))
            }
            placeholder="Student, data analyst, aspiring full stack developer"
          />
        </label>

        <label>
          Skill level
          <select
            value={form.proficiencyLevel}
            onChange={(event) =>
              setForm((current) => ({ ...current, proficiencyLevel: event.target.value }))
            }
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>

        <label>
          Weekly target hours
          <input
            type="number"
            min="1"
            max="40"
            value={form.weeklyTargetHours}
            onChange={(event) =>
              setForm((current) => ({ ...current, weeklyTargetHours: event.target.value }))
            }
          />
        </label>

        <label className="full-width">
          Learning goal
          <input
            value={form.goalTitle}
            onChange={(event) => setForm((current) => ({ ...current, goalTitle: event.target.value }))}
            placeholder="Become a Full Stack Developer"
            required
          />
        </label>

        <label className="full-width">
          Goal description
          <textarea
            rows="4"
            value={form.goalDescription}
            onChange={(event) =>
              setForm((current) => ({ ...current, goalDescription: event.target.value }))
            }
            placeholder="I want to build and deploy production-ready apps with React, Node.js, and PostgreSQL."
          />
        </label>

        <label>
          Target date
          <input
            type="date"
            value={form.targetDate}
            onChange={(event) => setForm((current) => ({ ...current, targetDate: event.target.value }))}
          />
        </label>

        <div className="full-width">
          <span className="field-label">Interests</span>
          <div className="interest-grid">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                type="button"
                className={form.interests.includes(interest) ? "interest-pill active" : "interest-pill"}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {error ? <p className="form-error full-width">{error}</p> : null}
        {status ? <p className="form-status full-width">{status}</p> : null}

        <button type="submit" className="primary-button" disabled={saving}>
          {saving ? "Generating..." : "Save profile and generate roadmap"}
        </button>
      </form>
    </div>
  );
}
