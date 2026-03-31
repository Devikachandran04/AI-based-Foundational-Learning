import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

  if (loading) return <p className="loading">Loading profile...</p>;

  if (!student)
    return (
      <div className="profile-page">
        <h2>Student not found</h2>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    );

  return (
    <div className="profile-page">

      {/* HEADER */}
      <div className="profile-header">
        <h1>🎓 Learner Profile</h1>
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="profile-grid">

        {/* LEFT CARD */}
        <div className="profile-card">
          <h3>Student Info</h3>

          <div className="row"><span>Name</span><span>{student.name}</span></div>
          <div className="row"><span>Class</span><span>{student.class}</span></div>
          <div className="row"><span>Email</span><span>{student.email}</span></div>

          <div className="row">
            <span>Total Lessons</span>
            <span>{student.lessons_completed}</span>
          </div>
        </div>

        {/* ATTEMPTS CARD */}
        <div className="profile-card">
          <h3>Successful Attempts</h3>

          <div className="row"><span>Basic</span><b>{student.basic_questions_attempted}</b></div>
          <div className="row"><span>Medium</span><b>{student.intermediate_questions_attempted}</b></div>
          <div className="row"><span>Advanced</span><b>{student.advanced_questions_attempted}</b></div>
        </div>

        {/* LESSON COMPLETED */}
        <div className="profile-card full-width">
          <h3>Lessons Completed</h3>

          {student.completed_lessons_details?.length > 0 ? (
            <div className="lesson-list">
              {student.completed_lessons_details.map((lesson, i) => (
                <div key={i} className="lesson-item">
                  <span>{lesson.lesson_title}</span>

                  <span
                    className={`badge ${
                      lesson.quiz_type === "mixed"
                        ? "main"
                        : "simple"
                    }`}
                  >
                    {lesson.quiz_label}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>No lessons completed</p>
          )}
        </div>

        {/* WEAK TOPICS */}
        <div className="profile-card full-width">
          <h3>Weak Topics</h3>

          {student.weak_topics && Object.keys(student.weak_topics).length > 0 ? (
            <div className="weak-list">
              {Object.keys(student.weak_topics).map((topic, i) => (
                <span key={i} className="weak-tag">{topic}</span>
              ))}
            </div>
          ) : (
            <p>No weak topics</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default LearnerProfile;