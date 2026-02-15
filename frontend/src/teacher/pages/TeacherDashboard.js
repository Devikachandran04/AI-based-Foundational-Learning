import React, { useEffect, useState } from "react";
import ProgressSummary from "../components/ProgressSummary";
import WeakTopics from "../components/WeakTopics";
import LowScoreStudents from "../components/LowScoreStudents";
import HelpModule from "../components/HelpModule";

function TeacherDashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/teacher-dashboard")
      .then((response) => response.json())
      .then((data) => setDashboardData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (!dashboardData) {
    return <h2 style={{ padding: "40px" }}>Loading Dashboard...</h2>;
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Teacher Dashboard</h1>

      <div className="dashboard-grid">
        <ProgressSummary data={dashboardData} />
        <WeakTopics data={dashboardData} />
        <LowScoreStudents data={dashboardData} />
        <HelpModule data={dashboardData} />
      </div>
    </div>
  );
}

export default TeacherDashboard;
