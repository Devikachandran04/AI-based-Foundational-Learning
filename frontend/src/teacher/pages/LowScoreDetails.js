import React from "react";
import { Link } from "react-router-dom";

function LowScoreDetails() {

  // ✅ realistic student data
  const students = [
    { name: "Samyuktha S", consecutiveLowScores: 3, lastScore: 42 },
    { name: "Ardra A S", consecutiveLowScores: 2, lastScore: 48 },
    { name: "Nivya R", consecutiveLowScores: 4, lastScore: 39 }
  ];

  // ✅ high risk = >= 3 low scores
  const highRisk = students.filter(s => s.consecutiveLowScores >= 3).length;

  return (
    <div className="analytics-page">

      {/* HEADER */}
      <div className="analytics-header">

        <div className="top-bar">
          <div></div>
          <h1 className="dashboard-heading">📉 Low Score Students Analytics</h1>
        </div>

        <Link to="/dashboard">
          <button className="back-btn">← Back</button>
        </Link>

      </div>

      {/* KPI CARDS */}
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

      {/* TABLE */}
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
            {students.map((student, index) => {

              const isHigh = student.consecutiveLowScores >= 3;

              return (
                <tr key={index}>
                  <td>
                    {/* ✅ navigate to fixed profile */}
                    <Link 
                      to="/learner-profile"
                      style={{
                        textDecoration: "none",
                        color: "#2563eb",
                        fontWeight: "600"
                      }}
                    >
                      {student.name}
                    </Link>
                  </td>

                  <td>{student.consecutiveLowScores}</td>
                  <td>{student.lastScore}%</td>

                  <td>
                    <span className={`risk-badge ${isHigh ? "high" : "medium"}`}>
                      {isHigh ? "High" : "Medium"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default LowScoreDetails;