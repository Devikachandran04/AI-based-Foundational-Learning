import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Progress() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://ai-based-foundational-learning-production.up.railway.app/api/teacher/dashboard/student-progress",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStudents(res.data.students);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Progress</h2>

      {students.map((student, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px",
            cursor: "pointer",
          }}
          onClick={() =>
            navigate("/learner-profile", { state: { student } })
          }
        >
          <h3>{student.name}</h3>
          <p>Lessons: {student.lessons_completed}</p>
          <p>Avg Score: {student.avg_score}</p>
        </div>
      ))}
    </div>
  );
}

export default Progress;