import React from "react";

const TeacherNavbar = ({ setCurrentSection }) => {
  return (
    <nav>
      <button onClick={() => setCurrentSection("polls")}>Polls</button>
      <button onClick={() => setCurrentSection("chat")}>Chat</button>
      <button onClick={() => setCurrentSection("students")}>Students</button>
    </nav>
  );
};

export default TeacherNavbar;
