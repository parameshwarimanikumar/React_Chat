import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Message from "./Message";
import "../pages/dashboard.css";

const Messages = ({ selectedUser, currentUserId, socket }) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Fetch previous messages when a user is selected
  useEffect(() => {
    if (!selectedUser?.id) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/messages/${selectedUser.id}/`);
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUser?.id]);

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

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [socket]);

  // Show the scroll-to-bottom button when the user scrolls up
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollButton(scrollTop + clientHeight < scrollHeight - 50);
    }
  };

  return (
    <div className="messages-container" ref={messagesContainerRef} onScroll={handleScroll}>
      <div className="messages">
        {messages.length === 0 ? (
          <p className="no-messages">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((message) => (
            <Message
              key={message.id || message.timestamp}
              message={message}
              isSentByCurrentUser={message?.sender === currentUserId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          className="scroll-to-bottom"
          onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
        >
          ↓
        </button>
      )}
    </div>
  );
};

export default Messages;