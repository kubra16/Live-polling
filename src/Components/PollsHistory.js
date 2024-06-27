import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import styles from "./pollResults.module.css";

const BASE_URL = process.env.REACT_APP_API_URL;

const PollsHistory = () => {
  const [previousPolls, setPreviousPolls] = useState([]);

  useEffect(() => {
    const fetchPreviousPolls = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/previous-polls`);
        setPreviousPolls(response.data);
      } catch (error) {
        console.error("Error fetching previous polls:", error);
      }
    };

    fetchPreviousPolls();
  }, []);

  return (
    <div className={styles.pollsContainer}>
      <h2>Previous Polls</h2>
      <ul className={styles.pollsList}>
        {previousPolls.map((poll) => (
          <li key={poll._id} className={styles.pollLitem}>
            <h3>{poll.question}</h3>
            <ul className={styles.optionsList}>
              {poll.options.map((option, index) => (
                <li key={index} className={styles.optionItem}>
                  {option}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollsHistory;
