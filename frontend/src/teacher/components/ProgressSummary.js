import React from "react";

function ProgressSummary({ data }) {
  return (
    <div className="card">
      <h3>Student Progress Summary</h3>
      <p>Total Students: {data?.total_students}</p>
      <p>Average Score: {data?.average_score}</p>
    </div>
  );
}

export default ProgressSummary;
