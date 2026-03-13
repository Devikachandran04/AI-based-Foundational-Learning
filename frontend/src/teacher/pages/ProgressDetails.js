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

function ProgressDetails() {

  const summary = {
    totalStudents: 120,
    averageScore: 72,
    highestScore: 95,
    lowestScore: 38,
  };

  // Distribution data for chart
  const scoreDistribution = [
    { range: "0-40", students: 5 },
    { range: "40-60", students: 25 },
    { range: "60-80", students: 60 },
    { range: "80-100", students: 30 },
  ];

  return (
    <div className="analytics-page">

      <div className="analytics-header">
        <div className="top-bar">
        <div></div>  {/* empty space for alignment */}

        <h1 className="dashboard-heading">📊 Student Progress Analytics</h1>

      </div>
        
        <Link to="/">
          <button className="back-btn">Back</button>
        </Link>
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

      {/* Chart */}
      <div style={{ width: "100%", height: 300, marginTop: "30px" }}>
        <ResponsiveContainer>
          <BarChart data={scoreDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="students" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
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