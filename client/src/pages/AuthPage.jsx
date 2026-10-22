import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const defaultSignup = {
  fullName: "",
  email: "",
  password: "",
  currentRole: "",
  proficiencyLevel: "beginner",
  interests: [],
  weeklyTargetHours: 5
};

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("signup");
  const [signupForm, setSignupForm] = useState(defaultSignup);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const header = useMemo(
    () =>
      mode === "signup"
        ? "Create your AI learning workspace"
        : "Welcome back to your learning roadmap",
    [mode]
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        await signup(signupForm);
        navigate("/interests");
      } else {
        await login(loginForm);
        navigate("/dashboard");
      }
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="mode-switch">
          <button
            type="button"
            className={mode === "signup" ? "mode-button active" : "mode-button"}
            onClick={() => setMode("signup")}
          >
            Sign up
          </button>
          <button
            type="button"
            className={mode === "login" ? "mode-button active" : "mode-button"}
            onClick={() => setMode("login")}
          >
            Login
          </button>
        </div>

        <p className="eyebrow">Authentication</p>
        <h1>{header}</h1>
        <p className="section-copy">
          We use your role, interests, and goals to create a personalized learning plan.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <>
              <label>
                Full name
                <input
                  value={signupForm.fullName}
                  onChange={(event) =>
                    setSignupForm((current) => ({ ...current, fullName: event.target.value }))
                  }
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(event) =>
                    setSignupForm((current) => ({ ...current, email: event.target.value }))
                  }
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={signupForm.password}
                  onChange={(event) =>
                    setSignupForm((current) => ({ ...current, password: event.target.value }))
                  }
                  required
                />
              </label>

              <label>
                Current role
                <input
                  value={signupForm.currentRole}
                  onChange={(event) =>
                    setSignupForm((current) => ({ ...current, currentRole: event.target.value }))
                  }
                  placeholder="Student, designer, backend developer..."
                />
              </label>

              <label>
                Skill level
                <select
                  value={signupForm.proficiencyLevel}
                  onChange={(event) =>
                    setSignupForm((current) => ({
                      ...current,
                      proficiencyLevel: event.target.value
                    }))
                  }
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </label>
            </>
          ) : (
            <>
              <label>
                Email
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(event) =>
                    setLoginForm((current) => ({ ...current, email: event.target.value }))
                  }
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((current) => ({ ...current, password: event.target.value }))
                  }
                  required
                />
              </label>
            </>
          )}

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Working..." : mode === "signup" ? "Create account" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
