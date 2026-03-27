import React from "react";
import "./learnerprofile.css";
import { useNavigate, useLocation } from "react-router-dom";

function LearnerProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get student data from Link state
  const student = location.state?.student;

  if (!student) {
    return (
      <div className="profile-page">
        <div className="profile-box">
          <h1 className="profile-title">No student selected</h1>
          <div className="profile-actions">
            <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-box">
        <h1 className="profile-title">Learner Profile</h1>

        <div className="profile-grid">

          {/* LEFT CARD */}
          <div className="profile-card">
            <div className="section-title">Student Info</div>
            <div className="profile-row">
              <span>Name</span>
              <span>{student.name || student.student_name || "Unnamed Student"}</span>
            </div>
            <div className="profile-row">
              <span>Class</span>
              <span>{student.class || student.student_class || "-"}</span>
            </div>
            <div className="profile-row">
              <span>Lessons</span>
              <span>{student.lessonsCompleted || student.lessons_completed || 0}</span>
            </div>
            <div className="profile-row">
              <span>Average Score</span>
              <span>{student.averageScore || student.avg_score || 0}%</span>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="profile-card">
            <div className="section-title">Attempts</div>
            <div className="profile-row">
              <span>Total Attempts</span>
              <span>{student.attempts || student.total_attempts || 0}</span>
            </div>
            <div className="profile-row">
              <span>Failures</span>
              <span>{student.repeatedFailures || student.failures || 0}</span>
            </div>

            <div className="stats">
              <div className="stat-box">
                <span>Basic</span>
                <strong>{student.basicQuestions || student.basic_questions || 0}</strong>
              </div>
              <div className="stat-box">
                <span>Medium</span>
                <strong>{student.mediumQuestions || student.medium_questions || 0}</strong>
              </div>
              <div className="stat-box">
                <span>Hard</span>
                <strong>{student.hardQuestions || student.hard_questions || 0}</strong>
              </div>
            </div>
          </div>

          {/* WEAK TOPICS */}
          <div className="profile-card weak-section" style={{ gridColumn: "span 2" }}>
            <div className="section-title">Weak Topics</div>
            <ul>
              {student.weakTopics && student.weakTopics.length > 0
                ? student.weakTopics.map((topic, index) => <li key={index}>{topic}</li>)
                : <li>No weak topics</li>}
            </ul>
          </div>

        </div>

        {/* CLOSE BUTTON */}
        <div className="profile-actions">
          <button className="back-btn" onClick={() => navigate(-1)}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default LearnerProfile;