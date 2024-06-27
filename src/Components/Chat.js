import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import styles from "./Chat.module.css"; // Import CSS module styles

const socket = io("http://localhost:5000");

const Chat = ({ userName, role }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineMembers, setOnlineMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");

  useEffect(() => {
    console.log("Registering user:", userName, "with role:", role);
    socket.emit("registerUser", userName, role);

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("receiveMessage", (message) => {
      console.log("Received message:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("updateOnlineUsers", (members) => {
      console.log("Updated online users:", members);
      const filteredMembers = members.filter(
        (member) => member.name !== userName
      );
      setOnlineMembers(filteredMembers);
    });

    // Cleanup on unmount
    return () => {
      console.log("Cleaning up listeners");
      socket.off("receiveMessage");
      socket.off("updateOnlineUsers");
    };
  }, [userName, role]);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const messageData = {
      author: userName,
      content: message,
      recipient: selectedMember,
      timestamp: new Date().toISOString(),
    };
    console.log("Sending message:", messageData);
    socket.emit("sendMessage", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setMessage("");
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.sidebar}>
        <h2>Online Members</h2>
        <ul>
          {onlineMembers.map((member, index) => (
            <li
              key={index}
              className={selectedMember === member.name ? styles.selected : ""}
              onClick={() => setSelectedMember(member.name)}
            >
              {member.name} ({member.role})
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.chatBox}>
        {selectedMember ? (
          <>
            <h2>Chat with {selectedMember}</h2>
            <div className={styles.messages}>
              {messages
                .filter(
                  (msg) =>
                    (msg.author === userName &&
                      msg.recipient === selectedMember) ||
                    (msg.author === selectedMember &&
                      msg.recipient === userName)
                )
                .map((msg, index) => (
                  <div
                    key={index}
                    className={
                      msg.author === userName
                        ? styles.sentMessage
                        : styles.receivedMessage
                    }
                  >
                    <strong>{msg.author}</strong>: {msg.content}
                  </div>
                ))}
            </div>
            <div className={styles.sendMessage}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <h2>Select a member to chat with</h2>
        )}
      </div>
    </div>
  );
};

export default Chat;
