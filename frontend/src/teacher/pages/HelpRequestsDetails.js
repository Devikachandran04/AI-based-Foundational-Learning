import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function HelpRequestsDetails() {
  const [helpRequests, setHelpRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reply, setReply] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://ai-based-foundational-learning-production.up.railway.app/api/help/all", { headers: { Authorization: `Bearer ${token}` } });
        setHelpRequests(res.data?.all_doubts || []);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [token]);

  const handleReplyClick = (request) => setSelectedRequest(request);
  const sendReply = () => {
    console.log("Reply sent:", reply, "to request:", selectedRequest);
    setSelectedRequest(null); setReply("");
  };

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div className="top-bar"><h1 className="dashboard-heading">📨 Help Requests</h1></div>
        <Link to="/dashboard"><button className="back-btn">← Back</button></Link>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>Student Name</th><th>Topic</th><th>Query</th><th>Action</th></tr></thead>
          <tbody>
            {helpRequests.length>0 ? helpRequests.map((r,i)=>(
              <tr key={i}>
                <td>{r.student_name||r.name}</td>
                <td>{r.topic||"General"}</td>
                <td>{r.query}</td>
                <td><button className="small-btn" onClick={()=>handleReplyClick(r)}>Reply</button></td>
              </tr>
            )) : <tr><td colSpan="4">No help requests.</td></tr>}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <div className="student-popup">
          <h4>Reply to {selectedRequest.student_name}</h4>
          <textarea value={reply} onChange={e=>setReply(e.target.value)} placeholder="Type your reply..." rows={4}></textarea>
          <button className="small-btn" onClick={sendReply}>Send Reply</button>
          <button className="small-btn" onClick={()=>setSelectedRequest(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default HelpRequestsDetails;