import React from "react";

function StudentDashboard() {

  const studentData = {
    name: "Samyuktha S",
    lessonsCompleted: 5,
    averageScore: 72,
    attempts: 10,
    repeatedFailures: 1,
    weakTopics: ["Prepositions", "Articles"]
  };

  const lessonPerformance = [
    { lesson: "Nouns", score: 85, attempts: 1 },
    { lesson: "Pronouns", score: 78, attempts: 2 },
    { lesson: "Prepositions", score: 55, attempts: 3 },
    { lesson: "Adjectives", score: 72, attempts: 2 },
    { lesson: "Articles", score: 60, attempts: 2 }
  ];

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>

      <h1>Student Performance Dashboard</h1>

      <h3>Student Name: {studentData.name}</h3>

      <hr/>

      <p><b>Lessons Completed:</b> {studentData.lessonsCompleted}</p>
      <p><b>Average Score:</b> {studentData.averageScore}%</p>
      <p><b>Number of Attempts:</b> {studentData.attempts}</p>
      <p><b>Repeated Failures:</b> {studentData.repeatedFailures}</p>

      <hr/>

      <h3>Weak Topics</h3>
      <ul>
        {studentData.weakTopics.map((topic, index) => (
          <li key={index}>{topic}</li>
        ))}
      </ul>

      <hr/>

      <h3>Lesson Performance</h3>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Lesson</th>
            <th>Score</th>
            <th>Attempts</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {lessonPerformance.map((lesson, index) => (
            <tr key={index}>
              <td>{lesson.lesson}</td>
              <td>{lesson.score}%</td>
              <td>{lesson.attempts}</td>
              <td>{lesson.score >= 70 ? "Passed" : "Weak"}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default StudentDashboard;