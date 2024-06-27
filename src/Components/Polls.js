import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const Polls = () => {
  const [previousPolls, setPreviousPolls] = useState([]);
  useEffect(() => {
    const fetchPreviousPolls = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/previous-polls"
        );
        setPreviousPolls(response.data);
        console.log(previousPolls);
      } catch (error) {
        console.error("Error fetching previous polls:", error);
      }
    };

    fetchPreviousPolls();
  }, []);
  return (
    <div>
      <h2>Previous Polls</h2>
      <ul>
        {previousPolls.map((poll) => (
          <li key={poll._id}>
            <h3>{poll.question}</h3>
            <ul>
              {poll.options.map((option, index) => (
                <li key={index}>{option}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Polls;
