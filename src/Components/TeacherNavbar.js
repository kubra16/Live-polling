import React, { useState } from "react";
import styles from "./Teacher.module.css";

const TeacherNavbar = ({ setCurrentSection }) => {
  const [activeSection, setActiveSection] = useState("polls");

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setCurrentSection(section);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>LivePolling</div>
      <div className={styles.navItems}>
        <div
          className={`${styles.navItem} ${
            activeSection === "polls" ? styles.active : ""
          }`}
          onClick={() => handleSectionClick("polls")}
        >
          Polls
        </div>
        <div
          className={`${styles.navItem} ${
            activeSection === "chat" ? styles.active : ""
          }`}
          onClick={() => handleSectionClick("chat")}
        >
          Chat
        </div>
        <div
          className={`${styles.navItem} ${
            activeSection === "students" ? styles.active : ""
          }`}
          onClick={() => handleSectionClick("students")}
        >
          Students
        </div>
        <div
          className={`${styles.navItem} ${
            activeSection === "PollsHistory" ? styles.active : ""
          }`}
          onClick={() => handleSectionClick("PollsHistory")}
        >
          Previous polls
        </div>
      </div>
    </nav>
  );
};

export default TeacherNavbar;
