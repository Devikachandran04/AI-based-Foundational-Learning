import React from "react";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TeacherDashboard from "./teacher/pages/TeacherDashboard";
import ProgressDetails from "./teacher/pages/ProgressDetails";
import WeakTopicsDetails from "./teacher/pages/WeakTopicsDetails";
import LowScoreDetails from "./teacher/pages/LowScoreDetails";
import HelpRequestsDetails from "./teacher/pages/HelpRequestsDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TeacherDashboard />} />
        <Route path="/progress" element={<ProgressDetails />} />
        <Route path="/weak-topics" element={<WeakTopicsDetails />} />
        <Route path="/low-scores" element={<LowScoreDetails />} />
        <Route path="/help-requests" element={<HelpRequestsDetails />} />
      </Routes>
    </Router>
  );
}

export default App;