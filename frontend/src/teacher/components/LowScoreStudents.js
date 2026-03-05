import React from "react";
import { Link } from "react-router-dom";

function LowScoreStudents({ data }) {

  const basicStudents = data?.basic_students || [];
  const mediumStudents = data?.medium_students || [];
  const advancedStudents = data?.advanced_students || [];

  return (
    <Link
      to="/low-scores"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="card">
        <h3>Student Performance Levels</h3>

        {/* BASIC LEVEL */}
        <h4>Basic Level (Score &lt; 50)</h4>
        {basicStudents.length === 0 ? (
          <p>No students</p>
        ) : (
          <ul>
            {basicStudents.map((student, index) => (
              <li key={index}>{student}</li>
            ))}
          </ul>
        )}

        {/* MEDIUM LEVEL */}
        <h4>Medium Level (50 - 70)</h4>
        {mediumStudents.length === 0 ? (
          <p>No students</p>
        ) : (
          <ul>
            {mediumStudents.map((student, index) => (
              <li key={index}>{student}</li>
            ))}
          </ul>
        )}

        {/* ADVANCED LEVEL */}
        <h4>Advanced Level (Score &gt; 70)</h4>
        {advancedStudents.length === 0 ? (
          <p>No students</p>
        ) : (
          <ul>
            {advancedStudents.map((student, index) => (
              <li key={index}>{student}</li>
            ))}
          </ul>
        )}

      </div>
    </Link>
  );
}

export default LowScoreStudents;