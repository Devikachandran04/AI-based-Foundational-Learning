import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  User,
  GraduationCap,
  TriangleAlert,
  TrendingUp,
  Clock3,
  BookOpen,
  MessageCircle,
  BadgeAlert,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
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
        const urlParams = new URLSearchParams(window.location.search);
        let token = urlParams.get("token");

        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("teacher_token", token);
        } else {
          token =
            localStorage.getItem("teacher_token") ||
            localStorage.getItem("token");
        }

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
        console.error("Failed to fetch learner profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [studentId]);

  const weakTopicsList = useMemo(() => {
    if (!student?.weak_topics) return [];
    return Object.keys(student.weak_topics).filter(
      (topic) => student.weak_topics[topic] > 0
    );
  }, [student]);

  const basicAttempts = Number(student?.basic_questions_attempted) || 0;
  const moderateAttempts =
    Number(student?.intermediate_questions_attempted) || 0;
  const advancedAttempts = Number(student?.advanced_questions_attempted) || 0;

  const totalQuestionAttempts = useMemo(() => {
    return basicAttempts + moderateAttempts + advancedAttempts;
  }, [basicAttempts, moderateAttempts, advancedAttempts]);

  const completionPercent = useMemo(() => {
    if (!student) return 0;
    const totalLessons = 6;
    return Math.min(
      100,
      Math.round(((student.lessons_completed || 0) / totalLessons) * 100)
    );
  }, [student]);

  const adaptiveScore = useMemo(() => {
    if (!student) return 0;
    if (totalQuestionAttempts === 0) return 0;

    const weightedScore =
      basicAttempts * 1 + moderateAttempts * 2 + advancedAttempts * 3;

    const maxWeighted = totalQuestionAttempts * 3;
    return Math.round((weightedScore / maxWeighted) * 100);
  }, [
    student,
    totalQuestionAttempts,
    basicAttempts,
    moderateAttempts,
    advancedAttempts,
  ]);

  const performanceLevel = useMemo(() => {
    if (adaptiveScore >= 75) return "Strong";
    if (adaptiveScore >= 45) return "Moderate";
    return "Needs Improvement";
  }, [adaptiveScore]);

  const riskLevel = useMemo(() => {
    if (weakTopicsList.length >= 3) return "High";
    if (weakTopicsList.length >= 1) return "Medium";
    return "Low";
  }, [weakTopicsList]);

  const recommendedAction = useMemo(() => {
    if (riskLevel === "High") {
      return "Review weak topics immediately, monitor learner activity closely, and provide guided support through help chat and revision tasks.";
    }
    if (riskLevel === "Medium") {
      return "Track recent performance, encourage practice in weak topics, and provide extra feedback where needed.";
    }
    return "Learner is progressing well. Continue regular monitoring and encourage completion of remaining lessons.";
  }, [riskLevel]);

  const lessonJourney = useMemo(() => {
    if (!student?.completed_lessons_details) return [];

    return student.completed_lessons_details.map((lesson, index) => ({
      id: index,
      title: lesson.lesson_title || `Lesson ${index + 1}`,
      quizType: lesson.quiz_label || "Completed",
      quizPath: lesson.quiz_type || "mixed",
    }));
  }, [student]);

  const maxAttempts = useMemo(() => {
    return Math.max(basicAttempts, moderateAttempts, advancedAttempts, 1);
  }, [basicAttempts, moderateAttempts, advancedAttempts]);

  const basicWidth = Math.max(
    basicAttempts > 0 ? Math.round((basicAttempts / maxAttempts) * 100) : 0,
    basicAttempts > 0 ? 12 : 0
  );

  const moderateWidth = Math.max(
    moderateAttempts > 0 ? Math.round((moderateAttempts / maxAttempts) * 100) : 0,
    moderateAttempts > 0 ? 12 : 0
  );

  const advancedWidth = Math.max(
    advancedAttempts > 0 ? Math.round((advancedAttempts / maxAttempts) * 100) : 0,
    advancedAttempts > 0 ? 12 : 0
  );

  if (loading) {
    return <p className="loading">Loading profile...</p>;
  }

  if (!student) {
    return (
      <div className="learner-page">
        <div className="empty-state">
          <h2>Student not found</h2>
          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="learner-page">
      <div className="learner-container">
        <div className="hero-card">
          <div className="hero-left">
            <button className="back-link-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
              <span>Back to Student Insights</span>
            </button>

            <p className="hero-label">Admin Learner Profile</p>
            <h1 className="hero-title">{student.name || "Student"}</h1>
            <p className="hero-subtitle">
              A teacher-focused learner view showing profile details, lesson
              progress, weak areas, attempts, and recommended intervention.
            </p>
          </div>

          <div className="hero-actions">
            <Link
              to="/help-requests"
              state={{
                studentId: studentId || student._id || student.user_id || null,
                studentName: student.name || "",
                studentEmail: student.email || "",
              }}
            >
              <button className="primary-btn">
                <MessageCircle size={16} />
                <span>Open Help Chat</span>
              </button>
            </Link>
          </div>
        </div>

        <div className="top-grid">
          <div className="profile-summary-card">
            <div className="profile-summary-main">
              <div className="avatar-box">
                <User size={34} />
              </div>

              <div>
                <h2 className="student-name">{student.name || "Student"}</h2>
                <p className="student-desc">
                  Teacher-facing learner summary for academic monitoring.
                </p>

                <div className="tag-row">
                  <span className={`pill pill-risk ${riskLevel.toLowerCase()}`}>
                    {riskLevel} Risk
                  </span>
                  <span className="pill pill-info">{performanceLevel}</span>
                  <span className="pill pill-light">Profile Active</span>
                </div>
              </div>
            </div>

            <div className="action-box">
              <div className="action-title">
                <BadgeAlert size={16} />
                <span>Recommended Teacher Action</span>
              </div>
              <p>{recommendedAction}</p>
            </div>
          </div>

          <div className="quick-summary-card">
            <div className="section-head">
              <Sparkles size={18} />
              <h3>Quick Summary</h3>
            </div>

            <div className="info-chip">
              <div className="chip-icon"><GraduationCap size={18} /></div>
              <div>
                <p className="chip-label">Class</p>
                <p className="chip-value">{student.class || "—"}</p>
              </div>
            </div>

            <div className="info-chip">
              <div className="chip-icon"><Mail size={18} /></div>
              <div>
                <p className="chip-label">Email</p>
                <p className="chip-value">{student.email || "—"}</p>
              </div>
            </div>

            <div className="info-chip">
              <div className="chip-icon"><Clock3 size={18} /></div>
              <div>
                <p className="chip-label">Status</p>
                <p className="chip-value">Recently Active</p>
              </div>
            </div>

            <div className="info-chip">
              <div className="chip-icon"><MessageCircle size={18} /></div>
              <div>
                <p className="chip-label">Help Chat</p>
                <p className="chip-value">Open from button above</p>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card teal">
            <div>
              <p className="stat-label">Adaptive Score</p>
              <h3>{adaptiveScore}%</h3>
            </div>
            <div className="stat-icon"><TrendingUp size={24} /></div>
          </div>

          <div className="stat-card blue">
            <div>
              <p className="stat-label">Course Completion</p>
              <h3>{completionPercent}%</h3>
            </div>
            <div className="stat-icon"><CheckCircle2 size={24} /></div>
          </div>

          <div className="stat-card green">
            <div>
              <p className="stat-label">Lessons Completed</p>
              <h3>{student.lessons_completed || 0}</h3>
            </div>
            <div className="stat-icon"><BookOpen size={24} /></div>
          </div>

          <div className="stat-card red">
            <div>
              <p className="stat-label">Weak Topics</p>
              <h3>{weakTopicsList.length}</h3>
            </div>
            <div className="stat-icon"><TriangleAlert size={24} /></div>
          </div>
        </div>

        <div className="middle-grid">
          <div className="section-card">
            <div className="section-head">
              <BookOpen size={18} />
              <h3>Lesson Journey</h3>
            </div>

            <div className="journey-wrap">
              {lessonJourney.length > 0 ? (
                lessonJourney.map((lesson) => (
                  <div key={lesson.id} className="journey-chip completed">
                    <div className="journey-title">{lesson.title}</div>
                    <div className="journey-status">{lesson.quizType}</div>
                  </div>
                ))
              ) : (
                <p className="empty-text">No completed lessons yet</p>
              )}
            </div>
          </div>

          <div className="section-card">
            <div className="section-head">
              <TriangleAlert size={18} />
              <h3>Weak Topics</h3>
            </div>

            <div className="weak-wrap">
              {weakTopicsList.length > 0 ? (
                weakTopicsList.map((topic, index) => (
                  <span key={index} className="weak-pill">
                    {topic}
                  </span>
                ))
              ) : (
                <p className="empty-text">No weak topics</p>
              )}
            </div>
          </div>
        </div>

        <div className="section-card">
          <div className="section-head">
            <BarChartIcon />
            <h3>Question Attempt Summary</h3>
          </div>

          <div className="table-wrap">
            <table className="profile-table">
              <thead>
                <tr>
                  <th>Difficulty</th>
                  <th>Attempt Count</th>
                  <th>Performance Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic</td>
                  <td>{basicAttempts}</td>
                  <td>
                    <span className="table-badge success">
                      {basicAttempts > 0 ? "Tracked" : "No attempts"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Moderate</td>
                  <td>{moderateAttempts}</td>
                  <td>
                    <span className="table-badge warning">
                      {moderateAttempts > 0 ? "Tracked" : "No attempts"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Advanced</td>
                  <td>{advancedAttempts}</td>
                  <td>
                    <span className="table-badge danger">
                      {advancedAttempts > 0 ? "Tracked" : "No attempts"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="section-card">
            <div className="section-head">
              <TrendingUp size={18} />
              <h3>Performance Analytics</h3>
            </div>

            <div className="analytics-grid">
              <div className="analytic-box">
                <p className="analytic-label">Basic Attempts</p>
                <div className="progress-line">
                  <div
                    className="progress-fill teal-fill"
                    style={{ width: `${basicWidth}%` }}
                  />
                </div>
                <span>{basicAttempts}</span>
              </div>

              <div className="analytic-box">
                <p className="analytic-label">Moderate Attempts</p>
                <div className="progress-line">
                  <div
                    className="progress-fill amber-fill"
                    style={{ width: `${moderateWidth}%` }}
                  />
                </div>
                <span>{moderateAttempts}</span>
              </div>

              <div className="analytic-box">
                <p className="analytic-label">Advanced Attempts</p>
                <div className="progress-line">
                  <div
                    className="progress-fill rose-fill"
                    style={{ width: `${advancedWidth}%` }}
                  />
                </div>
                <span>{advancedAttempts}</span>
              </div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-head">
              <Clock3 size={18} />
              <h3>Support Timeline</h3>
            </div>

            <div className="timeline">
              <div className="timeline-item rose">
                <p className="timeline-title">Weak topics detected</p>
                <p className="timeline-desc">
                  The learner profile shows areas that need more practice and support.
                </p>
              </div>

              <div className="timeline-item amber">
                <p className="timeline-title">Learner progress reviewed</p>
                <p className="timeline-desc">
                  Lessons completed and question attempts are available for admin review.
                </p>
              </div>

              <div className="timeline-item teal">
                <p className="timeline-title">Teacher action recommended</p>
                <p className="timeline-desc">
                  Follow up through chat, monitor weak topics, and guide revision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BarChartIcon() {
  return <TrendingUp size={18} />;
}

export default LearnerProfile;