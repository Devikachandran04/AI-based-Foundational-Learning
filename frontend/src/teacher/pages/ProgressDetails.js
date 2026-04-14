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
          "https://ai-based-foundational-learning-production.up.railway.app/api/teacher/dashboard/student-progress",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudents(res.data?.students || []);
      } catch (err) {
        console.error("Error fetching progress data:", err);
      }
    };

    fetchData();
  }, [token]);

  const scores = students.map((s) => {
    if (s.recent_attempts && s.recent_attempts.length > 0) {
      return Number(s.recent_attempts[0].score) || 0;
    }
    return 0;
  });

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

  const colors = ["#3b82f6", "#16a34a", "#dc2626"];

  const supportCount = students.filter((s) => (Number(s.avg_score) || 0) < 50).length;
  const improvingCount = students.filter((s) => (Number(s.avg_score) || 0) >= 65).length;

  let topPerformer = "—";
  let topScore = 0;

  students.forEach((s) => {
    const avg = Number(s.avg_score) || 0;
    if (avg > topScore) {
      topScore = avg;
      topPerformer = s.name || s.student_name || "Unnamed Student";
    }
  });

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
          <h1 className="dashboard-heading">Student Insights</h1>
          <p className="dashboard-subheading">
            Review learner performance, score trends, and risk levels.
          </p>
        </div>
      </div>

      <div className="quick-nav">
        <Link to="/dashboard" className="quick-link">Overview</Link>
        <Link to="/progress" className="quick-link active">Student Insights</Link>
        <Link to="/weak-topics" className="quick-link">Lesson Analytics</Link>
        <Link to="/low-scores" className="quick-link">Support Cases</Link>
        <Link to="/help-requests" className="quick-link">Help Requests</Link>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <h4>Total Students</h4>
          <p>{totalStudents}</p>
        </div>

        <div className="kpi-card average-card">
          <h4>Average Score</h4>
          <p>{averageScore}%</p>
        </div>

        <div className="kpi-card highest-card">
          <h4>Highest Score</h4>
          <p>{highestScore}%</p>
        </div>

        <div className="kpi-card lowest-card">
          <h4>Lowest Score</h4>
          <p>{lowestScore}%</p>
        </div>
      </div>

      <div className="analytics-two-col">
        <div className="chart-panel">
          <h3>Performance Summary</h3>
          <div className="chart-area">
            <ResponsiveContainer>
              <BarChart data={scoreChart} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="score" radius={[10, 10, 0, 0]} barSize={80}>
                  {scoreChart.map((entry, index) => (
                    <Cell key={index} fill={colors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-panel">
          <h3>Class Snapshot</h3>
          <div className="side-stack">
            <div className="side-stat-card">
              <h5>Top Performer</h5>
              <p>{topPerformer}</p>
            </div>
            <div className="side-stat-card">
              <h5>Need Support</h5>
              <p>{supportCount}</p>
            </div>
            <div className="side-stat-card">
              <h5>Improving Students</h5>
              <p>{improvingCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <h3>Student Performance Overview</h3>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Latest Score</th>
                <th>Average Score</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((s, index) => {
                  const latestScore =
                    s.recent_attempts && s.recent_attempts.length > 0
                      ? Number(s.recent_attempts[0].score) || 0
                      : 0;

                  const averageStudentScore = Number(s.avg_score) || 0;
                  const riskLevel = getRiskLevel(averageStudentScore);

                  return (
                    <tr key={s.user_id || index}>
                      <td>
                        {s.user_id ? (
                          <Link
                            to="/learner-profile"
                            state={{ studentId: s.user_id }}
                            className="table-link"
                          >
                            {s.name || s.student_name || "Unnamed Student"}
                          </Link>
                        ) : (
                          <span>{s.name || s.student_name || "Unnamed Student"}</span>
                        )}
                      </td>
                      <td>{latestScore}%</td>
                      <td>{averageStudentScore}%</td>
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
                  <td colSpan="4">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProgressDetails;