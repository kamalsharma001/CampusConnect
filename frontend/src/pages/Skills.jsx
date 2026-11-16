import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Skills() {
  const navigate = useNavigate();

  const student = JSON.parse(localStorage.getItem("student"));
  const studentId = localStorage.getItem("studentId");

  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState("");
  const [skillType, setSkillType] = useState("TEACH");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const popularSuggestions = [
    "Python",
    "React.js",
    "Spring Boot",
    "Data Structures",
    "Machine Learning",
    "UI/UX Design",
    "Java",
    "SQL & Databases",
    "Web Development",
    "Cloud Computing"
  ];

  const loadSkills = async () => {
    if (!student || !studentId) {
      setLoading(false);
      navigate("/");
      return;
    }

    try {
      const response = await api.get(`/student-skills/student/${studentId}`);
      setSkills(response.data);
    } catch (err) {
      console.error("Failed to load skills:", err);
      setError("Could not load your skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!student || !studentId) {
      navigate("/");
      return;
    }

    const trimmedSkillName = skillName.trim();
    if (!trimmedSkillName) {
      setError("Please enter a skill name.");
      return;
    }

    try {
      setSaving(true);

      // 1. Check existing skills catalog
      const skillsResponse = await api.get("/skills");

      let existingSkill = skillsResponse.data.find(
        (skill) =>
          skill.name?.trim().toLowerCase() === trimmedSkillName.toLowerCase()
      );

      // 2. Create if not found
      if (!existingSkill) {
        const newSkillResponse = await api.post("/skills", {
          name: trimmedSkillName
        });
        existingSkill = newSkillResponse.data;
      }

      // 3. Prevent duplicate entry
      const alreadyExists = skills.some(
        (studentSkill) =>
          Number(studentSkill.skill?.id) === Number(existingSkill.id) &&
          studentSkill.type === skillType
      );

      if (alreadyExists) {
        setError(
          `You have already added "${existingSkill.name}" as ${
            skillType === "TEACH" ? "I can Teach" : "I want to Learn"
          }.`
        );
        return;
      }

      // 4. Save StudentSkill association
      await api.post("/student-skills", {
        student: { id: Number(studentId) },
        skill: { id: existingSkill.id },
        type: skillType
      });

      setMessage(`"${existingSkill.name}" successfully added to your ${skillType === "TEACH" ? "Teaching" : "Learning"} skills! ✅`);
      setSkillName("");

      await loadSkills();
    } catch (err) {
      console.error("Failed to add skill:", err);
      setError("Could not add skill. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id, name) => {
    const confirmed = window.confirm(`Remove "${name}" from your skills list?`);
    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      await api.delete(`/student-skills/${id}`);
      setMessage(`"${name}" removed successfully.`);
      await loadSkills();
    } catch (err) {
      console.error("Failed to remove skill:", err);
      setError("Could not remove the skill. Please try again.");
    }
  };

  const teachSkills = skills.filter((s) => s.type === "TEACH");
  const learnSkills = skills.filter((s) => s.type === "LEARN");

  return (
    <div className="app-wrapper">
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <span className="page-badge">Skill Exchange Portfolio</span>
          <h1 className="page-title">Manage Your Skills 💡</h1>
          <p className="page-subtitle">
            List skills you can share with peers, and specify technologies or topics you want to learn.
          </p>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="skills-layout">
          {/* LEFT: ADD SKILL CARD */}
          <div className="card skill-form-card">
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "0.5rem" }}>
              Add a Skill
            </h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
              Type or select a skill to list on your campus profile.
            </p>

            <form onSubmit={handleAddSkill}>
              <div className="form-group">
                <label className="form-label">Skill Role</label>
                <div className="segmented-toggle">
                  <div
                    onClick={() => setSkillType("TEACH")}
                    className={`toggle-option ${skillType === "TEACH" ? "active" : ""}`}
                  >
                    🟢 I can Teach
                  </div>
                  <div
                    onClick={() => setSkillType("LEARN")}
                    className={`toggle-option ${skillType === "LEARN" ? "active" : ""}`}
                  >
                    🔵 I want to Learn
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. Python, Spring Boot, Figma"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)" }}>
                  Popular Suggestions:
                </span>
                <div className="suggestion-chips">
                  {popularSuggestions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSkillName(item)}
                      className="chip-btn"
                    >
                      + {item}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                style={{ width: "100%", padding: "0.75rem" }}
              >
                {saving ? "Saving Skill..." : "Add to Profile"}
              </button>
            </form>

            <div style={{ marginTop: "1.5rem", padding: "1rem", background: "var(--bg-page)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: "700", color: "var(--primary)" }}>
                💡 How Mutual Matching Works
              </span>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.35rem", lineHeight: "1.4" }}>
                Our engine automatically matches you with peers who teach what you want to learn, AND want to learn what you can teach!
              </p>
            </div>
          </div>

          {/* RIGHT: DUAL SKILLS LIST */}
          <div className="skills-dual-grid">
            {/* TEACHING SKILLS */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-heading)" }}>
                    🟢 Skills I Can Teach ({teachSkills.length})
                  </h3>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                    Knowledge and subjects you are available to share with fellow students.
                  </p>
                </div>
                <span className="badge badge-teach">{teachSkills.length} Active</span>
              </div>

              {loading ? (
                <p style={{ color: "var(--text-muted)" }}>Loading skills...</p>
              ) : teachSkills.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", background: "var(--bg-page)", borderRadius: "var(--radius-md)" }}>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>No teaching skills added yet.</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-light)", marginTop: "0.25rem" }}>
                    Add skills you are confident in to start receiving exchange requests.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {teachSkills.map((item) => (
                    <div key={item.id} className="skill-row">
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span className="badge badge-teach">TEACH</span>
                        <strong style={{ fontSize: "0.95rem", color: "var(--text-heading)" }}>
                          {item.skill?.name}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSkill(item.id, item.skill?.name)}
                        className="btn btn-ghost-danger btn-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* LEARNING SKILLS */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-heading)" }}>
                    🔵 Skills I Want to Learn ({learnSkills.length})
                  </h3>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                    Topics, languages, or tools you are eager to learn from campus peers.
                  </p>
                </div>
                <span className="badge badge-learn">{learnSkills.length} Active</span>
              </div>

              {loading ? (
                <p style={{ color: "var(--text-muted)" }}>Loading skills...</p>
              ) : learnSkills.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", background: "var(--bg-page)", borderRadius: "var(--radius-md)" }}>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>No learning skills added yet.</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-light)", marginTop: "0.25rem" }}>
                    Select skills you want to learn to activate the mutual matching algorithm.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {learnSkills.map((item) => (
                    <div key={item.id} className="skill-row">
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span className="badge badge-learn">LEARN</span>
                        <strong style={{ fontSize: "0.95rem", color: "var(--text-heading)" }}>
                          {item.skill?.name}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSkill(item.id, item.skill?.name)}
                        className="btn btn-ghost-danger btn-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
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

export default Skills;
