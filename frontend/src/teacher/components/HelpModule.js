import React from "react";

function HelpModule({ data }) {
  return (
    <div className="card">
      <h3>Help Requests</h3>
      {data?.help_requests?.length === 0 ? (
        <p>No help requests yet.</p>
      ) : (
        <ul>
          {data?.help_requests?.map((request, index) => (
            <li key={index}>{request}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HelpModule;
