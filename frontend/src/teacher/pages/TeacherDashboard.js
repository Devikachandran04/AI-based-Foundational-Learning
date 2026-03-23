import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";
const token = localStorage.getItem("token");

const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};
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
    // only axios part changed

const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const [summaryRes, weakRes, helpRes] = await Promise.all([
      axios.get("http://127.0.0.1:5000/api/teacher/dashboard/summary", config),
      axios.get("http://127.0.0.1:5000/api/teacher/dashboard/weak-topics", config),
      axios.get("http://127.0.0.1:5000/api/help/all", config)
    ]);

        // summary data
        setSummaryData({
          total_students: summaryRes.data?.total_students || 0,
          avg_score_7d: summaryRes.data?.avg_score_7d || 0,
          low_score_students: summaryRes.data?.low_score_students || 0
        });

        // weak topics count
        setWeakCount(weakRes.data?.weak_topics?.length || 0);

        // help requests count
        setHelpCount(helpRes.data?.all_doubts?.length || 0);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
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
          {/* Low Score Students */}
          <div className="dashboard-card">
            <div className="card-icon">📉</div>
            <h3>Low Score Students</h3>
            <p>Students performing below threshold.</p>
            <span className="badge">
              {summaryData.low_score_students} Students
            </span>
            <br /><br />
            <Link to="/low-scores">
              <button className="card-btn">View Details</button>
            </Link>
          </div>

          {/* Weak Topics */}
          <div className="dashboard-card">
            <div className="card-icon">📚</div>
            <h3>Weak Topics</h3>
            <p>Topics where students are struggling.</p>
            <span className="badge warning">
              {weakCount} Topics
            </span>
            <br /><br />
            <Link to="/weak-topics">
              <button className="card-btn">View Topics</button>
            </Link>
          </div>

          {/* Help Requests */}
          <div className="dashboard-card">
            <div className="card-icon">❓</div>
            <h3>Help Requests</h3>
            <p>Pending student doubts and queries.</p>
            <span className="badge danger">
              {helpCount} Pending
            </span>
            <br /><br />
            <Link to="/help-requests">
              <button className="card-btn">Manage Requests</button>
            </Link>
          </div>

          {/* Student Progress */}
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