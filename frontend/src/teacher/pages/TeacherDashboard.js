import { Link } from "react-router-dom";

function TeacherDashboard() {
  return (
    <div className="page-container">

      {/* Top Bar */}
      <div className="top-bar">
        <h2>Foundation Learning - Teacher Panel</h2>
        <button className="logout-btn">
   Logout
</button>

      </div>

      <h1 className="page-title">Dashboard Summary</h1>

      <div className="card-grid">

        {/* Low Score Students */}
        <div className="card">
          <h3>📉 Low Score Students</h3>
          <p>Students performing below threshold.</p>
          <span className="badge badge-primary">12 Students</span>
          <Link to="/low-scores">
            <button className="btn btn-primary">View Details</button>
          </Link>
        </div>

        {/* Weak Topics */}
        <div className="card">
          <h3>📚 Weak Topics</h3>
          <p>Topics where students are struggling.</p>
          <span className="badge badge-warning">5 Topics</span>
          <Link to="/weak-topics">
            <button className="btn btn-warning">View Topics</button>
          </Link>
        </div>

        {/* Help Requests */}
        <div className="card">
          <h3>❓ Help Requests</h3>
          <p>Pending student doubts and queries.</p>
          <span className="badge badge-danger">8 Pending</span>
          <Link to="/help-requests">
            <button className="btn btn-danger">Manage Requests</button>
          </Link>
        </div>

        {/* Student Progress */}
        <div className="card">
          <h3>📊 Student Progress</h3>
          <p>View overall performance analytics.</p>
          <Link to="/progress">
            <button className="btn btn-success">View Progress</button>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default TeacherDashboard;