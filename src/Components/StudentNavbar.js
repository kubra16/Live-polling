import React, { useState } from "react";
import styles from "./Teacher.module.css";
const StudentNavbar = ({ setCurrentSection }) => {
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
      </div>
    </nav>
  );
};

export default StudentNavbar;
