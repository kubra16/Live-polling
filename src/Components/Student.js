import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPoll, setResults } from "../redux/actions";
import { io } from "socket.io-client";
import PollResults from "./pollResults";
import StudentNavbar from "./StudentNavbar";
import Chat from "./Chat";

const socket = io("http://localhost:5000");

const Student = () => {
  const [answer, setAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [currentSection, setCurrentSection] = useState("polls");
  const [waiting, setWaiting] = useState(true);
  const [kicked, setKicked] = useState(false);
  const question = useSelector((state) => state.currentPoll);
  const userName = useSelector((state) => state.userName);
  const [chat, setChat] = useState([]); // State to hold online users
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

  const handleSubmit = () => {
    if (!kicked && answer) {
      console.log("Submitting answer:", answer);
      socket.emit("submitAnswer", { studentId: userName, answer });
      setHasAnswered(true);
    }
  };

  if (kicked) {
    return (
      <div>
        <h2>You have been kicked out by the teacher.</h2>
      </div>
    );
  }

  return (
    <div>
      <StudentNavbar setCurrentSection={setCurrentSection} />
      {currentSection === "polls" && (
        <div>
          <h1>Student</h1>
          {waiting && (
            <div>
              <h2>Waiting for the poll to start...</h2>
            </div>
          )}
          {!waiting && !hasAnswered && timer > 0 && question && !kicked && (
            <div>
              <h2>{question.text}</h2>
              <div>
                {timer}
                {question.options.map((option, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      id={option}
                      name="answer"
                      value={option}
                      onChange={(e) => setAnswer(e.target.value)}
                    />
                    <label htmlFor={option}>{option}</label>
                  </div>
                ))}
                <button onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          )}
          {!waiting && (hasAnswered || timer === 0) && <PollResults />}
        </div>
      )}
      {currentSection === "chat" && (
        <Chat userName={userName} role="student" student={chat} />
      )}
    </div>
  );
};

export default Student;
