import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function LowScoreDetails() {
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
          "https://ai-based-foundational-learning-production.up.railway.app/api/teacher/dashboard/low-score-students",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setStudents(res.data?.students || []);
      } catch (err) {
        console.error("Error fetching low score students:", err);
      }
    };

    fetchData();
  }, [token]);

  const highRisk = students.filter((s) => (s.consecutive_low || 0) >= 3).length;
  const mediumRisk = students.filter((s) => (s.consecutive_low || 0) === 2).length;

  const getRiskLevel = (count) => {
    if (count >= 3) return "High";
    if (count === 2) return "Medium";
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
          <h1 className="dashboard-heading">Support Cases</h1>
          <p className="dashboard-subheading">
            Monitor repeated low scores and open learner profiles for follow-up.
          </p>
        </div>
      </div>

      <div className="quick-nav">
        <Link to="/dashboard" className="quick-link">Overview</Link>
        <Link to="/progress" className="quick-link">Student Insights</Link>
        <Link to="/weak-topics" className="quick-link">Lesson Analytics</Link>
        <Link to="/low-scores" className="quick-link active">Support Cases</Link>
        <Link to="/help-requests" className="quick-link">Help Requests</Link>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <h4>Total At-Risk Students</h4>
          <p>{students.length}</p>
        </div>

        <div className="kpi-card lowest-card">
          <h4>High Risk Students</h4>
          <p>{highRisk}</p>
        </div>

        <div className="kpi-card">
          <h4>Medium Risk Students</h4>
          <p>{mediumRisk}</p>
        </div>
      </div>

      <div className="table-container">
        <h3>Student Risk Overview</h3>
        <div className="table-scroll">
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
              {students.length > 0 ? (
                students.map((s, i) => {
                  const consecutive = s.consecutive_low || 0;
                  const lastScore = s.last_score || 0;
                  const riskLevel = getRiskLevel(consecutive);
                  const studentId = s.user_id || null;

                  return (
                    <tr key={studentId || i}>
                      <td>
                        {studentId ? (
                          <Link
                            to="/learner-profile"
                            state={{ studentId }}
                            className="table-link"
                          >
                            {s.name || "Unnamed Student"}
                          </Link>
                        ) : (
                          <span>{s.name || "Unnamed Student"}</span>
                        )}
                      </td>
                      <td>{consecutive}</td>
                      <td>{lastScore}%</td>
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
                  <td colSpan="4">No at-risk students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LowScoreDetails;