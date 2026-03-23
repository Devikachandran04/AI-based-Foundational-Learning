import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const token = localStorage.getItem("token");

const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};
function HelpRequestsDetails() {
  const [helpRequests, setHelpRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
  const token = localStorage.getItem("token");

  axios
    .get("http://127.0.0.1:5000/api/help/all", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      setHelpRequests(res.data?.all_doubts || []);
    })
    .catch((err) => console.error("Error fetching help requests:", err));
}, []);

  const handleReplyClick = (request) => {
    setSelectedRequest(request);
  };

  const sendReply = () => {
    console.log("Reply sent:", reply, "for request:", selectedRequest);
    setReply("");
    setSelectedRequest(null);
  };

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div className="top-bar">
          <div></div>
          <h1 className="dashboard-heading">Help Requests</h1>
        </div>

        <Link to="/dashboard">
          <button className="back-btn">← Back</button>
        </Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Topic</th>
              <th>Message</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {helpRequests.length > 0 ? (
              helpRequests.map((request, index) => (
                <tr key={request.id || index}>
                  <td>{request.student || request.student_name || "N/A"}</td>
                  <td>{request.topic || "N/A"}</td>
                  <td>{request.message || request.doubt || "No message"}</td>

                  <td>
                    <span
                      className={`risk-badge ${(
                        request.status || "pending"
                      ).toLowerCase()}`}
                    >
                      {request.status || "Pending"}
                    </span>
                  </td>

                  <td>
                    <button
                      className="small-btn"
                      onClick={() => handleReplyClick(request)}
                    >
                      Reply
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No help requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <div className="reply-panel">
          <div className="reply-header">
            <h3>
              Reply to{" "}
              {selectedRequest.student || selectedRequest.student_name || "Student"}
            </h3>

            <button
              className="close-reply"
              onClick={() => setSelectedRequest(null)}
            >
              ✖
            </button>
          </div>

          <div className="request-details">
            <p>
              <strong>Topic:</strong> {selectedRequest.topic || "N/A"}
            </p>
            <p>
              <strong>Message:</strong>{" "}
              {selectedRequest.message || selectedRequest.doubt || "No message"}
            </p>
          </div>

          <textarea
            className="reply-textarea"
            placeholder="Write your response to the student..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />

          <div className="reply-actions">
            <button className="send-reply-btn" onClick={sendReply}>
              Send Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HelpRequestsDetails;