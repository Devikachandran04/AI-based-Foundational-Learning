import React, { useState } from "react";
import { Link } from "react-router-dom";

function HelpRequestsDetails() {

const helpRequests = [
{
student: "Student C",
topic: "Fractions",
message: "Need help understanding division of fractions.",
status: "Pending",
},
{
student: "Student D",
topic: "Grammar",
message: "Confused about sentence structure.",
status: "Resolved",
},
];

const [selectedRequest, setSelectedRequest] = useState(null);
const [reply, setReply] = useState("");

const handleReplyClick = (request) => {
setSelectedRequest(request);
};

const sendReply = () => {
console.log("Reply sent:", reply);
setReply("");
};

return ( <div className="analytics-page">

  <div className="analytics-header">
    <div className="top-bar">
  <div></div>  {/* empty space for alignment */}

  <h1 className="dashboard-heading">Help Requests</h1>

  </div>
    <Link to="/">
      <button className="back-btn">Back</button>
    </Link>
  </div>

  {/* TABLE */}
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
        {helpRequests.map((request, index) => (
          <tr key={index}>
            <td>{request.student}</td>
            <td>{request.topic}</td>
            <td>{request.message}</td>

            <td>
              <span className={`risk-badge ${request.status.toLowerCase()}`}>
                {request.status}
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
        ))}
      </tbody>
    </table>
  </div>

  {/* REPLY PANEL */}
  {selectedRequest && (
    <div className="reply-panel">

      <h3>Reply to {selectedRequest.student}</h3>

      <p><strong>Topic:</strong> {selectedRequest.topic}</p>
      <p><strong>Message:</strong> {selectedRequest.message}</p>

      <textarea
        placeholder="Type your reply..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      />

      <div className="reply-actions">
        <button className="small-btn" onClick={sendReply}>
          Send
        </button>

        <button
          className="back-btn"
          onClick={() => setSelectedRequest(null)}
        >
          Close
        </button>
      </div>

    </div>
  )}

</div>

);
}

export default HelpRequestsDetails;
