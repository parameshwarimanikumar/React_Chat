import React, { useEffect, useState, useCallback } from 'react';
import Message from './Message';
import axios from 'axios';

const Messages = ({ selectedUser, currentUserId, socket }) => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (selectedUser) {
      setLoading(true);
      setError(null);  // Reset error before making the request
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`http://localhost:8000/api/messages/${selectedUser.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data);
      } catch (error) {
        const errorMessage = error.response?.data?.detail || 'An error occurred while fetching messages.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Listen for new messages via WebSocket
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.recipient_id === currentUserId || data.sender_id === currentUserId) {
          setMessages((prevMessages) => [...prevMessages, data]); // Append new message
        }
      };
    }

    return () => {
      if (socket) {
        socket.onmessage = null;  // Remove the listener on cleanup
      }
    };
  }, [socket, currentUserId]);

  return (
    <div className="messages">
      {selectedUser ? (
        <>
          {loading ? (
            <p>Loading messages...</p>
          ) : error ? (
            <p className="error">Error: {error}</p>
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                isSentByCurrentUser={message.sender.id === currentUserId}
              />
            ))
          ) : (
            <p>No messages yet. Start chatting!</p>
          )}
        </>
      ) : (
        <p>Select a user to start chatting.</p>
      )}
    </div>
  );
};

export default Messages;
