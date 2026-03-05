//studentprogress
import React from "react";
import { Link } from "react-router-dom";

function ProgressSummary({ data }) {
  return (
    <Link 
      to="/progress" 
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="card">
        <h3>Student Progress Summary</h3>
        <p>Total Students: {data.total_students}</p>
        <p>Average Score: {data.average_score}</p>
      </div>
    </Link>
  );
}

export default ProgressSummary;