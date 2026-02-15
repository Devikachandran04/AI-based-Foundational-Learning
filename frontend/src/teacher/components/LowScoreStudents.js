import React from "react";

function LowScoreStudents({ data }) {
  return (
    <div className="card">
      <h3>Repeated Low-Score Students</h3>
      <ul>
        {data?.low_score_students?.map((student, index) => (
          <li key={index}>{student}</li>
        ))}
      </ul>
    </div>
  );
}

export default LowScoreStudents;
