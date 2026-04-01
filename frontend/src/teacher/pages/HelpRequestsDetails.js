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

      alert("Reply sent successfully");
      setSelectedRequest(null);
      setReply("");
      fetchHelpRequests(token);
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
                  <td>{r.student_name || r.name || "Unknown Student"}</td>
                  <td>{r.topic || "General"}</td>
                  <td>{r.message || "No message"}</td>
                  <td>{r.status || "pending"}</td>
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
        <div className="student-popup">
          <h4>Reply to {selectedRequest.student_name}</h4>
          <p style={{ marginBottom: "10px", color: "#444" }}>
            <strong>Student doubt:</strong> {selectedRequest.message}
          </p>

          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your reply..."
            rows={4}
          />

          <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
            <button className="small-btn" onClick={sendReply} disabled={sending}>
              {sending ? "Sending..." : "Send Reply"}
            </button>
            <button
              className="small-btn"
              onClick={() => {
                setSelectedRequest(null);
                setReply("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HelpRequestsDetails;