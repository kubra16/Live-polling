import React from "react";

const StudentNavbar = ({ setCurrentSection }) => {
  return (
    <nav>
      <button onClick={() => setCurrentSection("polls")}>Polls</button>
      <button onClick={() => setCurrentSection("chat")}>Chat</button>
    </nav>
  );
};

export default StudentNavbar;
