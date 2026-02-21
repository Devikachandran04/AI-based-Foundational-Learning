import React from "react";
import { Link } from "react-router-dom";

function LowScoreStudents({ data }) {
  return (
    <Link 
          to="/weak-topics" 
          style={{ textDecoration: "none", color: "inherit" }}
        >
      <div className="card">
        <h3>Repeated Low-Score Students</h3>
        <ul>
          {data?.low_score_students?.map((student, index) => (
            <li key={index}>{student}</li>
          ))}
        </ul>
      </div>
    </Link>  
  );
}

export default LowScoreStudents;
