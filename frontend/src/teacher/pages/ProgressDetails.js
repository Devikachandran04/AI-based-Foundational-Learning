import React from "react";
import { Link } from "react-router-dom";

function ProgressDetails() {

  const summary = {
    totalStudents: 120,
    averageScore: 72,
    highestScore: 95,
    lowestScore: 38,
  };

  return (
    <div className="analytics-page">

      <div className="analytics-header">
        <h2>📊 Student Progress Analytics</h2>
        <Link to="/" className="back-link">← Back to Dashboard</Link>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h4>Total Students</h4>
          <p>{summary.totalStudents}</p>
        </div>

        <div className="kpi-card">
          <h4>Average Score</h4>
          <p>{summary.averageScore}%</p>
        </div>

        <div className="kpi-card">
          <h4>Highest Score</h4>
          <p>{summary.highestScore}%</p>
        </div>

        <div className="kpi-card">
          <h4>Lowest Score</h4>
          <p>{summary.lowestScore}%</p>
        </div>
      </div>

      {/* Insights Section */}
      <div className="table-container">
        <h3>Performance Insights</h3>
        <ul>
          <li>Majority of students scoring between 60% - 80%</li>
          <li>5 students below 40%</li>
          <li>Improvement trend observed in last 2 assessments</li>
        </ul>
      </div>

    </div>
  );
}

export default ProgressDetails;