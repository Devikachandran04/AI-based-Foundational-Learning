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
    } else {
      t = localStorage.getItem("token");
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

  // Get latest attempt score for each student
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

  const colors = ["#3b82f6", "#27ae60", "#e74c3c"];

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div className="top-bar">
          <div></div>
          <h1 className="dashboard-heading">📊 Student Progress Analytics</h1>
        </div>

        <Link to="/dashboard">
          <button className="back-btn">Back</button>
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

      {/* Chart */}
      <div style={{ width: "70%", height: 280, margin: "30px auto" }}>
        <ResponsiveContainer>
          <BarChart data={scoreChart} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: "#ffffff", fontSize: 14 }} />
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

      {/* Table */}
      <div className="table-container">
        <h3>📌 Student Scores</h3>
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

                const riskLevel =
                  averageStudentScore < 50
                    ? "High"
                    : averageStudentScore < 65
                    ? "Medium"
                    : "Low";

                return (
                  <tr key={s.user_id || index}>
                    <td>
                      {s.user_id ? (
                        <Link
                          to="/learner-profile"
                          state={{ studentId: s.user_id }}
                          style={{
                            textDecoration: "none",
                            color: "#2563eb",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
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
  );
}

export default ProgressDetails;