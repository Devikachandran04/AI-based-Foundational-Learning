import React from "react";
import { Link } from "react-router-dom";

function WeakTopics({ data }) {

  if (!data || !data.weak_topics) {
    return (
      <div className="card">
        <h3>📚 Weak Topics</h3>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>📚 Weak Topics</h3>

      <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
        {data.weak_topics.map((topic, index) => (
          <li key={index}>{topic}</li>
        ))}
      </ul>

      <Link to="/weaktopics">
        <button className="btn btn-warning" style={{ marginTop: "10px" }}>
          View Topics
        </button>
      </Link>
    </div>
  );
}

export default WeakTopics;