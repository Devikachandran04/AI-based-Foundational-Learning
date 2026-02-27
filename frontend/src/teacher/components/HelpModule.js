import React from "react";
import { Link } from "react-router-dom";

function HelpModule({ data }) {
  return (
    <Link
      to="/help-requests"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="card">
        <h3>Help Requests</h3>

        {data.help_requests.length === 0 ? (
          <p>No help requests yet.</p>
        ) : (
          <ul>
            {data.help_requests.map((request, index) => (
              <li key={index}>
                {request.student} - {request.topic}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}

export default HelpModule;