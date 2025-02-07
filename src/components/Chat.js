import React, { useState, useEffect } from 'react';

const Chat = ({ selectedUser }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (selectedUser) {
            const fetchMessages = async () => {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`http://localhost:8000/api/messages/${selectedUser.id}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                }
            };

            fetchMessages();
        }
    }, [selectedUser]);

    const handleSendMessage = async () => {
        const token = localStorage.getItem('authToken');
        const messageData = { content: message, recipient_id: selectedUser.id };

        const response = await fetch('http://localhost:8000/api/send_message/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
        });

        if (response.ok) {
            const data = await response.json();
            setMessages([...messages, data]);
            setMessage('');
        }
    };

    return (
        <div className="chat">
            {selectedUser && <h3>Chatting with {selectedUser.username}</h3>}
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index}>{msg.content}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default Chat;
