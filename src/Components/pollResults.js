import React from "react";
import { useSelector } from "react-redux";
import styles from "./pollResults.module.css";

const PollResults = () => {
  const results = useSelector((state) => state.pollResults) || {};
  console.log(results);
  const currentPoll = useSelector((state) => state.currentPoll);
  const correctOption = currentPoll?.correctOption;

  const allOptions = currentPoll?.options || [];

  return (
    <div className={styles.resultsContainer}>
      <div>
        <h2>Polling results</h2>
        <ul className={styles.resultsList}>
          {allOptions.map((option, index) => (
            <li
              key={index}
              className={`${styles.resultItem} ${
                option === correctOption ? styles.correctAnswer : ""
              }`}
            >
              <span>{option}</span>
              <span>{results[option] ? results[option] + "%" : "0%"}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PollResults;
