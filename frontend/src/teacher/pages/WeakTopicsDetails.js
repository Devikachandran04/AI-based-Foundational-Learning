import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

function WeakTopicsDetails() {
  const [showStudents, setShowStudents] = useState(false);
  const [topicStudents, setTopicStudents] = useState([]);
  const [topicName, setTopicName] = useState("");
  const [weakTopics, setWeakTopics] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/teacher/dashboard/weak-topics", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWeakTopics(res.data?.weak_topics || []);
      } catch (err) {
        console.error("Error fetching weak topics:", err);
      }
    };
    fetchData();
  }, [token]);

  const handleViewStudents = (topicItem) => {
    setTopicName(topicItem.topic || "Topic");
    setTopicStudents(Array.isArray(topicItem.students) ? topicItem.students : []);
    setShowStudents(true);
  };

  const chartData = weakTopics.map(item => ({ name: item.topic, value: item.avg_score || 0 }));
  const COLORS = ["#e74c3c","#f39c12","#2ecc71","#3498db","#9b59b6"];
  const highRiskCount = weakTopics.filter(t => (t.avg_score || 0) < 50).length;
  const avgPerformance = weakTopics.length ? Math.round(weakTopics.reduce((acc,t)=>acc+(t.avg_score||0),0)/weakTopics.length) : 0;

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div className="top-bar"><h1 className="dashboard-heading">📚 Weak Topics Analytics</h1></div>
        <Link to="/dashboard"><button className="back-btn">← Back</button></Link>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card"><h4>Total Weak Topics</h4><p>{weakTopics.length}</p></div>
        <div className="kpi-card"><h4>High Risk Topics</h4><p>{highRiskCount}</p></div>
        <div className="kpi-card"><h4>Average Performance</h4><p>{avgPerformance}%</p></div>
      </div>

      <div style={{ width: "100%", height: 300, marginTop: "30px" }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label outerRadius={110} dataKey="value">
              {chartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>Topic</th><th>Average Score</th><th>Risk Level</th><th>Action</th></tr></thead>
          <tbody>
            {weakTopics.length > 0 ? weakTopics.map((item,i)=>{
              const score = item.avg_score || 0;
              const riskLevel = score <50?"High":score<65?"Medium":"Low";
              return (
                <tr key={item.id || i}>
                  <td>{item.topic}</td>
                  <td>{score}%</td>
                  <td><span className={`risk-badge ${riskLevel.toLowerCase()}`}>{riskLevel}</span></td>
                  <td><button className="small-btn" onClick={()=>handleViewStudents(item)}>View Students</button></td>
                </tr>
              );
            }) : <tr><td colSpan="4">No weak topics found.</td></tr>}
          </tbody>
        </table>
      </div>

      {showStudents && (
        <div className="student-popup">
          <h4>Weak in {topicName}</h4>
          {topicStudents.length>0 ? <ul>{topicStudents.map((s,i)=><li key={i}>{s.name||s.student_name||s}</li>)}</ul> : <p>No student list available.</p>}
          <button className="small-btn" onClick={()=>setShowStudents(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default WeakTopicsDetails;