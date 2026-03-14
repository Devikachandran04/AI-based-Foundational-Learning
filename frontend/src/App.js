import React from "react";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import TeacherDashboard from "./teacher/pages/TeacherDashboard";
import ProgressDetails from "./teacher/pages/ProgressDetails";
import WeakTopicsDetails from "./teacher/pages/WeakTopicsDetails";
import LowScoreDetails from "./teacher/pages/LowScoreDetails";
import HelpRequestsDetails from "./teacher/pages/HelpRequestsDetails";
import AdminLogin from "./teacher/pages/AdminLogin";

import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<AdminLogin />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <ProgressDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/weak-topics"
          element={
            <ProtectedRoute>
              <WeakTopicsDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/low-scores"
          element={
            <ProtectedRoute>
              <LowScoreDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/help-requests"
          element={
            <ProtectedRoute>
              <HelpRequestsDetails />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;