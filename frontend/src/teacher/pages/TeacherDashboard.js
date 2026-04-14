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
        } else {
          token = localStorage.getItem("token");
        }

        if (!token) {
          setSessionError("No login session found. Please login again.");
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
          total_students:
            summaryRes.data && summaryRes.data.total_students
              ? summaryRes.data.total_students
              : 0,
          avg_score_7d:
            summaryRes.data && summaryRes.data.avg_score_7d
              ? summaryRes.data.avg_score_7d
              : 0,
        });

        setLowScoreCount(
          lowRes.data && lowRes.data.students ? lowRes.data.students.length : 0
        );
        setWeakCount(
          weakRes.data && weakRes.data.weak_topics
            ? weakRes.data.weak_topics.length
            : 0
        );
        setHelpCount(
          helpRes.data && helpRes.data.all_doubts
            ? helpRes.data.all_doubts.length
            : 0
        );
      } catch (err) {
        console.error("Error fetching dashboard data:", err);

        if (err && err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          setSessionError("Session expired. Please login again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("grammar-pal-storage");
    window.location.href =
      "https://ai-based-foundational-learning-user.vercel.app/";
  };

  const handleLoginRedirect = () => {
    window.location.href =
      "https://ai-based-foundational-learning-user.vercel.app/";
  };

  const averageCompletion =
    summaryData.total_students > 0
      ? Math.min(100, Math.round((summaryData.avg_score_7d || 0) * 0.8))
      : 0;

  if (loading) {
    return (
      <div className="dashboard-container">
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="dashboard-container">
        <div className="top-navbar">
          <div className="logo-section">
            <h2 className="logo-text">GrammarPal</h2>
            <p className="logo-subtitle">Admin Panel</p>
          </div>
        </div>

        <div className="analytics-panel" style={{ maxWidth: "700px", margin: "40px auto" }}>
          <h3>Session Error</h3>
          <p className="dashboard-subheading" style={{ marginBottom: "20px" }}>
            {sessionError}
          </p>
          <button className="card-btn" onClick={handleLoginRedirect}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
            Monitor student progress, lesson performance, and support requests.
          </p>
        </div>
      </div>

      <div className="admin-hero">
        <div className="hero-panel">
          <p className="hero-eyebrow">Teacher Overview</p>
          <h2 className="hero-title">Academic Monitoring Hub</h2>
          <p className="hero-text">
            This dashboard helps teachers track student performance, review
            weak lesson areas, monitor help requests, and open detailed learner
            pages for closer follow-up.
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
            Review topic analytics to identify the grammar concepts learners
            struggle with the most.
          </div>

          <div className="insight-item danger">
            <strong>{lowScoreCount} students need support</strong>
            These learners are currently showing lower performance and may
            need closer monitoring.
          </div>

          <div className="insight-item success">
            <strong>{helpCount} help threads available</strong>
            Student doubts and follow-up replies can be managed from the
            help request section.
          </div>
        </div>
      </div>

      <div className="card-grid">
        <div className="dashboard-card">
          <div className="card-icon">SI</div>
          <h3>Student Insights</h3>
          <p>View learner scores, risk levels, and overall student performance.</p>
          <span className="badge">{summaryData.total_students} Learners</span>
          <br />
          <br />
          <Link to="/progress">
            <button className="card-btn">Open Insights</button>
          </Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">LA</div>
          <h3>Lesson Analytics</h3>
          <p>Check weak grammar lessons and identify difficult topic areas.</p>
          <span className="badge warning">{weakCount} Lessons</span>
          <br />
          <br />
          <Link to="/weak-topics">
            <button className="card-btn">Open Analytics</button>
          </Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">SS</div>
          <h3>Students Needing Support</h3>
          <p>Review learners with repeated low scores and monitor their progress.</p>
          <span className="badge warning">{lowScoreCount} Students</span>
          <br />
          <br />
          <Link to="/low-scores">
            <button className="card-btn">View Students</button>
          </Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">HR</div>
          <h3>Help Requests</h3>
          <p>Open student chats, view doubts, and send teacher replies.</p>
          <span className="badge danger">{helpCount} Threads</span>
          <br />
          <br />
          <Link to="/help-requests">
            <button className="card-btn">Open Chats</button>
          </Link>
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
          <h4>Weak Lessons</h4>
          <p>{weakCount}</p>
        </div>

        <div className="kpi-card lowest-card">
          <h4>Pending Replies</h4>
          <p>{helpCount}</p>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginTop: "24px" }}>
        <div className="kpi-card">
          <h4>Average Completion</h4>
          <p>{averageCompletion}%</p>
        </div>

        <div className="kpi-card">
          <h4>Support Cases</h4>
          <p>{lowScoreCount}</p>
        </div>

        <div className="kpi-card">
          <h4>Lesson Alerts</h4>
          <p>{weakCount}</p>
        </div>

        <div className="kpi-card">
          <h4>Open Chats</h4>
          <p>{helpCount}</p>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;