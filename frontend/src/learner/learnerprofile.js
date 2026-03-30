import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GraduationCap, ChevronLeft } from "lucide-react";
import "./learnerprofile.css";

function LearnerProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const studentId = location.state?.studentId || null;

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        let url =
          "https://ai-based-foundational-learning-production.up.railway.app/api/student/profile";

        if (studentId) {
          url += `?id=${studentId}`;
        }

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [studentId]);

  if (loading) {
    return (
      <div className="profile-page">
        <p className="profile-loading">Loading profile...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="profile-page">
        <div className="profile-shell">
          <div className="profile-box">
            <h1 className="profile-title">Student not found</h1>
            <div className="profile-actions">
              <button className="close-btn" onClick={() => navigate(-1)}>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* top bar */}
      <header className="profile-topbar">
        <div className="profile-topbar-left">
          <button className="circle-back-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
          </button>

          <div className="brand-box">
            <div className="brand-icon">
              <GraduationCap size={18} />
            </div>
            <h2 className="brand-name">GrammarPal</h2>
          </div>

          <button className="dashboard-btn" onClick={() => navigate("/dashboard")}>
            BACK TO DASHBOARD
          </button>
        </div>
      </header>

      {/* main content */}
      <div className="profile-shell">
        <div className="profile-box">
          <h1 className="profile-title">Learner Profile</h1>

          <div className="profile-grid">
            {/* Student Info */}
            <div className="profile-card">
              <h3 className="section-title">Student Info</h3>

              <div className="info-row">
                <span>Name</span>
                <span>{student.name || student.student_name || "Unnamed Student"}</span>
              </div>

              <div className="info-row">
                <span>Class</span>
                <span>{student.class || "-"}</span>
              </div>

              <div className="info-row">
                <span>Email</span>
                <span>{student.email || "student@test.com"}</span>
              </div>

              <div className="info-row">
                <span>Lessons Completed</span>
                <span>{student.lessons_completed || 0}</span>
              </div>
            </div>

            {/* Attempts */}
            <div className="profile-card">
              <h3 className="section-title">Attempts</h3>

              <div className="attempt-row">
                <span>Basic</span>
                <strong>{student.basic_questions_attempted || 0}</strong>
              </div>

              <div className="attempt-row">
                <span>Medium</span>
                <strong>{student.intermediate_questions_attempted || 0}</strong>
              </div>

              <div className="attempt-row">
                <span>Advanced</span>
                <strong>{student.advanced_questions_attempted || 0}</strong>
              </div>
            </div>

            {/* Weak Topics */}
            <div className="profile-card weak-card">
              <h3 className="section-title">Weak Topics</h3>

              {student.weak_topics && Object.keys(student.weak_topics).length > 0 ? (
                <ul className="weak-topic-list">
                  {Object.keys(student.weak_topics).map((topic, i) => (
                    <li key={i} className="weak-topic-item">
                      {topic}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-weak-topics">No weak topics</p>
              )}
            </div>
          </div>

          <div className="profile-actions">
            <button className="close-btn" onClick={() => navigate(-1)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearnerProfile;