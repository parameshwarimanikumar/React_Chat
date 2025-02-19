import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Message from "./Message";
import "../pages/dashboard.css";

const Messages = ({ selectedUser, currentUserId, socket }) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Fetch previous messages when a user is selected
  useEffect(() => {
    if (!selectedUser || !selectedUser.id) return;

    axios
      .get(`http://localhost:8000/api/messages/${selectedUser.id}/`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error fetching messages:", err));
  }, [selectedUser]);

  // Scroll to bottom when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for incoming messages from socket
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("receive_message", handleMessage);

    return () => socket.off("receive_message", handleMessage);
  }, [socket]);

  return (
    <div className="messages">
      {messages.length === 0 ? (
        <p className="no-messages">No messages yet. Start the conversation!</p>
      ) : (
        messages.map((message, index) => (
          <Message
            key={index}
            message={message}
            isSentByCurrentUser={message.sender === currentUserId}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
