import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import TeacherDashboard from "./teacher/pages/TeacherDashboard";
import ProgressDetails from "./teacher/pages/ProgressDetails";
import WeakTopicsDetails from "./teacher/pages/WeakTopicsDetails";
import LowScoreDetails from "./teacher/pages/LowScoreDetails";
import HelpRequestsDetails from "./teacher/pages/HelpRequestsDetails";
import LearnerProfile from "./learner/learnerprofile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<TeacherDashboard />} />
        <Route path="/progress" element={<ProgressDetails />} />
        <Route path="/weak-topics" element={<WeakTopicsDetails />} />
        <Route path="/low-scores" element={<LowScoreDetails />} />
        <Route path="/help-requests" element={<HelpRequestsDetails />} />
        <Route path="/learner-profile" element={<LearnerProfile />} />
      </Routes>
    </Router>
  );
}

export default App;