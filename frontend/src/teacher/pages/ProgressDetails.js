import React from "react";
import { Link } from "react-router-dom";

function ProgressDetails() {
  return (
    <div style={{ padding: "40px" }}>
      <h2>Detailed Student Progress</h2>

      <p>Total Students: 120</p>
      <p>Average Score: 72%</p>

      <p>This page can later include:</p>
      <ul>
        <li>Individual student scores</li>
        <li>Performance trends</li>
        <li>Charts</li>
      </ul>

      <Link to="/">← Back to Dashboard</Link>
    </div>
  );
}

export default ProgressDetails;