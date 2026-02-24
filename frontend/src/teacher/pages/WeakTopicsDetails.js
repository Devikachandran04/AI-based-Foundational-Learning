import React from "react";
import { Link } from "react-router-dom";

function WeakTopicsDetails() {

  const weakTopics = [
    { topic: "Fractions", averageScore: 48, riskLevel: "High" },
    { topic: "Grammar", averageScore: 52, riskLevel: "Medium" },
    { topic: "Decimals", averageScore: 61, riskLevel: "Low" },
  ];

  return (
    <div className="analytics-page">

      {/* Header */}
      <div className="analytics-header">
        <h2>📚 Weak Topics Analytics</h2>
        <Link to="/" className="back-link">← Back to Dashboard</Link>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h4>Total Weak Topics</h4>
          <p>{weakTopics.length}</p>
        </div>

        <div className="kpi-card">
          <h4>High Risk Topics</h4>
          <p>{weakTopics.filter(t => t.riskLevel === "High").length}</p>
        </div>

        <div className="kpi-card">
          <h4>Average Performance</h4>
          <p>
            {Math.round(
              weakTopics.reduce((acc, t) => acc + t.averageScore, 0) /
              weakTopics.length
            )}%
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Topic</th>
              <th>Average Score</th>
              <th>Risk Level</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {weakTopics.map((item, index) => (
              <tr key={index}>
                <td>{item.topic}</td>
                <td>{item.averageScore}%</td>
                <td>
                  <span className={`risk-badge ${item.riskLevel.toLowerCase()}`}>
                    {item.riskLevel}
                  </span>
                </td>
                <td>
                  <button className="small-btn">View Students</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default WeakTopicsDetails;