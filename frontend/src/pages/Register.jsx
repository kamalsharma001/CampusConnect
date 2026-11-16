import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    year: ""
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      await api.post("/students", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        department: formData.department.trim(),
        year: Number(formData.year)
      });

      setSuccessMsg("Registration successful! Redirecting to sign in...");
      setTimeout(() => {
        navigate("/");
      }, 1400);

    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMsg("Registration failed. Email might already be registered on CampusConnect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-panel" style={{ maxWidth: "480px" }}>
        <div className="auth-logo-icon">🎓</div>
        <h1 className="auth-heading-text">CampusConnect</h1>
        <p className="auth-sub-text">Learn Together. Grow Together.</p>

        <div style={{ margin: "1.5rem 0 1rem", borderTop: "1px solid var(--border)", position: "relative" }}>
          <span style={{ position: "absolute", top: "-11px", left: "50%", transform: "translateX(-50%)", background: "#FFFFFF", padding: "0 0.75rem", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-light)", textTransform: "uppercase" }}>
            Student Onboarding
          </span>
        </div>

        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Alex Morgan"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">College Email</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. alex@campus.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a secure password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.75rem" }}>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input
                type="text"
                name="department"
                placeholder="e.g. Computer Science"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Academic Year</label>
              <input
                type="number"
                name="year"
                placeholder="e.g. 3"
                min="1"
                max="6"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem" }}
          >
            {loading ? "Creating Profile..." : "Join CampusConnect 🚀"}
          </button>
        </form>

        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "1.5rem" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "var(--primary)", fontWeight: "700", textDecoration: "none" }}>
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
