import React from "react";
import { useSelector } from "react-redux";

const PollResults = () => {
  const results = useSelector((state) => state.pollResults) || {};
  const currentPoll = useSelector((state) => state.currentPoll);

  const allOptions = currentPoll?.options || [];

  return (
    <div>
      <h2>Polling results</h2>
      <ul>
        {allOptions.map((option, index) => (
          <li key={index}>
            {`${option} : ${results[option] ? results[option] + "%" : "0%"}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollResults;
