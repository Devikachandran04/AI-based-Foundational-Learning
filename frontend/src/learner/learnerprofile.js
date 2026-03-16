import React from "react";
import "./learnerprofile.css";

function LearnerProfile() {

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

        <div className="profile-row">
          <span>Student Name</span>
          <span>{student.name}</span>
        </div>

        <div className="profile-row">
          <span>Class</span>
          <span>{student.class}</span>
        </div>

        <div className="profile-row">
          <span>Lessons Completed</span>
          <span>{student.lessonsCompleted}</span>
        </div>

        <div className="profile-row">
          <span>Basic Questions Attempted</span>
          <span>{student.basicQuestions}</span>
        </div>

        <div className="profile-row">
          <span>Medium Questions Attempted</span>
          <span>{student.mediumQuestions}</span>
        </div>

        <div className="profile-row">
          <span>Hard Questions Attempted</span>
          <span>{student.hardQuestions}</span>
        </div>

        <div className="profile-row">
          <span>Number of Attempts</span>
          <span>{student.attempts}</span>
        </div>

        <div className="profile-row">
          <span>Repeated Failures</span>
          <span>{student.repeatedFailures}</span>
        </div>

        <div className="profile-row">
          <span>Average Score</span>
          <span>{student.averageScore}%</span>
        </div>

        <div className="weak-section">
          <h3>Weak Topics</h3>
          <ul>
            {student.weakTopics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
}

export default LearnerProfile;