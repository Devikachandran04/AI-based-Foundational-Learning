import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

function WeakTopicsDetails() {
  const [weakTopics, setWeakTopics] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let t = urlParams.get("token");

    if (t) {
      localStorage.setItem("token", t);
      localStorage.setItem("teacher_token", t);
    } else {
      t = localStorage.getItem("teacher_token") || localStorage.getItem("token");
    }

    setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://ai-based-foundational-learning-production.up.railway.app/api/teacher/dashboard/weak-topics",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWeakTopics(res.data?.weak_topics || []);
      } catch (err) {
        console.error("Error fetching weak topics:", err);
      }
    };

    fetchData();
  }, [token]);

  const chartData = weakTopics.map((item) => ({
    name: item.topic,
    value: item.avg_score || 0,
  }));

  const highRiskCount = weakTopics.filter((t) => (t.avg_score || 0) < 50).length;
  const avgPerformance = weakTopics.length
    ? Math.round(
        weakTopics.reduce((acc, t) => acc + (t.avg_score || 0), 0) / weakTopics.length
      )
    : 0;

  const barColors = ["#e74c3c", "#f39c12", "#2ecc71", "#3498db", "#9b59b6", "#16a085"];

  const getRiskLevel = (score) => {
    if (score < 50) return "High";
    if (score < 65) return "Medium";
    return "Low";
  };

  return (
    <div className="analytics-page">
      <div className="top-navbar">
        <div className="logo-section">
          <h2 className="logo-text">GrammarPal</h2>
          <p className="logo-subtitle">Admin Panel</p>
        </div>

        <Link to="/dashboard">
          <button className="back-btn">Back</button>
        </Link>
      </div>

      <div className="top-bar">
        <div>
          <h1 className="dashboard-heading">Lesson Analytics</h1>
          <p className="dashboard-subheading">
            Understand which grammar lessons are producing the lowest scores.
          </p>
        </div>
      </div>

      <div className="quick-nav">
        <Link to="/dashboard" className="quick-link">Overview</Link>
        <Link to="/progress" className="quick-link">Student Insights</Link>
        <Link to="/weak-topics" className="quick-link active">Lesson Analytics</Link>
        <Link to="/low-scores" className="quick-link">Support Cases</Link>
        <Link to="/help-requests" className="quick-link">Help Requests</Link>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <h4>Total Weak Lessons</h4>
          <p>{weakTopics.length}</p>
        </div>

        <div className="kpi-card lowest-card">
          <h4>High Risk Lessons</h4>
          <p>{highRiskCount}</p>
        </div>

        <div className="kpi-card average-card">
          <h4>Average Lesson Score</h4>
          <p>{avgPerformance}%</p>
        </div>
      </div>

      <div className="chart-panel">
        <h3>Weak Lesson Distribution</h3>
        <div className="chart-area">
          <ResponsiveContainer>
            <BarChart data={chartData} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={70}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-container">
        <h3>Lesson Risk Overview</h3>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Lesson / Topic</th>
                <th>Average Score</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {weakTopics.length > 0 ? (
                weakTopics.map((item, i) => {
                  const score = item.avg_score || 0;
                  const riskLevel = getRiskLevel(score);

                  return (
                    <tr key={item.id || i}>
                      <td>{item.topic}</td>
                      <td>{score}%</td>
                      <td>
                        <span className={`risk-badge ${riskLevel.toLowerCase()}`}>
                          {riskLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3">No lesson analytics found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default WeakTopicsDetails;