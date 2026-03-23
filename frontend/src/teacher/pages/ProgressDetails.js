import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

function ProgressDetails() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/teacher/dashboard/student-progress")
      .then((res) => {
        setStudents(res.data?.students || []);
      })
      .catch((err) => console.error("Error fetching progress data:", err));
  }, []);

  const scores = students.map((s) => s.avg_score || 0);

  const totalStudents = students.length;
  const averageScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  const highestScore = scores.length ? Math.max(...scores) : 0;
  const lowestScore = scores.length ? Math.min(...scores) : 0;

  const scoreChart = [
    { name: "Average", score: averageScore },
    { name: "Highest", score: highestScore },
    { name: "Lowest", score: lowestScore },
  ];

  const colors = ["#3b82f6", "#27ae60", "#e74c3c"];

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div className="top-bar">
          <div></div>
          <h1 className="dashboard-heading">📊 Student Progress Analytics</h1>
        </div>

        <Link to="/dashboard">
          <button className="back-btn">← Back</button>
        </Link>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <h4>👨‍🎓 Total Students</h4>
          <p>{totalStudents}</p>
        </div>

        <div className="kpi-card average-card">
          <h4>📈 Average Score</h4>
          <p>{averageScore}%</p>
        </div>

        <div className="kpi-card highest-card">
          <h4>🏆 Highest Score</h4>
          <p>{highestScore}%</p>
        </div>

        <div className="kpi-card lowest-card">
          <h4>⚠️ Lowest Score</h4>
          <p>{lowestScore}%</p>
        </div>
      </div>

      <div style={{ width: "70%", height: 280, margin: "30px auto" }}>
        <ResponsiveContainer>
          <BarChart data={scoreChart} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              tick={{ fill: "#ffffff", fontSize: 14 }}
            />

            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: "#ffffff", fontSize: 14 }}
            />

            <Tooltip />

            <Bar dataKey="score" radius={[10, 10, 0, 0]} barSize={80}>
              {scoreChart.map((entry, index) => (
                <Cell key={index} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="table-container">
        <h3>📌 Performance Insights</h3>

        <ul>
          <li>
            Highest score achieved by a student is <b>{highestScore}%</b>.
          </li>

          <li>
            Lowest recorded score is <b>{lowestScore}%</b>.
          </li>

          <li>
            The overall class average performance is <b>{averageScore}%</b>.
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