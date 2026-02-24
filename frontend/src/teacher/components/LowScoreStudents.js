import React from "react";
import { Link } from "react-router-dom";

function LowScoreStudents({ data }) {
  return (
    <Link
      to="/low-scores"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="card">
        <h3>Repeated Low-Score Students</h3>

        {data.low_score_students.length === 0 ? (
          <p>No repeated low-score students.</p>
        ) : (
          <ul>
            {data.low_score_students.map((student, index) => (
              <li key={index}>{student}</li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}

export default LowScoreStudents;
