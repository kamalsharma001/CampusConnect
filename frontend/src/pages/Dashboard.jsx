import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Dashboard() {
  const navigate = useNavigate();
  const student = JSON.parse(localStorage.getItem("student"));
  const studentId = localStorage.getItem("studentId");

  const [metrics, setMetrics] = useState({
    teachCount: 0,
    learnCount: 0,
    matchCount: 0,
    pendingRequestsCount: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    if (!student || !studentId) {
      navigate("/");
      return;
    }
    loadDashboardData();
  }, [student, studentId, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Student Skills
      const skillsRes = await api.get(`/student-skills/student/${studentId}`);
      const teach = skillsRes.data.filter((s) => s.type === "TEACH").length;
      const learn = skillsRes.data.filter((s) => s.type === "LEARN").length;

      // 2. Fetch Matches
      const matchesRes = await api.get(`/matches/${studentId}`);

      // 3. Fetch Received Requests
      const requestsRes = await api.get(`/requests/received/${studentId}`);
      const pending = requestsRes.data.filter((r) => r.status === "PENDING").length;

      setMetrics({
        teachCount: teach,
        learnCount: learn,
        matchCount: matchesRes.data.length,
        pendingRequestsCount: pending,
      });

      // Grab the 3 most recent requests
      setRecentRequests(requestsRes.data.slice(0, 3));
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAccept = async (requestId) => {
    try {
      await api.put(`/requests/${requestId}/accept`);
      setActionMessage("Request accepted! 🎉");
      loadDashboardData();
    } catch (err) {
      console.error("Accept failed:", err);
    }
  };

  const handleQuickReject = async (requestId) => {
    try {
      await api.put(`/requests/${requestId}/reject`);
      setActionMessage("Request declined.");
      loadDashboardData();
    } catch (err) {
      console.error("Reject failed:", err);
    }
  };

  if (!student) return null;

  return (
    <div className="app-wrapper">
      <Navbar />

      <main className="page-container">
        {/* HERO SECTION */}
        <section className="dashboard-hero">
          <div className="hero-content">
            <span className="hero-tag">🎓 Student Knowledge Exchange Portal</span>
            <h1 className="hero-heading">Welcome back, {student.name}! 👋</h1>
            <p className="hero-desc">
              {student.department} • Academic Year {student.year} • {student.email}
            </p>

            <div className="hero-actions">
              <Link to="/skills" className="btn btn-primary">
                + Add Skills
              </Link>
              <Link to="/matches" className="btn btn-secondary">
                View Mutual Matches ({metrics.matchCount})
              </Link>
              <Link to="/find-students" className="btn btn-secondary">
                Explore Campus Directory
              </Link>
            </div>
          </div>
        </section>

        {/* METRICS STATS GRID */}
        <section className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon-box metric-icon-teach">🟢</div>
            <div className="metric-info">
              <span className="metric-number">{loading ? "..." : metrics.teachCount}</span>
              <span className="metric-label">Skills You Teach</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box metric-icon-learn">🔵</div>
            <div className="metric-info">
              <span className="metric-number">{loading ? "..." : metrics.learnCount}</span>
              <span className="metric-label">Skills You Want to Learn</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box metric-icon-match">🤝</div>
            <div className="metric-info">
              <span className="metric-number">{loading ? "..." : metrics.matchCount}</span>
              <span className="metric-label">Compatible Peer Matches</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box metric-icon-req">📩</div>
            <div className="metric-info">
              <span className="metric-number">{loading ? "..." : metrics.pendingRequestsCount}</span>
              <span className="metric-label">Pending Exchange Requests</span>
            </div>
          </div>
        </section>

        {actionMessage && <div className="alert alert-success">{actionMessage}</div>}

        {/* DASHBOARD SPLIT: QUICK LINKS + RECENT REQUESTS */}
        <div className="dashboard-split">
          {/* LEFT: CORE NAVIGATION CARDS */}
          <div>
            <div className="page-header" style={{ marginBottom: "1.25rem" }}>
              <span className="page-badge">Navigation Hub</span>
              <h2 style={{ fontSize: "1.45rem", fontWeight: "800" }}>Manage Your Learning Journey</h2>
            </div>

            <div className="quick-links-grid">
              <Link to="/skills" className="quick-link-card">
                <div>
                  <div className="quick-link-icon">💡</div>
                  <h3 className="quick-link-title">Skill Portfolio</h3>
                  <p className="quick-link-desc">
                    List subjects you can teach fellow peers, and specify what skills you need help with.
                  </p>
                </div>
                <span className="quick-link-arrow">Manage Skills →</span>
              </Link>

              <Link to="/matches" className="quick-link-card">
                <div>
                  <div className="quick-link-icon">🤝</div>
                  <h3 className="quick-link-title">Mutual Matches</h3>
                  <p className="quick-link-desc">
                    Our dual-matching engine finds students who both have what you need and need what you offer.
                  </p>
                </div>
                <span className="quick-link-arrow">Explore Matches →</span>
              </Link>

              <Link to="/requests" className="quick-link-card">
                <div>
                  <div className="quick-link-icon">📩</div>
                  <h3 className="quick-link-title">Exchange Requests</h3>
                  <p className="quick-link-desc">
                    Review and respond to collaboration invites, and check the status of requests you've sent.
                  </p>
                </div>
                <span className="quick-link-arrow">View All Requests →</span>
              </Link>

              <Link to="/find-students" className="quick-link-card">
                <div>
                  <div className="quick-link-icon">👥</div>
                  <h3 className="quick-link-title">Campus Directory</h3>
                  <p className="quick-link-desc">
                    Discover fellow classmates across departments and inspect the skills they are sharing.
                  </p>
                </div>
                <span className="quick-link-arrow">Browse Students →</span>
              </Link>
            </div>
          </div>

          {/* RIGHT: RECENT REQUESTS PREVIEW */}
          <div>
            <div className="page-header" style={{ marginBottom: "1.25rem" }}>
              <span className="page-badge">Activity</span>
              <h2 style={{ fontSize: "1.45rem", fontWeight: "800" }}>Recent Requests</h2>
            </div>

            <div className="card" style={{ padding: "1.5rem" }}>
              {loading ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading activity...</p>
              ) : recentRequests.length === 0 ? (
                <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📬</div>
                  <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-heading)" }}>No requests yet</h4>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    Add teaching skills to your profile so other students can find and request an exchange!
                  </p>
                  <Link to="/skills" className="btn btn-secondary btn-sm" style={{ marginTop: "1rem" }}>
                    Add Teaching Skills
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {recentRequests.map((req) => (
                    <div
                      key={req.id}
                      style={{
                        padding: "0.85rem",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        background: "var(--bg-page)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                        <strong style={{ fontSize: "0.875rem", color: "var(--text-heading)" }}>
                          {req.sender?.name}
                        </strong>
                        <span className={`badge ${req.status === "ACCEPTED" ? "badge-accepted" : req.status === "REJECTED" ? "badge-rejected" : "badge-pending"}`}>
                          {req.status}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        Wants to learn: <span style={{ color: "var(--primary)", fontWeight: "600" }}>{req.skill?.name}</span>
                      </p>

                      {req.status === "PENDING" && (
                        <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.65rem" }}>
                          <button
                            onClick={() => handleQuickAccept(req.id)}
                            className="btn btn-success btn-sm"
                            style={{ flex: 1, padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                          >
                            ✓ Accept
                          </button>
                          <button
                            onClick={() => handleQuickReject(req.id)}
                            className="btn btn-secondary btn-sm"
                            style={{ flex: 1, padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                          >
                            ✕ Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  <Link
                    to="/requests"
                    style={{
                      textAlign: "center",
                      fontSize: "0.8125rem",
                      fontWeight: "700",
                      color: "var(--primary)",
                      textDecoration: "none",
                      marginTop: "0.5rem",
                    }}
                  >
                    View All Requests →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
