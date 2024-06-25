import React, { useState } from "react";
import io from "socket.io-client";
import { setPoll, setResults } from "../redux/actions";
import { useDispatch } from "react-redux";

const socket = io("http://localhost:5000");

const Teacher = () => {
  const [question, setQuestion] = useState("");
  const [CorrectOption, setCorrectOption] = useState("");
  const [option, setOption] = useState([]);
  const dispatch = useDispatch();

  function handleAddOption() {
    setOption([...option, ""]);
  }

  function handleOptionChange(index, value) {
    const newOptions = [...option];
    newOptions[index] = value;
    setOption(newOptions);
  }

  function handleSubmitPoll() {
    if (question) {
      const questionData = {
        text: question,
        options: option,
        correctOption: CorrectOption,
      };
      socket.emit("askQuestion", questionData);
      dispatch(setPoll(questionData));
      setQuestion("");
      setOption([]);
      setCorrectOption("");
    }
  }

  socket.on("updateResults", (results) => {
    dispatch(setResults(results));
  });

  return (
    <div>
      <h1>Hello Teacher please create a poll</h1>

      <input
        type="text"
        placeholder="Ask a question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      {option.map((option, index) => (
        <div key={index}>
          <input
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleAddOption}>Add an option</button>
      <div>
        <label>Correct option:</label>
        <select
          value={CorrectOption}
          onChange={(e) => setCorrectOption(e.target.value)}
        >
          <option value="">Select correct option</option>
          {option.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleSubmitPoll}>Submit poll</button>
    </div>
  );
};

export default Teacher;
