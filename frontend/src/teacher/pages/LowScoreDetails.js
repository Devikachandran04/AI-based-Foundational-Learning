import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function LowScoreDetails() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/teacher/dashboard/low-score-students")
      .then((res) => {
        setStudents(res.data?.low_score_students || []);
      })
      .catch((err) => console.error("Error fetching low score students:", err));
  }, []);

  const highRisk = students.filter(
    (s) => (s.consecutive_low_scores || s.consecutiveLowScores || 0) >= 3
  ).length;

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div className="top-bar">
          <div></div>
          <h1 className="dashboard-heading">📉 Low Score Students Analytics</h1>
        </div>

        <Link to="/dashboard">
          <button className="back-btn">← Back</button>
        </Link>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <h4>Total Low Score Students</h4>
          <p>{students.length}</p>
        </div>

        <div className="kpi-card">
          <h4>High Risk Students</h4>
          <p>{highRisk}</p>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Consecutive Low Scores</th>
              <th>Last Score</th>
              <th>Risk Level</th>
            </tr>
          </thead>

          <tbody>
            {students.length > 0 ? (
              students.map((student, index) => {
                const consecutive =
                  student.consecutive_low_scores ||
                  student.consecutiveLowScores ||
                  0;

                const lastScore =
                  student.last_score || student.lastScore || student.avg_score || 0;

                const isHigh = consecutive >= 3;

                return (
                  <tr key={student.id || index}>
                    <td>
                      <Link
                        to="/learner-profile"
                        style={{
                          textDecoration: "none",
                          color: "#2563eb",
                          fontWeight: "600",
                        }}
                      >
                        {student.name || student.student_name || "Unnamed Student"}
                      </Link>
                    </td>

                    <td>{consecutive}</td>
                    <td>{lastScore}%</td>

                    <td>
                      <span
                        className={`risk-badge ${isHigh ? "high" : "medium"}`}
                      >
                        {isHigh ? "High" : "Medium"}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4">No low score students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LowScoreDetails;