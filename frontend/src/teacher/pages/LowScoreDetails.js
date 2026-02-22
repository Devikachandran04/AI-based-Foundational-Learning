import React from "react";
import { Link } from "react-router-dom";

function LowScoreDetails() {
  return (
    <div style={{ padding: "40px" }}>
      <h2>Repeated Low-Score Students</h2>

      <ul>
        <li>Student A – 3 consecutive low scores</li>
        <li>Student B – 2 consecutive low scores</li>
      </ul>

      <p>Teacher can intervene here.</p>

      <Link to="/">← Back to Dashboard</Link>
    </div>
  );
}

export default LowScoreDetails;