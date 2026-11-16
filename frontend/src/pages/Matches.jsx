import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Matches() {
  const navigate = useNavigate();

  const student = JSON.parse(localStorage.getItem("student"));
  const studentId = localStorage.getItem("studentId");

  const [matches, setMatches] = useState([]);
  const [myLearnSkills, setMyLearnSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    if (!student || !studentId) {
      navigate("/");
      return;
    }
    loadData();
  }, [student, studentId, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Fetch Matches from backend
      const matchesResponse = await api.get(`/matches/${studentId}`);
      setMatches(matchesResponse.data);

      // 2. Fetch current student's skills to display the learning options
      const skillsResponse = await api.get(`/student-skills/student/${studentId}`);
      const learnSkills = skillsResponse.data.filter((s) => s.type === "LEARN");
      setMyLearnSkills(learnSkills);

      // Default selected skill for each matched student
      const initialSelected = {};
      if (learnSkills.length > 0) {
        matchesResponse.data.forEach((m) => {
          initialSelected[m.id] = learnSkills[0].skill?.id;
        });
      }
      setSelectedSkills(initialSelected);

    } catch (err) {
      console.error("Error loading matches:", err);
      setError("Unable to calculate mutual matches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSkill = (matchedStudentId, skillId) => {
    setSelectedSkills((prev) => ({
      ...prev,
      [matchedStudentId]: Number(skillId)
    }));
  };

  const sendRequest = async (receiverId) => {
    const skillToRequest =
      selectedSkills[receiverId] ||
      (myLearnSkills[0] ? myLearnSkills[0].skill?.id : null);

    if (!skillToRequest) {
      setError("Please add at least one learning skill in 'My Skills' before requesting an exchange.");
      return;
    }

    try {
      setSendingId(receiverId);
      setMessage("");
      setError("");

      await api.post("/requests", null, {
        params: {
          senderId: studentId,
          receiverId: receiverId,
          skillId: skillToRequest
        }
      });

      setMessage("Skill exchange request successfully sent! Check 'Requests' to monitor status. ✅");
    } catch (err) {
      console.error("Error sending request:", err);
      setError(err.response?.data?.message || "Failed to send skill exchange request.");
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <span className="page-badge">Dual-Compatibility Engine</span>
          <h1 className="page-title">Mutual Skill Matches 🤝</h1>
          <p className="page-subtitle">
            Students who teach what you want to learn, AND want to learn what you can teach.
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Running compatibility matching algorithm...</p>
        ) : matches.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🤝</div>
            <h3 className="empty-state-title">No Mutual Matches Found Yet</h3>
            <p className="empty-state-desc">
              CampusConnect matches two students only when there is a <strong>two-way fit</strong>: you can teach what they want, and they can teach what you need!
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <Link to="/skills" className="btn btn-primary">
                Add More Skills
              </Link>
              <Link to="/find-students" className="btn btn-secondary">
                Browse All Students
              </Link>
            </div>
          </div>
        ) : (
          <div className="matches-grid">
            {matches.map((matchedStudent) => (
              <div key={matchedStudent.id} className="match-card">
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span className="fit-banner">✨ 100% Mutual Fit</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem" }}>
                    <div className="student-avatar-lg">
                      {matchedStudent.name ? matchedStudent.name[0].toUpperCase() : "S"}
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-heading)" }}>
                        {matchedStudent.name}
                      </h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        {matchedStudent.department} • Year {matchedStudent.year}
                      </p>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>
                        {matchedStudent.email}
                      </p>
                    </div>
                  </div>

                  {/* EXCHANGE SELECTOR */}
                  <div className="exchange-preview-box" style={{ marginTop: "1.25rem" }}>
                    <span style={{ fontSize: "0.8125rem", fontWeight: "700", color: "var(--primary)" }}>
                      Select the skill you want them to teach you:
                    </span>
                    {myLearnSkills.length > 0 ? (
                      <select
                        value={selectedSkills[matchedStudent.id] || ""}
                        onChange={(e) => handleSelectSkill(matchedStudent.id, e.target.value)}
                        style={{ fontSize: "0.875rem", padding: "0.5rem 0.75rem" }}
                      >
                        {myLearnSkills.map((ls) => (
                          <option key={ls.id} value={ls.skill?.id}>
                            🎯 {ls.skill?.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span style={{ fontSize: "0.8125rem", color: "var(--danger)" }}>
                        You have not listed any learning skills yet.
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => sendRequest(matchedStudent.id)}
                  disabled={sendingId === matchedStudent.id}
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "0.75rem" }}
                >
                  {sendingId === matchedStudent.id ? "Sending Invitation..." : "Send Skill Exchange Request 🚀"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Matches;
