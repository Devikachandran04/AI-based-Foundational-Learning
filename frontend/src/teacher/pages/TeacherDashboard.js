import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

function TeacherDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/"); // now "/" goes to dashboard
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

      <div className="card-grid">
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