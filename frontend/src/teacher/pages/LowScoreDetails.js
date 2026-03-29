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

  const highRisk = students.filter(
    (s) => (s.consecutive_low || 0) >= 3
  ).length;

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div className="top-bar">
          <h1 className="dashboard-heading">📉 Low Score Students Analytics</h1>
        </div>

        <Link to="/dashboard">
          <button className="back-btn">← Back</button>
        </Link>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <h4>Total Low Score Students</h4>
          <p>{students.length}</p>
        </div>

        <div className="kpi-card">
          <h4>High Risk Students</h4>
          <p>{highRisk}</p>
        </div>
      </div>

      <div className="table-container">
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
                const riskLevel =
                  consecutive >= 3 ? "High" : consecutive === 2 ? "Medium" : "Low";

                const studentId = s.user_id || null;

                return (
                  <tr key={studentId || i}>
                    <td>
                      {studentId ? (
                        <Link
                          to="/learner-profile"
                          state={{ studentId }}
                          style={{
                            textDecoration: "none",
                            color: "#2563eb",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
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
                <td colSpan="4">No low score students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LowScoreDetails;