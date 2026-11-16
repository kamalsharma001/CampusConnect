import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Requests() {
  const navigate = useNavigate();

  const student = JSON.parse(localStorage.getItem("student"));
  const studentId = localStorage.getItem("studentId");

  const [activeTab, setActiveTab] = useState("RECEIVED"); // "RECEIVED" or "SENT"
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    if (!student || !studentId) {
      navigate("/");
      return;
    }
    loadRequests();
  }, [student, studentId, navigate]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const receivedResponse = await api.get(`/requests/received/${studentId}`);
      const sentResponse = await api.get(`/requests/sent/${studentId}`);

      setReceivedRequests(receivedResponse.data);
      setSentRequests(sentResponse.data);
    } catch (err) {
      console.error("Error loading requests:", err);
      setError("Unable to load skill exchange requests.");
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      setActionId(requestId);
      setMessage("");
      setError("");

      await api.put(`/requests/${requestId}/accept`);
      setMessage("Skill exchange request accepted! You can now start collaborating. 🎉");
      await loadRequests();
    } catch (err) {
      console.error("Error accepting request:", err);
      setError("Failed to accept request.");
    } finally {
      setActionId(null);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      setActionId(requestId);
      setMessage("");
      setError("");

      await api.put(`/requests/${requestId}/reject`);
      setMessage("Skill exchange request declined.");
      await loadRequests();
    } catch (err) {
      console.error("Error rejecting request:", err);
      setError("Failed to decline request.");
    } finally {
      setActionId(null);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case "ACCEPTED":
        return <span className="badge badge-accepted">✓ Accepted</span>;
      case "REJECTED":
        return <span className="badge badge-rejected">✕ Declined</span>;
      default:
        return <span className="badge badge-pending">⏳ Pending Response</span>;
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar />

      <main className="page-container">
        <div className="page-header">
          <span className="page-badge">Collaboration Hub</span>
          <h1 className="page-title">Skill Exchange Requests 📩</h1>
          <p className="page-subtitle">
            Manage incoming peer learning invitations and track the status of requests you have sent.
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {/* TAB NAVIGATION */}
        <div className="requests-tab-bar">
          <button
            type="button"
            onClick={() => setActiveTab("RECEIVED")}
            className={`requests-tab-btn ${activeTab === "RECEIVED" ? "active" : ""}`}
          >
            📥 Incoming Requests ({receivedRequests.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("SENT")}
            className={`requests-tab-btn ${activeTab === "SENT" ? "active" : ""}`}
          >
            📤 Sent Invitations ({sentRequests.length})
          </button>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Loading exchange requests...</p>
        ) : activeTab === "RECEIVED" ? (
          /* INCOMING REQUESTS TAB */
          <div>
            {receivedRequests.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📥</div>
                <h3 className="empty-state-title">No Incoming Requests</h3>
                <p className="empty-state-desc">
                  When fellow students find your teaching skills in their match results, their collaboration requests will appear here.
                </p>
                <Link to="/skills" className="btn btn-primary">
                  Manage Teaching Skills
                </Link>
              </div>
            ) : (
              receivedRequests.map((req) => (
                <div key={req.id} className="request-item-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                    <div className="avatar-circle" style={{ width: "46px", height: "46px", fontSize: "1.1rem" }}>
                      {req.sender?.name ? req.sender.name[0].toUpperCase() : "S"}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-heading)" }}>
                          {req.sender?.name || "Student"}
                        </h4>
                        {renderStatusBadge(req.status)}
                      </div>
                      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                        {req.sender?.department} • Year {req.sender?.year} • {req.sender?.email}
                      </p>
                      <p style={{ fontSize: "0.85rem", marginTop: "0.35rem" }}>
                        Wants you to teach them:{" "}
                        <strong style={{ color: "var(--primary)" }}>{req.skill?.name}</strong>
                      </p>
                    </div>
                  </div>

                  {req.status === "PENDING" ? (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={() => acceptRequest(req.id)}
                        disabled={actionId === req.id}
                        className="btn btn-success"
                        style={{ padding: "0.55rem 1rem", fontSize: "0.8125rem" }}
                      >
                        ✓ Accept Request
                      </button>
                      <button
                        type="button"
                        onClick={() => rejectRequest(req.id)}
                        disabled={actionId === req.id}
                        className="btn btn-secondary"
                        style={{ padding: "0.55rem 1rem", fontSize: "0.8125rem" }}
                      >
                        ✕ Decline
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: "0.8125rem", color: "var(--text-light)" }}>
                      Resolved
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          /* SENT REQUESTS TAB */
          <div>
            {sentRequests.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📤</div>
                <h3 className="empty-state-title">No Sent Invitations</h3>
                <p className="empty-state-desc">
                  You haven't sent any skill exchange requests yet. Check your mutual matches to connect with peers!
                </p>
                <Link to="/matches" className="btn btn-primary">
                  Find Mutual Matches
                </Link>
              </div>
            ) : (
              sentRequests.map((req) => (
                <div key={req.id} className="request-item-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                    <div className="avatar-circle" style={{ width: "46px", height: "46px", fontSize: "1.1rem" }}>
                      {req.receiver?.name ? req.receiver.name[0].toUpperCase() : "S"}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-heading)" }}>
                          To: {req.receiver?.name || "Student"}
                        </h4>
                        {renderStatusBadge(req.status)}
                      </div>
                      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                        {req.receiver?.department} • Year {req.receiver?.year} • {req.receiver?.email}
                      </p>
                      <p style={{ fontSize: "0.85rem", marginTop: "0.35rem" }}>
                        Requested skill:{" "}
                        <strong style={{ color: "var(--primary)" }}>{req.skill?.name}</strong>
                      </p>
                    </div>
                  </div>

                  <div>
                    {req.status === "ACCEPTED" ? (
                      <span className="badge badge-accepted" style={{ padding: "0.4rem 0.8rem" }}>
                        🎉 Exchange Confirmed
                      </span>
                    ) : req.status === "REJECTED" ? (
                      <span className="badge badge-rejected" style={{ padding: "0.4rem 0.8rem" }}>
                        Declined
                      </span>
                    ) : (
                      <span className="badge badge-pending" style={{ padding: "0.4rem 0.8rem" }}>
                        Awaiting Peer Response
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Requests;
