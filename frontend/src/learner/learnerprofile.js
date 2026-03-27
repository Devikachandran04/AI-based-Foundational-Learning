import React, { useEffect, useState } from "react";
import "./learnerprofile.css";
import { useNavigate } from "react-router-dom";

function LearnerProfile() {
  const navigate = useNavigate();
const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://ai-based-foundational-learning-production.up.railway.app/api/student/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setStudent(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []);

  if (loading) return <p>Loading profile...</p>;

  if (!student)
    return (
      <div className="profile-page">
        <div className="profile-box">
          <h1 className="profile-title">Student not found</h1>
          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    );

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
              <span>{student.class || "-"}</span>
            </div>
            <div className="profile-row">
              <span>Lessons</span>
              <span>{student.lessons_completed || 0}</span>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="profile-card">
            <div className="section-title">Attempts</div>
            <div className="profile-row">
              <span>Basic</span>
              <strong>{student.basic_questions_attempted || 0}</strong>
            </div>
            <div className="profile-row">
              <span>Medium</span>
              <strong>{student.intermediate_questions_attempted || 0}</strong>
            </div>
            <div className="profile-row">
              <span>Hard</span>
              <strong>{student.advanced_questions_attempted || 0}</strong>
            </div>
          </div>

          {/* WEAK TOPICS */}
          <div
            className="profile-card weak-section"
            style={{ gridColumn: "span 2" }}
          >
            <div className="section-title">Weak Topics</div>
            <ul>
              {student.weak_topics &&
              Object.keys(student.weak_topics).length > 0 ? (
                Object.keys(student.weak_topics).map((topic, i) => (
                  <li key={i}>{topic}</li>
                ))
              ) : (
                <li>No weak topics</li>
              )}
            </ul>
          </div>
        </div>

        <div className="profile-actions">
          <button className="back-btn" onClick={() => navigate(-1)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default LearnerProfile;