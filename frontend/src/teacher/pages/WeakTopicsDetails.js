import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function WeakTopicsDetails() {

  const weakTopics = [
    { topic: "Fractions", averageScore: 48, riskLevel: "High" },
    { topic: "Grammar", averageScore: 52, riskLevel: "Medium" },
    { topic: "Decimals", averageScore: 61, riskLevel: "Low" },
  ];

  // Chart data derived from existing data
  const chartData = weakTopics.map(item => ({
    topic: item.topic,
    score: item.averageScore
  }));

  return (
    <div className="analytics-page">

      {/* Header */}
      <div className="analytics-header">
        <h2>📚 Weak Topics Analytics</h2>
        <Link to="/">
          <button className="back-btn">Back</button>
        </Link>
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

      {/* Chart */}
      <div style={{ width: "100%", height: 300, marginTop: "30px" }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="topic" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
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