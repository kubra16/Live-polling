import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useDispatch } from "react-redux";
import { setPoll, setResults } from "../redux/actions";
import PollResults from "./pollResults";
import TeacherNavbar from "./TeacherNavbar";
import Chat from "./Chat";
import style from "./Teacher.module.css";
import Polls from "./Polls";

const socket = io(process.env.REACT_APP_API_URL);

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

  const handleKickStudent = (studentName) => {
    socket.emit("kickStudent", studentName);
  };

  return (
    <div className={style.teacherContainer}>
      <TeacherNavbar setCurrentSection={setCurrentSection} />
      {currentSection === "polls" && (
        <div>
          <input
            className={style.input}
            type="text"
            placeholder="Ask a question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          {options.map((option, index) => (
            <div key={index}>
              <input
                className={style.options}
                type="text"
                value={option}
                placeholder="Add an option"
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
            </div>
          ))}
          <button className={style.submitButton} onClick={handleAddOption}>
            Add an option
          </button>
          <div>
            <label className={style.label}>Correct option:</label>
            <select
              value={correctOption}
              onChange={(e) => setCorrectOption(e.target.value)}
              className={style.select}
            >
              <option value="">Select correct option</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className={style.durationContainer}>
            <label className={style.label}>Poll duration (seconds):</label>
            <input
              className={style.duration}
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <button className={style.SubmitPoll} onClick={handleSubmitPoll}>
            Submit poll
          </button>
          <PollResults />
        </div>
      )}
      {currentSection === "chat" && (
        <Chat
          socket={socket}
          userName="Teacher"
          role="teacher"
          student={students}
        />
      )}
      {currentSection === "PollsHistory" && <Polls />}

      {currentSection === "students" && (
        <div className={style.container}>
          <h2 className={style.header}>Active Students</h2>
          <ul className={style.studentList}>
            {students.map((student, index) => (
              <li key={index} className={style.studentListItem}>
                {student.name}
                <button
                  className={style.kickButton}
                  onClick={() => handleKickStudent(student.name)}
                >
                  Kick
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Teacher;
