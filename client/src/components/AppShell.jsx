import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/progress", label: "Progress" },
  { to: "/recommendations", label: "AI Coach" },
  { to: "/interests", label: "Goals" }
];

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-main">
          <div className="brand">
            <span className="brand-mark">PL</span>
            <div>
              <h2>PathLift</h2>
              <p>Personalized Learning Recommendation System</p>
            </div>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="user-card">
            <strong>{user?.fullName}</strong>
            <span>{user?.email}</span>
          </div>
          <button type="button" className="ghost-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="shell-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">AI-guided roadmap</p>
            <h1>Stay focused on the next best topic</h1>
          </div>
          <div className="topbar-chip">
            <span>Weekly goal</span>
            <strong>{user?.weeklyTargetHours || 0} hrs</strong>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
