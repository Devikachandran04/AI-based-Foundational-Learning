import React from "react";

function WeakTopics({ data }) {
  return (
    <div className="card">
      <h3>Weak Topics</h3>
      <ul>
        {data?.weak_topics?.map((topic, index) => (
          <li key={index}>{topic}</li>
        ))}
      </ul>
    </div>
  );
}

export default WeakTopics;