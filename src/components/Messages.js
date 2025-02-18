import React, { useEffect, useRef, useState } from 'react';
import './src/pages/dashboard.css';

const Messages = ({ selectedUser, currentUserId, socket }) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when a new message is added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (socket) {
      // Listen for incoming messages from socket
      socket.on('receive_message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [socket]);

  return (
    <div className="messages">
      {messages.map((message, index) => (
        <div 
          key={index} 
          className={`message ${message.senderId === currentUserId ? 'sent' : 'received'}`}
        >
          <p>{message.text}</p>
          <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
