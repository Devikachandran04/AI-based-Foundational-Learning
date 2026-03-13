import React from "react";
import { Link } from "react-router-dom";

function LowScoreDetails() {

  const students = [
    { name: "Student A", consecutiveLowScores: 3, lastScore: 42 },
    { name: "Student B", consecutiveLowScores: 2, lastScore: 48 },
  ];

  const highRisk = students.filter(s => s.consecutiveLowScores >= 3).length;

  return (
    <div className="analytics-page">

      <div className="analytics-header">
        <div className="top-bar">
        <div></div>  {/* empty space for alignment */}

        <h1 className="dashboard-heading">📉Low Score Students Analytics</h1>

      </div>
        <Link to="/">
  <button className="back-btn">Back</button>
</Link>

      </div>

      {/* KPI Cards */}
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

      {/* Table */}
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
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.name}</td>
                <td>{student.consecutiveLowScores}</td>
                <td>{student.lastScore}%</td>
                <td>
                  <span className={`risk-badge ${student.consecutiveLowScores >= 3 ? "high" : "medium"}`}>
                    {student.consecutiveLowScores >= 3 ? "High" : "Medium"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default LowScoreDetails;