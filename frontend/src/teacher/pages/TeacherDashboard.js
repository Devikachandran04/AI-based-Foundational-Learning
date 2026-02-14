import React from "react";
import ProgressSummary from "../components/ProgressSummary";
import WeakTopics from "../components/WeakTopics";
import LowScoreStudents from "../components/LowScoreStudents";
import HelpModule from "../components/HelpModule";

function TeacherDashboard() {
  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>Teacher Dashboard</h2>

      <ProgressSummary />
      <WeakTopics />
      <LowScoreStudents />
      <HelpModule />
    </div>
  );
}

export default TeacherDashboard;
