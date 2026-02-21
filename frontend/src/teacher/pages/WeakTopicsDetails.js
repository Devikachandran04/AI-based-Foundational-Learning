import React from "react";
import { Link } from "react-router-dom";

function WeakTopicsDetails() {
  return (
    <div style={{ padding: "40px" }}>
      <h2>Weak Topics Analysis</h2>

      <ul>
        <li>Fractions – Average Score: 48%</li>
        <li>Grammar – Average Score: 52%</li>
      </ul>

      <p>Teachers can assign remedial materials here.</p>

      <Link to="/">← Back to Dashboard</Link>
    </div>
  );
}

export default WeakTopicsDetails;