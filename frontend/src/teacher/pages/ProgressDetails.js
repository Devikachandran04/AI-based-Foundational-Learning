import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell
} from "recharts";

function ProgressDetails() {

  const summary = {
    totalStudents: 120,
    averageScore: 72,
    highestScore: 95,
    lowestScore: 38,
  };

  const scoreChart = [
    { name: "Average", score: summary.averageScore },
    { name: "Highest", score: summary.highestScore },
    { name: "Lowest", score: summary.lowestScore },
  ];

  const colors = [
    "#3b82f6", // average - blue
    "#27ae60", // highest - green
    "#e74c3c"  // lowest - red
  ];

  return (
    <div className="analytics-page">

      {/* Header */}
      <div className="analytics-header">

        <div className="top-bar">
          <div></div>
          <h1 className="dashboard-heading">📊 Student Progress Analytics</h1>
        </div>

        <Link to="/dashboard">
          <button className="back-btn">Back</button>
        </Link>

      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">

        <div className="kpi-card">
          <h4>👨‍🎓 Total Students</h4>
          <p>{summary.totalStudents}</p>
        </div>

        <div className="kpi-card average-card">
          <h4>📈 Average Score</h4>
          <p>{summary.averageScore}%</p>
        </div>

        <div className="kpi-card highest-card">
          <h4>🏆 Highest Score</h4>
          <p>{summary.highestScore}%</p>
        </div>

        <div className="kpi-card lowest-card">
          <h4>⚠️ Lowest Score</h4>
          <p>{summary.lowestScore}%</p>
        </div>

      </div>

      {/* Chart */}
      <div style={{ width: "70%", height: 280, margin: "30px auto" }}>
        <ResponsiveContainer>

          <BarChart
            data={scoreChart}
            barCategoryGap="30%"
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis 
              dataKey="name"
              tick={{ fill: "#ffffff", fontSize: 14 }}
            />

            <YAxis
              domain={[0,100]}
              tickFormatter={(value)=>`${value}%`}
              tick={{ fill: "#ffffff", fontSize: 14 }}
            />

            <Tooltip />

            <Bar
              dataKey="score"
              radius={[10,10,0,0]}
              barSize={80}
            >

              {scoreChart.map((entry, index) => (
                <Cell key={index} fill={colors[index]} />
              ))}

            </Bar>

          </BarChart>

        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="table-container">

        <h3>📌 Performance Insights</h3>

        <ul>

          <li>
            Highest score achieved by a student is <b>{summary.highestScore}%</b>.
          </li>

          <li>
            Lowest recorded score is <b>{summary.lowestScore}%</b>.
          </li>

          <li>
            The overall class average performance is <b>{summary.averageScore}%</b>.
          </li>

          <li>
            This indicates the class performance is <b>moderately strong</b>.
          </li>

        </ul>

      </div>

    </div>
    
  );
}

export default ProgressDetails;