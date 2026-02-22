import React from "react";
import ProgressSummary from "../components/ProgressSummary";
import WeakTopics from "../components/WeakTopics";
import LowScoreStudents from "../components/LowScoreStudents";
import HelpModule from "../components/HelpModule";

function TeacherDashboard() {

  const dummyData = {
    total_students: 120,
    average_score: 72,
    weak_topics: ["Fractions", "Grammar"],
    low_score_students: ["Student A", "Student B"],
    help_requests: []
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Teacher Dashboard</h1>

      <div className="dashboard-grid">
        <ProgressSummary data={dummyData} />
        <WeakTopics data={dummyData} />
        <LowScoreStudents data={dummyData} />
        <HelpModule data={dummyData} />
      </div>
    </div>
  );
}

export default TeacherDashboard;