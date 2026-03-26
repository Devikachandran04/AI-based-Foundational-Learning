import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";

function TeacherDashboard() {
  const navigate = useNavigate();

  const [summaryData, setSummaryData] = useState({
    total_students: 0,
    avg_score_7d: 0,
    low_score_students: 0
  });
  const [weakCount, setWeakCount] = useState(0);
  const [helpCount, setHelpCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // ✅ get token from URL first
const urlParams = new URLSearchParams(window.location.search);
let token = urlParams.get("token");

// ✅ if token comes from URL → store it
if (token) {
  localStorage.setItem("token", token);
} else {
  token = localStorage.getItem("token");
}

        if (!token) {
          console.error("No token found! Redirecting...");
navigate("/");
          setLoading(false);
          return;
        }

        const BASE_URL = "https://ai-based-foundational-learning-production.up.railway.app";

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [summaryRes, weakRes, helpRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/teacher/dashboard/summary`, config),
          axios.get(`${BASE_URL}/api/teacher/dashboard/weak-topics`, config),
          axios.get(`${BASE_URL}/api/help/all`, config)
        ]);

        console.log("SUMMARY API RESPONSE:", summaryRes.data);
        console.log("WEAK TOPICS RESPONSE:", weakRes.data);
        console.log("HELP REQUESTS RESPONSE:", helpRes.data);

        setSummaryData({
          total_students: summaryRes.data?.total_students ?? 0,
          avg_score_7d: summaryRes.data?.avg_score_7d ?? 0,
          low_score_students: summaryRes.data?.low_score_students ?? 0
        });

        setWeakCount(weakRes.data?.weak_topics?.length ?? 0);
        setHelpCount(helpRes.data?.all_doubts?.length ?? 0);
      } catch (err) {
        console.error(
          "Error fetching dashboard data:",
          err.response?.data || err.message || err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear the token
    localStorage.removeItem("adminLoggedIn");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="top-navbar">
        <div className="logo-section">
          <h2 className="logo-text">GrammarPal</h2>
        </div>
        <button className="icon-btn" onClick={handleLogout}>
          <FiLogOut size={20} />
        </button>
      </div>

      <div className="top-bar">
        <h1 className="dashboard-heading">Admin Dashboard</h1>
      </div>

      {loading ? (
        <p className="loading-text">Loading dashboard...</p>
      ) : (
        <div className="card-grid">
          <div className="dashboard-card">
            <div className="card-icon">📉</div>
            <h3>Low Score Students</h3>
            <p>Students performing below threshold.</p>
            <span className="badge">{summaryData.low_score_students} Students</span>
            <br /><br />
            <Link to="/low-scores">
              <button className="card-btn">View Details</button>
            </Link>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📚</div>
            <h3>Weak Topics</h3>
            <p>Topics where students are struggling.</p>
            <span className="badge warning">{weakCount} Topics</span>
            <br /><br />
            <Link to="/weak-topics">
              <button className="card-btn">View Topics</button>
            </Link>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">❓</div>
            <h3>Help Requests</h3>
            <p>Pending student doubts and queries.</p>
            <span className="badge danger">{helpCount} Pending</span>
            <br /><br />
            <Link to="/help-requests">
              <button className="card-btn">Manage Requests</button>
            </Link>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Student Progress</h3>
            <p>Total Students: {summaryData.total_students}</p>
            <p>Average Score (7 days): {summaryData.avg_score_7d}%</p>
            <br />
            <Link to="/progress">
              <button className="card-btn">View Progress</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;