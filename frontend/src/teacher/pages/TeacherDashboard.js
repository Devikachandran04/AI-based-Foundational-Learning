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
        // ✅ Get token from URL
        const urlParams = new URLSearchParams(window.location.search);
        let token = urlParams.get("token");

        // ✅ Save token if present
        if (token) {
          localStorage.setItem("token", token);
        } else {
          token = localStorage.getItem("token");
        }

        if (!token) {
          console.error("No token found! Redirecting...");
          navigate("/");
          return;
        }

        const BASE_URL = "https://ai-based-foundational-learning-production.up.railway.app";

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const [summaryRes, weakRes, helpRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/teacher/dashboard/summary`, config),
          axios.get(`${BASE_URL}/api/teacher/dashboard/weak-topics`, config),
          axios.get(`${BASE_URL}/api/help/all`, config)
        ]);

        setSummaryData({
          total_students: summaryRes.data?.total_students ?? 0,
          avg_score_7d: summaryRes.data?.avg_score_7d ?? 0,
          low_score_students: summaryRes.data?.low_score_students ?? 0
        });

        setWeakCount(weakRes.data?.weak_topics?.length ?? 0);
        setHelpCount(helpRes.data?.all_doubts?.length ?? 0);

      } catch (err) {
        console.error("Error fetching dashboard:", err);

        if (err?.response?.status === 401) {
          alert("Session expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="top-navbar">
        <h2>GrammarPal</h2>
        <button onClick={handleLogout}>
          <FiLogOut />
        </button>
      </div>

      <h1>Admin Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Total Students: {summaryData.total_students}</p>
          <p>Avg Score: {summaryData.avg_score_7d}</p>
          <p>Low Score Students: {summaryData.low_score_students}</p>
          <p>Weak Topics: {weakCount}</p>
          <p>Help Requests: {helpCount}</p>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;