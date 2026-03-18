import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FiLogOut } from "react-icons/fi";

function TeacherDashboard() {

  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");

    if (!loggedIn) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">

      {/* NAVBAR */}
      <div className="top-navbar">

        <div className="logo-section">
          <img src="/logo.png" alt="GrammarPal" />
          <h2 className="logo-text">GrammarPal</h2>
        </div>

        <button className="icon-btn">
          <FiLogOut size={20} />
        </button>

      </div>

      {/* HEADER */}
      <div className="top-bar">
        
        <h1 className="dashboard-heading">Admin Dashboard</h1>
      </div>

      {/* CARD GRID */}
      <div className="card-grid">

        {/* Low Score Students */}
        <div className="dashboard-card">
          <div className="card-icon">📉</div>
          <h3>Low Score Students</h3>
          <p>Students performing below threshold.</p>
          <span className="badge">12 Students</span>
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
          <span className="badge warning">5 Topics</span>
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
          <span className="badge danger">8 Pending</span>
          <br /><br />
          <Link to="/help-requests">
            <button className="card-btn">Manage Requests</button>
          </Link>
        </div>

        {/* Student Progress */}
        <div className="dashboard-card">
          <div className="card-icon">📊</div>
          <h3>Student Progress</h3>
          <p>View overall performance analytics.</p>
          <br />
          <Link to="/progress">
            <button className="card-btn">View Progress</button>
          </Link>
        </div>

      </div>

    </div>
  );
}

export default TeacherDashboard;