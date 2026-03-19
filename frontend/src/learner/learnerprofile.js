import React from "react";
import "./learnerprofile.css";
import { useNavigate } from "react-router-dom";

function LearnerProfile() {

  const navigate = useNavigate();

  const student = {
    name: "Samyuktha S",
    class: "8",
    lessonsCompleted: 5,
    basicQuestions: 20,
    mediumQuestions: 15,
    hardQuestions: 5,
    attempts: 10,
    repeatedFailures: 2,
    averageScore: 72,
    weakTopics: ["Prepositions", "Articles"]
  };

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
              <span>{student.name}</span>
            </div>

            <div className="profile-row">
              <span>Class</span>
              <span>{student.class}</span>
            </div>

            <div className="profile-row">
              <span>Lessons</span>
              <span>{student.lessonsCompleted}</span>
            </div>

            <div className="profile-row">
              <span>Average Score</span>
              <span>{student.averageScore}%</span>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="profile-card">
            <div className="section-title">Attempts</div>

            <div className="profile-row">
              <span>Total Attempts</span>
              <span>{student.attempts}</span>
            </div>

            <div className="profile-row">
              <span>Failures</span>
              <span>{student.repeatedFailures}</span>
            </div>

            <div className="stats">
              <div className="stat-box">
                <span>Basic</span>
                <strong>{student.basicQuestions}</strong>
              </div>

              <div className="stat-box">
                <span>Medium</span>
                <strong>{student.mediumQuestions}</strong>
              </div>

              <div className="stat-box">
                <span>Hard</span>
                <strong>{student.hardQuestions}</strong>
              </div>
            </div>
          </div>

          {/* WEAK TOPICS */}
          <div className="profile-card weak-section" style={{gridColumn: "span 2"}}>
            <div className="section-title">Weak Topics</div>
            <ul>
              {student.weakTopics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </div>

        </div>
        {/* ✅ CLOSE BUTTON */}
        <div className="profile-actions">
        <button 
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          Close
        </button>
      </div>

      </div>

    </div>
  );
}

export default LearnerProfile;