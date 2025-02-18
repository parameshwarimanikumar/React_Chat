import React, { useState, useEffect, useRef } from 'react';
import Img from '../assets/Img.png';

const Chat = ({ selectedUser }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (selectedUser) {
            const fetchMessages = async () => {
                try {
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
                } catch (error) {
                    console.error('Failed to fetch messages:', error);
                }
            };
            fetchMessages();
        }
    }, [selectedUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const messageData = { content: message, recipient_id: selectedUser.id };
            const fileInput = document.getElementById('file-upload');
            const file = fileInput?.files?.[0];

            const formData = new FormData();
            formData.append('message_data', JSON.stringify(messageData));
            if (file) formData.append('image', file);

            const response = await fetch('http://localhost:8000/api/send_message/', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setMessages([...messages, data]);
                setMessage('');
                if (fileInput) fileInput.value = ''; // Clear file input
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <div className="chat">
            {selectedUser && <h3>Chatting with {selectedUser.username}</h3>}
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === selectedUser.id ? 'received' : 'sent'}`}>
                        {msg.content}
                        <span className="timestamp">{msg.timestamp || '12:30 PM'}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                />
                <label htmlFor="file-upload">
                    <img src={Img} alt="Upload" width="30" height="30" />
                </label>
                <input id="file-upload" type="file" accept="image/*" />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
