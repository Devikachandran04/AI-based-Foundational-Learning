import React from "react";

function StudentDashboard() {

  const student = {
    name: "Samyuktha S",
    lessonsCompleted: 5,
    averageScore: 72,
    attempts: 10,
    repeatedFailures: 1,
    weakTopics: ["Prepositions", "Articles"]
  };

  const lessons = [
    { lesson: "Nouns", score: 85, attempts: 1 },
    { lesson: "Pronouns", score: 78, attempts: 2 },
    { lesson: "Prepositions", score: 55, attempts: 3 },
    { lesson: "Adjectives", score: 72, attempts: 2 },
    { lesson: "Articles", score: 60, attempts: 2 }
  ];

  return (
    <div style={{padding:"30px"}}>

      <h1>STUDENT PERFORMANCE DASHBOARD</h1>

      <h3>Student Name: {student.name}</h3>

      <hr/>

      <p><b>Lessons Completed:</b> {student.lessonsCompleted}</p>
      <p><b>Average Score:</b> {student.averageScore}%</p>
      <p><b>Number of Attempts:</b> {student.attempts}</p>
      <p><b>Repeated Failures:</b> {student.repeatedFailures}</p>

      <h3>Weak Topics</h3>
      <ul>
        {student.weakTopics.map((topic,index)=>(
          <li key={index}>{topic}</li>
        ))}
      </ul>

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
          {lessons.map((item,index)=>(
            <tr key={index}>
              <td>{item.lesson}</td>
              <td>{item.score}%</td>
              <td>{item.attempts}</td>
              <td>{item.score >= 70 ? "Passed" : "Weak"}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default StudentDashboard;