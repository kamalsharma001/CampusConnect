import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function FindStudents() {
  const [students, setStudents] = useState([]);
  const [skillsMap, setSkillsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const currentStudentId = Number(localStorage.getItem("studentId"));

  useEffect(() => {
    loadDirectory();
  }, []);

  const loadDirectory = async () => {
    try {
      setLoading(true);

      // Fetch all students
      const studentsRes = await api.get("/students");
      setStudents(studentsRes.data);

      // Fetch all student skills to display on profile cards
      try {
        const skillsRes = await api.get("/student-skills");
        const map = {};
        skillsRes.data.forEach((item) => {
          if (!item.student || !item.skill) return;
          const sId = item.student.id;
          if (!map[sId]) {
            map[sId] = { teach: [], learn: [] };
          }
          if (item.type === "TEACH") {
            map[sId].teach.push(item.skill.name);
          } else if (item.type === "LEARN") {
            map[sId].learn.push(item.skill.name);
          }
        });
        setSkillsMap(map);
      } catch (err) {
        console.warn("Could not load skills map for students:", err);
      }

    } catch (error) {
      console.error("Failed to load students:", error);
    } finally {
      setLoading(false);
    }
  };

  // Derive unique departments for filter pills
  const departments = [
    "ALL",
    ...new Set(students.map((s) => s.department).filter(Boolean)),
  ];

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === "ALL" || s.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="app-wrapper">
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <span className="page-badge">Campus Community</span>
          <h1 className="page-title">Find Students 👥</h1>
          <p className="page-subtitle">
            Explore fellow campus learners, discover their expertise, and find peers to exchange skills with.
          </p>
        </div>

        {/* CONTROLS: SEARCH & DEPT FILTER PILLS */}
        <div className="directory-controls">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by student name, department, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="dept-filters">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                className={`dept-pill ${selectedDept === dept ? "active" : ""}`}
              >
                {dept === "ALL" ? "All Departments" : dept}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS GRID */}
        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Loading campus directory...</p>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h3 className="empty-state-title">No Students Found</h3>
            <p className="empty-state-desc">
              We couldn't find any students matching your search criteria. Try a different query or clear your filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedDept("ALL");
              }}
              className="btn btn-secondary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="students-directory-grid">
            {filteredStudents.map((st) => {
              const studentSkills = skillsMap[st.id] || { teach: [], learn: [] };
              const isCurrentUser = st.id === currentStudentId;

              return (
                <div key={st.id} className="student-saas-card">
                  <div>
                    <div className="student-card-top">
                      <div className="student-avatar-lg">
                        {st.name ? st.name[0].toUpperCase() : "S"}
                      </div>
                      <div className="student-head-text">
                        <h3>
                          {st.name} {isCurrentUser && <span style={{ fontSize: "0.75rem", color: "var(--primary)" }}>(You)</span>}
                        </h3>
                        <p>{st.department} • Academic Year {st.year}</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>{st.email}</p>
                      </div>
                    </div>

                    {/* SKILLS DISPLAY ON CARD */}
                    <div className="student-skills-section" style={{ marginTop: "1.25rem" }}>
                      <div>
                        <span style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--success-text)", textTransform: "uppercase" }}>
                          🟢 Can Teach:
                        </span>
                        <div className="skills-chip-group" style={{ marginTop: "0.3rem" }}>
                          {studentSkills.teach.length > 0 ? (
                            studentSkills.teach.map((sk, idx) => (
                              <span key={idx} className="badge badge-teach" style={{ fontSize: "0.7rem" }}>
                                {sk}
                              </span>
                            ))
                          ) : (
                            <span style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>None listed</span>
                          )}
                        </div>
                      </div>

                      <div style={{ marginTop: "0.5rem" }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--primary)", textTransform: "uppercase" }}>
                          🔵 Wants to Learn:
                        </span>
                        <div className="skills-chip-group" style={{ marginTop: "0.3rem" }}>
                          {studentSkills.learn.length > 0 ? (
                            studentSkills.learn.map((sk, idx) => (
                              <span key={idx} className="badge badge-learn" style={{ fontSize: "0.7rem" }}>
                                {sk}
                              </span>
                            ))
                          ) : (
                            <span style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>None listed</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {!isCurrentUser ? (
                    <Link to="/matches" className="btn btn-secondary btn-sm" style={{ width: "100%" }}>
                      Check Mutual Compatibility →
                    </Link>
                  ) : (
                    <Link to="/profile" className="btn btn-secondary btn-sm" style={{ width: "100%" }}>
                      Edit Your Profile →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default FindStudents;
