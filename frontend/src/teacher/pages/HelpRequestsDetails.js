import React from "react";
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

  const pendingCount = helpRequests.filter(r => r.status === "Pending").length;

  return (
    <div className="analytics-page">

      <div className="analytics-header">
        <h2>❓ Help Requests Analytics</h2>
        <Link to="/" className="back-link">← Back to Dashboard</Link>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h4>Total Requests</h4>
          <p>{helpRequests.length}</p>
        </div>

        <div className="kpi-card">
          <h4>Pending Requests</h4>
          <p>{pendingCount}</p>
        </div>

        <div className="kpi-card">
          <h4>Resolved</h4>
          <p>{helpRequests.length - pendingCount}</p>
        </div>
      </div>

      {/* Table */}
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
                  <button className="small-btn">Reply</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default HelpRequestsDetails;