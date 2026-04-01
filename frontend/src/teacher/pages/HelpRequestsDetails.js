import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function HelpRequestsDetails() {
  const [helpRequests, setHelpRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reply, setReply] = useState("");
  const [token, setToken] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let t = urlParams.get("token");

    if (t) {
      localStorage.setItem("token", t);
    } else {
      t = localStorage.getItem("token");
    }

    setToken(t);
  }, []);

  const fetchHelpRequests = async (authToken) => {
    try {
      const res = await axios.get(
        "https://ai-based-foundational-learning-production.up.railway.app/api/help/all",
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setHelpRequests(res.data?.all_doubts || []);
    } catch (err) {
      console.error("Error fetching help requests:", err);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchHelpRequests(token);
  }, [token]);

  const handleReplyClick = (request) => {
    setSelectedRequest(request);
    setReply(request.reply || "");
  };

  const sendReply = async () => {
    if (!selectedRequest?.id) return;
    if (!reply.trim()) {
      alert("Please type a reply");
      return;
    }

    try {
      setSending(true);

      await axios.post(
        `https://ai-based-foundational-learning-production.up.railway.app/api/help/reply/${selectedRequest.id}`,
        { reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedRequest(null);
      setReply("");
      fetchHelpRequests(token);
      alert("Reply sent successfully");
    } catch (err) {
      console.error("Error sending reply:", err);
      alert("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div className="top-bar">
          <h1 className="dashboard-heading">📨 Help Requests</h1>
        </div>
        <Link to="/dashboard">
          <button className="back-btn">← Back</button>
        </Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Type</th>
              <th>Doubt Message</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {helpRequests.length > 0 ? (
              helpRequests.map((r, i) => (
                <tr key={r.id || i}>
                  <td>
                    {r.student_id ? (
                      <Link
                        to="/learner-profile"
                        state={{ studentId: r.student_id }}
                        style={{
                          textDecoration: "none",
                          color: "#2563eb",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {r.student_name || "Unknown Student"}
                      </Link>
                    ) : (
                      <span>{r.student_name || "Unknown Student"}</span>
                    )}
                  </td>
                  <td>{r.topic || "General"}</td>
                  <td>{r.message || "No message"}</td>
                  <td>
                    <span
                      className={`risk-badge ${
                        r.status === "answered" ? "low" : "medium"
                      }`}
                    >
                      {r.status || "pending"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="small-btn"
                      onClick={() => handleReplyClick(r)}
                    >
                      {r.reply ? "Edit Reply" : "Reply"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No help requests.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <div className="reply-overlay">
          <div className="reply-modal">
            <div className="reply-modal-header">
              <div>
                <h3>Reply to Student</h3>
                <p>
                  {selectedRequest.student_id ? (
                    <Link
                      to="/learner-profile"
                      state={{ studentId: selectedRequest.student_id }}
                      style={{
                        textDecoration: "none",
                        color: "#2563eb",
                        fontWeight: 600,
                      }}
                    >
                      {selectedRequest.student_name}
                    </Link>
                  ) : (
                    selectedRequest.student_name
                  )}
                </p>
              </div>

              <button
                className="reply-close-btn"
                onClick={() => {
                  setSelectedRequest(null);
                  setReply("");
                }}
              >
                ✕
              </button>
            </div>

            <div className="reply-chat-box">
              <div className="chat-bubble student-bubble">
                <span className="chat-label">Student</span>
                <p>{selectedRequest.message}</p>
              </div>

              {selectedRequest.reply && (
                <div className="chat-bubble teacher-bubble">
                  <span className="chat-label">Previous Reply</span>
                  <p>{selectedRequest.reply}</p>
                </div>
              )}
            </div>

            <div className="reply-input-section">
              <label className="reply-label">Your Reply</label>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply here..."
                rows={5}
                className="reply-textarea"
              />
            </div>

            <div className="reply-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setSelectedRequest(null);
                  setReply("");
                }}
              >
                Cancel
              </button>

              <button
                className="send-btn"
                onClick={sendReply}
                disabled={sending}
              >
                {sending ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HelpRequestsDetails;