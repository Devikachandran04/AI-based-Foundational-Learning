import React from "react";
import { Link } from "react-router-dom";

function WeakTopics({ data }) {

  if (!data || !data.weak_topics) {
    return (
      <div className="card">
        <h3>Weak Topics</h3>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Link 
      to="/weak-topics" 
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="card">
        <h3>Weak Topics</h3>
        <ul>
          {data.weak_topics.map((topic, index) => (
            <li key={index}>{topic}</li>
          ))}
        </ul>
      </div>
    </Link>
  );
}

export default WeakTopics;