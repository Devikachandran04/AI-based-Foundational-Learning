import React, { useState } from "react";
import { Link } from "react-router-dom";

function HelpRequestsDetails() {

const helpRequests = [
{
student: "Student C",
topic: "Fractions",
message: "Need help understanding division of fractions.",
status: "Pending",
},
{
student: "Student D",
topic: "Grammar",
message: "Confused about sentence structure.",
status: "Resolved",
},
];

const [selectedRequest, setSelectedRequest] = useState(null);
const [reply, setReply] = useState("");

const handleReplyClick = (request) => {
setSelectedRequest(request);
};

const sendReply = () => {
console.log("Reply sent:", reply);
setReply("");
setSelectedRequest(null);
};

return (
<div className="analytics-page">

<div className="analytics-header">
<div className="top-bar">
<div></div>
<h1 className="dashboard-heading">Help Requests</h1>
</div>

<Link to="/dashboard">
<button className="back-btn">← Back</button>
</Link>
</div>

{/* TABLE */}
<div className="table-container">
<table>
<thead>
<tr>
<th>Student</th>
<th>Topic</th>
<th>Message</th>
<th>Status</th>
<th>Action</th>
</tr>
</thead>

<tbody>
{helpRequests.map((request, index) => (
<tr key={index}>
<td>{request.student}</td>
<td>{request.topic}</td>
<td>{request.message}</td>

<td>
<span className={`risk-badge ${request.status.toLowerCase()}`}>
{request.status}
</span>
</td>

<td>
<button
className="small-btn"
onClick={() => handleReplyClick(request)}
>
Reply
</button>
</td>

</tr>
))}
</tbody>
</table>
</div>

{/* REPLY PANEL */}
{selectedRequest && (
<div className="reply-panel">

<div className="reply-header">
<h3>Reply to {selectedRequest.student}</h3>
<button
className="close-reply"
onClick={() => setSelectedRequest(null)}
>
✖
</button>
</div>

<div className="request-details">
<p><strong>Topic:</strong> {selectedRequest.topic}</p>
<p><strong>Message:</strong> {selectedRequest.message}</p>
</div>

<textarea
className="reply-textarea"
placeholder="Write your response to the student..."
value={reply}
onChange={(e) => setReply(e.target.value)}
/>

<div className="reply-actions">
<button className="send-reply-btn" onClick={sendReply}>
Send Reply
</button>
</div>

</div>
)}

</div>
);
}

export default HelpRequestsDetails;