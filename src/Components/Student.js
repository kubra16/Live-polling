import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPoll, setResults } from "../redux/actions";
import { io } from "socket.io-client";
import PollResults from "./pollResults";
import StudentNavbar from "./StudentNavbar";
import Chat from "./Chat";
import styles from "./Student.module.css"; // Import CSS module
import Polls from "./Polls";

const socket = io(process.env.REACT_APP_API_URL);

const Student = () => {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [currentSection, setCurrentSection] = useState("polls");
  const [waiting, setWaiting] = useState(true);
  const [kicked, setKicked] = useState(false);
  const question = useSelector((state) => state.currentPoll);
  const userName = useSelector((state) => state.userName);
  const [chat, setChat] = useState([]);
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    console.log("Registering user:", userName);

    socket.emit("registerUser", userName, "student");

    socket.on("newQuestion", (questionData) => {
      console.log("New question received:", questionData);
      dispatch(setPoll(questionData));
      setHasAnswered(false);
      setWaiting(false);
      setKicked(false);
      setTimer(questionData.duration / 1000);
    });

    socket.on("updateOnlineUsers", (onlineUsers) => {
      console.log("Online users updated:", onlineUsers);
      setChat(onlineUsers); // Update online users
    });

    socket.on("updateResults", (resultsData) => {
      console.log("Results updated:", resultsData);
      dispatch(setResults(resultsData));
    });

    socket.on("kicked", () => {
      console.log("You have been kicked out by the teacher.");
      setKicked(true);
      setWaiting(false);
      setHasAnswered(false);
    });

    return () => {
      console.log("Cleaning up socket listeners.");
      socket.off("newQuestion");
      socket.off("updateResults");
      socket.off("kicked");
      socket.off("updateOnlineUsers");
    };
  }, [dispatch, userName]);

  useEffect(() => {
    if (question) {
      const interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [question]);

  const handleCheckboxChange = (option) => {
    setSelectedAnswers((prevAnswers) =>
      prevAnswers.includes(option)
        ? prevAnswers.filter((answer) => answer !== option)
        : [...prevAnswers, option]
    );
  };

  const handleSubmit = () => {
    if (!kicked && selectedAnswers.length > 0) {
      console.log("Submitting answer:", selectedAnswers[0]);
      socket.emit("submitAnswer", {
        studentId: userName,
        answer: selectedAnswers[0],
      });
      setHasAnswered(true);
    }
  };

  if (kicked) {
    return (
      <div className={styles.kickedMessage}>
        <h2>You have been kicked out by the teacher.</h2>
      </div>
    );
  }

  return (
    <div>
      <StudentNavbar setCurrentSection={setCurrentSection} />
      <div className={styles.studentContainer}>
        {currentSection === "polls" && (
          <div>
            <h1 className={styles.header}>Student</h1>
            {waiting && (
              <div className={styles.waitingMessage}>
                <h2>Waiting for the poll to start...</h2>
              </div>
            )}
            {!waiting && !hasAnswered && timer > 0 && question && !kicked && (
              <div className={styles.questionContainer}>
                <h2 className={styles.questionText}>{question.text}</h2>
                <div className={styles.timer}>{timer}</div>
                <div className={styles.optionsContainer}>
                  {question.options.map((option, index) => (
                    <div key={index} className={styles.option}>
                      <input
                        type="checkbox"
                        id={option}
                        name="answer"
                        value={option}
                        checked={selectedAnswers.includes(option)}
                        onChange={() => handleCheckboxChange(option)}
                      />
                      <label htmlFor={option}>{option}</label>
                    </div>
                  ))}
                  <button
                    className={styles.submitButton}
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
            {!waiting && (hasAnswered || timer === 0) && <PollResults />}
          </div>
        )}
        {currentSection === "chat" && (
          <Chat
            socket={socket}
            userName={userName}
            role="student"
            student={chat}
          />
        )}
        {currentSection === "PollsHistory" && <Polls />}
      </div>
    </div>
  );
};

export default Student;
