import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const student = JSON.parse(localStorage.getItem("student"));

  const handleLogout = () => {
    localStorage.removeItem("student");
    localStorage.removeItem("studentId");
    navigate("/");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/skills", label: "My Skills", icon: "💡" },
    { to: "/matches", label: "My Matches", icon: "🤝" },
    { to: "/requests", label: "Requests", icon: "📩" },
    { to: "/find-students", label: "Find Students", icon: "👥" },
    { to: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to={student ? "/dashboard" : "/"} className="brand-wrapper">
          <div className="brand-symbol">🎓</div>
          <div className="brand-info">
            <span className="brand-name">CampusConnect</span>
            <span className="brand-tagline">Learn Together. Grow Together.</span>
          </div>
        </Link>

        {student && (
          <nav className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-item ${location.pathname === link.to ? "active" : ""}`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        )}

        <div className="nav-user">
          {student ? (
            <div className="user-badge">
              <div className="avatar-circle">
                {student.name ? student.name[0].toUpperCase() : "U"}
              </div>
              <div className="user-details">
                <span className="user-title">{student.name}</span>
                <span className="user-sub">{student.department || "Campus"} • Yr {student.year || "1"}</span>
              </div>
              <button onClick={handleLogout} className="btn-signout" title="Sign out of CampusConnect">
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link to="/" className="btn btn-secondary btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
