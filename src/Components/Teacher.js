import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useDispatch } from "react-redux";
import { setPoll, setResults } from "../redux/actions";
import PollResults from "./pollResults";
import TeacherNavbar from "./TeacherNavbar";
import Chat from "./Chat";

const socket = io("http://localhost:5000");

const Teacher = () => {
  const [question, setQuestion] = useState("");
  const [correctOption, setCorrectOption] = useState("");
  const [currentSection, setCurrentSection] = useState("polls");
  const [options, setOptions] = useState([]);
  const [duration, setDuration] = useState(60);
  const [students, setStudents] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.emit("registerUser", "Teacher", "teacher");

    socket.on("updateResults", (results) => {
      dispatch(setResults(results));
    });

    socket.on("updateOnlineUsers", (onlineUsers) => {
      setStudents(onlineUsers.filter((user) => user.role === "student"));
    });

    return () => {
      socket.off("updateResults");
      socket.off("updateOnlineUsers");
    };
  }, [dispatch]);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmitPoll = () => {
    if (question && options.length > 0 && correctOption) {
      const questionData = {
        text: question,
        options: options.filter((option) => option.trim() !== ""),
        correctOption: correctOption,
        duration: duration * 1000,
      };
      socket.emit("askQuestion", questionData);
      dispatch(setPoll(questionData));
      setQuestion("");
      setOptions([]);
      setCorrectOption("");
    }
  };

  const handleKickStudent = (studentId) => {
    socket.emit("kickStudent", studentId);
  };

  return (
    <div>
      <TeacherNavbar setCurrentSection={setCurrentSection} />
      {currentSection === "polls" && (
        <div>
          <input
            type="text"
            placeholder="Ask a question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          {options.map((option, index) => (
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
              value={correctOption}
              onChange={(e) => setCorrectOption(e.target.value)}
            >
              <option value="">Select correct option</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Poll duration (seconds):</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <button onClick={handleSubmitPoll}>Submit poll</button>
          <PollResults />
        </div>
      )}
      {currentSection === "chat" && (
        <Chat userName="Teacher" role="teacher" student={students} />
      )}
      {currentSection === "students" && (
        <div>
          <h2>Active Students</h2>
          <ul>
            {students.map((student, index) => (
              <li key={index}>
                {student.name} {/* Display student name */}
                <button onClick={() => handleKickStudent(student.name)}>
                  Kick
                </button>{" "}
                {/* Pass student name to kick function */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Teacher;
