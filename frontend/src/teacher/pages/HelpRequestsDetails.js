import React from "react";
import { Link } from "react-router-dom";

function HelpRequestsDetails() {
  return (
    <div style={{ padding: "40px" }}>
      <h2>Help Requests</h2>

      <p>No help requests currently.</p>

      <Link to="/">← Back to Dashboard</Link>
    </div>
  );
}

export default HelpRequestsDetails;