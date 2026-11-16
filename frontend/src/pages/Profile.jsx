import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Profile() {
  const navigate = useNavigate();

  const student = JSON.parse(localStorage.getItem("student"));
  const studentId = localStorage.getItem("studentId");

  const [name, setName] = useState(student?.name || "");
  const [email, setEmail] = useState(student?.email || "");
  const [department, setDepartment] = useState(student?.department || "");
  const [year, setYear] = useState(student?.year || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!student || !studentId) {
      navigate("/");
    }
  }, [student, studentId, navigate]);

  if (!student || !studentId) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.put(`/students/${studentId}`, {
        name: name.trim(),
        email: email.trim(),
        password: student.password,
        department: department.trim(),
        year: Number(year)
      });

      // Update stored session data
      localStorage.setItem("student", JSON.stringify(response.data));
      localStorage.setItem("studentId", response.data.id.toString());

      setMessage("Profile details updated successfully! ✅");
    } catch (err) {
      console.error("Update failed:", err);
      setError("Profile update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your CampusConnect account? All your teaching and learning skills will be removed."
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/students/${studentId}`);

      localStorage.removeItem("student");
      localStorage.removeItem("studentId");

      alert("Your account has been deleted.");
      navigate("/");
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Could not delete account. Please try again.");
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <span className="page-badge">Student Settings</span>
          <h1 className="page-title">My Profile 👤</h1>
          <p className="page-subtitle">View and update your student academic identity on CampusConnect.</p>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* PROFILE HERO HEADER */}
        <section className="profile-hero-card">
          <div className="profile-avatar-giant">
            {name ? name[0].toUpperCase() : "U"}
          </div>
          <div className="profile-details-column">
            <h2 className="profile-name">{name}</h2>
            <div className="profile-badges-row">
              <span className="badge badge-learn">{department || "Department"}</span>
              <span className="badge badge-teach">Academic Year {year || "1"}</span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>• {email}</span>
            </div>
          </div>
        </section>

        {/* EDIT FORM & DANGER ZONE */}
        <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "1.75rem" }}>
          {/* EDIT FORM CARD */}
          <div className="card">
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "1.25rem" }}>
              Edit Academic Information
            </h3>

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">College Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Academic Year</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ marginTop: "0.5rem" }}
              >
                {loading ? "Saving Changes..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* DANGER ZONE CARD */}
          <div className="card" style={{ height: "fit-content", borderColor: "var(--danger-border)" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--danger-text)", marginBottom: "0.5rem" }}>
              Danger Zone
            </h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "1.25rem", lineHeight: "1.4" }}>
              Deleting your account will permanently wipe your profile, skill listings, and active exchange requests from the campus directory.
            </p>

            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-ghost-danger"
              style={{ width: "100%" }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;
