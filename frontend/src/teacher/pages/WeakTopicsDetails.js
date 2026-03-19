import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

function WeakTopicsDetails() {

  const [showStudents, setShowStudents] = useState(false);
  const [topicStudents, setTopicStudents] = useState([]);
  const [topicName, setTopicName] = useState("");

  const weakTopics = [
    { topic: "Fractions", averageScore: 48, riskLevel: "High" },
    { topic: "Grammar", averageScore: 52, riskLevel: "Medium" },
    { topic: "Decimals", averageScore: 61, riskLevel: "Low" },
  ];

  const weakStudents = {
    Fractions: ["Rahul", "Anjali", "Arun"],
    Grammar: ["Meera", "Arjun"],
    Decimals: ["Sneha"]
  };

  const handleViewStudents = (topic) => {
    setTopicStudents(weakStudents[topic]);
    setTopicName(topic);
    setShowStudents(true);
  };

  // Chart data
  const chartData = weakTopics.map(item => ({
    name: item.topic,
    value: item.averageScore
  }));

  const COLORS = ["#e74c3c", "#f39c12", "#2ecc71"];

  return (
    <div className="analytics-page">

      {/* Header */}
      <div className="analytics-header">

        <div className="top-bar">
          <div></div>
          <h1 className="dashboard-heading">📚 Weak Topics Analytics</h1>
        </div>

        <Link to="/dashboard">
          <button className="back-btn">← Back</button>
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

      {/* Pie Chart */}
      <div style={{ width: "100%", height: 300, marginTop: "30px" }}>
        <ResponsiveContainer>

          <PieChart>

            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label
              outerRadius={110}
              dataKey="value"
            >

              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}

            </Pie>

            <Tooltip />
            <Legend />

          </PieChart>

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
                  <button
                    className="small-btn"
                    onClick={() => handleViewStudents(item.topic)}
                  >
                    View Students
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Student Mini Box */}
      {showStudents && (
        <div className="student-popup">

          <h4>Weak in {topicName}</h4>

          <ul>
            {topicStudents.map((student, index) => (
              <li key={index}>{student}</li>
            ))}
          </ul>

          <button
            className="small-btn"
            onClick={() => setShowStudents(false)}
          >
            Close
          </button>

        </div>
      )}

    </div>
  );
}

export default WeakTopicsDetails;