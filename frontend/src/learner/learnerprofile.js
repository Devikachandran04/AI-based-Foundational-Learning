import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  User,
  GraduationCap,
  TriangleAlert,
  TrendingUp,
  BookOpen,
  MessageCircle,
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
  const [selectedLesson, setSelectedLesson] = useState("");

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
    if (!student?.weak_lessons) return [];
    return student.weak_lessons.map((item) => item.lesson_title).filter(Boolean);
  }, [student]);

  const completionPercent = useMemo(() => {
    return Number(student?.course_completion) || 0;
  }, [student]);

  const riskLevel = useMemo(() => {
    const adaptive = Number(student?.adaptive_score) || 0;

    if (adaptive < 40) return "High Risk";
    if (adaptive < 70) return "Medium Risk";
    return "Low Risk";
  }, [student]);

  const graphLessonNames = useMemo(() => {
    if (!student?.graph_data) return [];

    return Object.entries(student.graph_data)
      .filter(([_, value]) => {
        const mixedCount = value?.mixed_scores?.length || 0;
        const simplifiedCount = value?.simplified_scores?.length || 0;
        return mixedCount + simplifiedCount > 0;
      })
      .map(([lessonName]) => lessonName);
  }, [student]);

  useEffect(() => {
    if (graphLessonNames.length > 0) {
      const stillValid = graphLessonNames.includes(selectedLesson);

      if (!selectedLesson || !stillValid) {
        setSelectedLesson(graphLessonNames[0]);
      }
    } else {
      setSelectedLesson("");
    }
  }, [graphLessonNames, selectedLesson]);

  const selectedGraph =
    selectedLesson && student?.graph_data?.[selectedLesson]
      ? student.graph_data[selectedLesson]
      : null;

  const lessonJourney = useMemo(() => {
    if (!student?.learning_path) return [];

    return student.learning_path.map((lesson, index) => ({
      id: index,
      title: lesson.lesson_title || `Lesson ${index + 1}`,
      state: lesson.state || "Not Started",
    }));
  }, [student]);

  if (loading) {
    return <p className="loading">Loading profile...</p>;
  }

  if (!student || student.error) {
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
              Admin-side tracking view for lesson progress, quiz path, and score history.
            </p>
          </div>

          <div className="hero-actions">
            <Link
              to="/help-requests"
              state={{
                studentId: studentId || null,
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
                  <span className="pill pill-info">
                    {student.performance_level || "Not Started"}
                  </span>
                  <span className="pill pill-light">
                    {student.overall_status || "Not Started"}
                  </span>
                  <span
                    className={`pill pill-risk ${
                      riskLevel === "High Risk"
                        ? "high"
                        : riskLevel === "Medium Risk"
                        ? "medium"
                        : "low"
                    }`}
                  >
                    {riskLevel}
                  </span>
                </div>
              </div>
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
              <div className="chip-icon"><MessageCircle size={18} /></div>
              <div>
                <p className="chip-label">Risk Level</p>
                <p className="chip-value">{riskLevel}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card teal">
            <div>
              <p className="stat-label">Adaptive Score</p>
              <h3>{student.adaptive_score || 0}%</h3>
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
              <p className="stat-label">Weak Lessons</p>
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
                  <div
                    key={lesson.id}
                    className={`journey-chip ${
                      lesson.state === "Completed"
                        ? "completed"
                        : lesson.state === "Attempted"
                        ? "attempted"
                        : "not-started"
                    }`}
                  >
                    <div className="journey-title">{lesson.title}</div>
                    <div className="journey-status">{lesson.state}</div>
                  </div>
                ))
              ) : (
                <p className="empty-text">No lesson journey available</p>
              )}
            </div>
          </div>

          <div className="section-card">
            <div className="section-head">
              <TriangleAlert size={18} />
              <h3>Weak Lessons</h3>
            </div>

            <div className="weak-wrap">
              {weakTopicsList.length > 0 ? (
                weakTopicsList.map((topic, index) => (
                  <span key={index} className="weak-pill">
                    {topic}
                  </span>
                ))
              ) : (
                <p className="empty-text">No weak lessons</p>
              )}
            </div>
          </div>
        </div>

        <div className="section-card">
          <div className="section-head">
            <TrendingUp size={18} />
            <h3>Lesson Performance Tracking</h3>
          </div>

          <div className="table-wrap">
            {student.lesson_performance && student.lesson_performance.length > 0 ? (
              <table className="profile-table">
                <thead>
                  <tr>
                    <th>Lesson</th>
                    <th>Quiz Path</th>
                    <th>Latest Score</th>
                    <th>Basic</th>
                    <th>Moderate</th>
                    <th>Advanced</th>
                    <th>Recommended Action</th>
                  </tr>
                </thead>
                <tbody>
                  {student.lesson_performance.map((lesson, index) => {
                    const latestScore = Number(lesson.latest_score) || 0;

let recommendedAction = "Not Started";

// Check if the lesson has not been attempted
if (
  lesson.current_quiz === "Not Started" ||
  lesson.current_quiz === null ||
  lesson.current_quiz === undefined ||
  lesson.attempts === 0 ||
  latestScore === 0
) {
  recommendedAction = "Not Started";
} else if (latestScore < 40) {
  recommendedAction = "Immediate Support";
} else if (lesson.current_quiz === "Simplified Quiz") {
  recommendedAction = "Retry Main Quiz";
} else if (latestScore < 70) {
  recommendedAction = "Practice More";
 } else {
  recommendedAction = "Progressing Well";
}

                    return (
                      <tr key={lesson.lesson_id || index}>
                        <td>{lesson.lesson_title}</td>
                        <td>
                          <span
                            className={`table-badge ${
                              lesson.current_quiz === "Main Quiz"
                                ? "success"
                                : lesson.current_quiz === "Simplified Quiz"
                                ? "warning"
                                : "neutral"
                            }`}
                          >
                            {lesson.current_quiz}
                          </span>
                        </td>
                        <td>{latestScore}%</td>
                        <td>{lesson.basic_correct || 0}</td>
                        <td>{lesson.moderate_correct || 0}</td>
                        <td>{lesson.hard_correct || 0}</td>
                        <td>{recommendedAction}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="empty-text">No lesson performance data available</p>
            )}
          </div>
        </div>

        <div className="section-card">
          <div className="section-head">
            <TrendingUp size={18} />
            <h3>Quiz Attempt Progress</h3>
          </div>

          <div className="graph-toolbar">
            <select
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
              className="lesson-select"
            >
              {graphLessonNames.map((lessonName) => (
                <option key={lessonName} value={lessonName}>
                  {lessonName}
                </option>
              ))}
            </select>
          </div>

          {selectedGraph && graphLessonNames.length > 0 ? (
            <div className="attempt-graph-card">
              <div className="attempt-graph">
                {Array.from({
                  length: Math.max(
                    selectedGraph?.mixed_scores?.length || 0,
                    selectedGraph?.simplified_scores?.length || 0
                  ),
                }).map((_, i) => {
                  const mixed =
                    selectedGraph?.mixed_scores?.[i] !== undefined
                      ? Number(selectedGraph.mixed_scores[i])
                      : null;

                  const simplified =
                    selectedGraph?.simplified_scores?.[i] !== undefined
                      ? Number(selectedGraph.simplified_scores[i])
                      : null;

                  return (
                    <div key={i} className="attempt-group">
                      <div className="attempt-bars">
                        <div className="attempt-bar-col">
                          {mixed !== null ? (
                            <>
                              <span className="attempt-value">{mixed}</span>
                              <div
                                className="attempt-bar mixed-bar"
                                style={{
                                  height: `${Math.max((mixed / 100) * 180, 18)}px`,
                                }}
                              />
                            </>
                          ) : (
                            <div className="attempt-bar-spacer" />
                          )}
                        </div>

                        <div className="attempt-bar-col">
                          {simplified !== null ? (
                            <>
                              <span className="attempt-value">{simplified}</span>
                              <div
                                className="attempt-bar simplified-bar"
                                style={{
                                  height: `${Math.max(
                                    (simplified / 100) * 180,
                                    18
                                  )}px`,
                                }}
                              />
                            </>
                          ) : (
                            <div className="attempt-bar-spacer" />
                          )}
                        </div>
                      </div>

                      <span className="attempt-label">A{i + 1}</span>
                    </div>
                  );
                })}
              </div>

              <div className="attempt-legend">
                <div className="legend-item">
                  <span className="legend-dot mixed-dot" />
                  Mixed Quiz
                </div>
                <div className="legend-item">
                  <span className="legend-dot simplified-dot" />
                  Simplified Quiz
                </div>
              </div>
            </div>
          ) : (
            <p className="empty-text">No quiz attempt graph available yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LearnerProfile;