import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";

function TeacherDashboard() {
  const [summaryData, setSummaryData] = useState({
    total_students: 0,
    avg_score_7d: 0,
  });
  const [lowScoreCount, setLowScoreCount] = useState(0);
  const [weakCount, setWeakCount] = useState(0);
  const [helpCount, setHelpCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
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

        if (!token) {
          setSessionError(
            "No login session found. Open the deployed admin flow and login again."
          );
          setLoading(false);
          return;
        }

        const BASE_URL =
          "https://ai-based-foundational-learning-production.up.railway.app";

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const [summaryRes, lowRes, weakRes, helpRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/teacher/dashboard/summary`, config),
          axios.get(`${BASE_URL}/api/teacher/dashboard/low-score-students`, config),
          axios.get(`${BASE_URL}/api/teacher/dashboard/weak-topics`, config),
          axios.get(`${BASE_URL}/api/help/all`, config),
        ]);

        setSummaryData({
          total_students: summaryRes.data?.total_students ?? 0,
          avg_score_7d: summaryRes.data?.avg_score_7d ?? 0,
        });

        setLowScoreCount(lowRes.data?.students?.length ?? 0);
        setWeakCount(weakRes.data?.weak_topics?.length ?? 0);
        setHelpCount(helpRes.data?.all_doubts?.length ?? 0);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);

        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("teacher_token");
          setSessionError("Session expired. Login again from the deployed site.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("teacher_token");
    localStorage.removeItem("grammar-pal-storage");
    window.location.href =
      "https://ai-based-foundational-learning-user.vercel.app/";
  };

  const averageCompletion =
    summaryData.total_students > 0
      ? Math.min(100, Math.round((summaryData.avg_score_7d || 0) * 0.8))
      : 0;

  return (
    <div className="dashboard-container">
      <div className="top-navbar">
        <div className="logo-section">
          <h2 className="logo-text">GrammarPal</h2>
          <p className="logo-subtitle">Admin Panel</p>
        </div>

        <button className="icon-btn" onClick={handleLogout} title="Logout">
          <FiLogOut size={20} />
        </button>
      </div>

      <div className="top-bar">
        <div>
          <h1 className="dashboard-heading">Grammar Learning Dashboard</h1>
          <p className="dashboard-subheading">
            Monitor student progress, weak lesson areas, and support conversations.
          </p>
        </div>
      </div>

      <div className="quick-nav">
        <Link to="/dashboard" className="quick-link active">Overview</Link>
        <Link to="/progress" className="quick-link">Student Insights</Link>
        <Link to="/weak-topics" className="quick-link">Lesson Analytics</Link>
        <Link to="/low-scores" className="quick-link">Support Cases</Link>
        <Link to="/help-requests" className="quick-link">Help Requests</Link>
      </div>

      {loading ? (
        <p className="loading-text">Loading dashboard...</p>
      ) : sessionError ? (
        <div className="analytics-panel">
          <h3>Session Required</h3>
          <p className="dashboard-subheading">{sessionError}</p>
          <div style={{ marginTop: "18px" }}>
            <button
              className="card-btn"
              onClick={() => {
                window.location.href =
                  "https://ai-based-foundational-learning-user.vercel.app/";
              }}
            >
              Go to Login
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="admin-hero">
            <div className="hero-panel">
              <p className="hero-eyebrow">Teacher Overview</p>
              <h2 className="hero-title">Academic Monitoring Hub</h2>
              <p className="hero-text">
                Review student performance, identify difficult grammar concepts,
                follow support cases, and move quickly into detailed learner pages.
              </p>

              <div className="hero-mini-grid">
                <div className="hero-mini-card">
                  <h5>Total Students</h5>
                  <p>{summaryData.total_students}</p>
                </div>

                <div className="hero-mini-card">
                  <h5>Average Score</h5>
                  <p>{summaryData.avg_score_7d}%</p>
                </div>

                <div className="hero-mini-card">
                  <h5>Need Support</h5>
                  <p>{lowScoreCount}</p>
                </div>

                <div className="hero-mini-card">
                  <h5>Pending Help</h5>
                  <p>{helpCount}</p>
                </div>
              </div>
            </div>

            <div className="insight-panel">
              <h3>Admin Insights</h3>

              <div className="insight-item warning">
                <strong>{weakCount} lesson areas need attention</strong>
                Review weak-topic analytics to identify the most difficult grammar concepts.
              </div>

              <div className="insight-item danger">
                <strong>{lowScoreCount} learners need support</strong>
                Repeated low-scoring students should be monitored from the support page.
              </div>

              <div className="insight-item success">
                <strong>{helpCount} help threads active</strong>
                Student doubts and teacher follow-ups are available in the help request panel.
              </div>
            </div>
          </div>

          <div className="kpi-grid">
            <div className="kpi-card">
              <h4>Total Students</h4>
              <p>{summaryData.total_students}</p>
            </div>

            <div className="kpi-card average-card">
              <h4>Average Score</h4>
              <p>{summaryData.avg_score_7d}%</p>
            </div>

            <div className="kpi-card">
              <h4>Need Support</h4>
              <p>{lowScoreCount}</p>
            </div>

            <div className="kpi-card lowest-card">
              <h4>Pending Help</h4>
              <p>{helpCount}</p>
            </div>
          </div>

          <div className="analytics-two-col">
            <div className="analytics-panel">
              <h3>Quick Access</h3>

              <div className="card-grid">
                <div className="dashboard-card">
                  <div className="card-icon">SI</div>
                  <h3>Student Insights</h3>
                  <p>View learner scores, risk levels, and direct profile access.</p>
                  <Link to="/progress">
                    <button className="card-btn">Open Insights</button>
                  </Link>
                </div>

                <div className="dashboard-card">
                  <div className="card-icon">LA</div>
                  <h3>Lesson Analytics</h3>
                  <p>Track weak grammar lessons and identify difficult learning areas.</p>
                  <Link to="/weak-topics">
                    <button className="card-btn">Open Analytics</button>
                  </Link>
                </div>

                <div className="dashboard-card">
                  <div className="card-icon">SC</div>
                  <h3>Support Cases</h3>
                  <p>Monitor students with repeated low scores and open learner profiles.</p>
                  <Link to="/low-scores">
                    <button className="card-btn">Open Support</button>
                  </Link>
                </div>

                <div className="dashboard-card">
                  <div className="card-icon">HR</div>
                  <h3>Help Requests</h3>
                  <p>Open student conversations, review doubts, and reply from one place.</p>
                  <Link to="/help-requests">
                    <button className="card-btn">Open Chats</button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="analytics-panel">
              <h3>Support Snapshot</h3>

              <div className="side-stack">
                <div className="side-stat-card">
                  <h5>Average Completion</h5>
                  <p>{averageCompletion}%</p>
                </div>

                <div className="side-stat-card">
                  <h5>Weak Lessons</h5>
                  <p>{weakCount}</p>
                </div>

                <div className="side-stat-card">
                  <h5>Open Chats</h5>
                  <p>{helpCount}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TeacherDashboard;