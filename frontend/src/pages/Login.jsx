import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await api.post("/students/login", {
        email: email.trim(),
        password: password
      });

      const student = response.data;

      // Store complete student information
      localStorage.setItem("student", JSON.stringify(student));
      localStorage.setItem("studentId", student.id.toString());

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response && error.response.status === 401) {
        setErrorMsg("Invalid college email or password. Please verify your credentials.");
      } else {
        setErrorMsg("Unable to connect to the CampusConnect server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-panel">
        <div className="auth-logo-icon">🎓</div>
        <h1 className="auth-heading-text">CampusConnect</h1>
        <p className="auth-sub-text">Learn Together. Grow Together.</p>

        <div style={{ margin: "1.5rem 0 1rem", borderTop: "1px solid var(--border)", position: "relative" }}>
          <span style={{ position: "absolute", top: "-11px", left: "50%", transform: "translateX(-50%)", background: "#FFFFFF", padding: "0 0.75rem", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-light)", textTransform: "uppercase" }}>
            Student Sign In
          </span>
        </div>

        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="form-group">
            <label className="form-label">College Email</label>
            <input
              type="email"
              placeholder="e.g. kamal@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem" }}
          >
            {loading ? "Verifying Credentials..." : "Sign In to CampusConnect →"}
          </button>
        </form>

        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "1.5rem" }}>
          New to CampusConnect?{" "}
          <Link to="/register" style={{ color: "var(--primary)", fontWeight: "700", textDecoration: "none" }}>
            Create an Account
          </Link>
        </p>

        <div style={{ marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "center", gap: "1rem", fontSize: "0.75rem", color: "var(--text-light)" }}>
          <span>🤝 Peer Learning</span>
          <span>•</span>
          <span>⚡ Mutual Matching</span>
          <span>•</span>
          <span>🎓 Campus Verified</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
