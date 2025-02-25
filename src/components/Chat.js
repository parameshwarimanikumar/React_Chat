import React, { useState, useEffect, useRef, useCallback } from "react";
import Img from "../assets/Img.png";
import api from "../services/apiService";

const Chat = ({ selectedUser }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const messagesEndRef = useRef(null);

    const fetchMessages = useCallback(async () => {
        if (!selectedUser) return;
        try {
            const response = await api.get(`messages/${selectedUser.id}/`);
            setMessages(response.data);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    }, [selectedUser]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!selectedUser || (!message.trim() && !selectedFile)) {
            console.error("🚨 Missing recipient, message content, or file");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("recipient_id", selectedUser.id);
            if (message.trim()) formData.append("content", message);
            if (selectedFile) formData.append("file", selectedFile);

            const response = await api.post("send_message/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 201) {
                setMessages([...messages, response.data]);
                setMessage("");
                setSelectedFile(null);
            }
        } catch (error) {
            console.error("Failed to send message:", error.response?.data || error.message);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            await api.delete(`delete_message/${messageId}/`);
            setMessages(messages.filter((msg) => msg.id !== messageId));
        } catch (error) {
            console.error("Failed to delete message:", error.response?.data || error.message);
        }
    };

    return (
        <div className="chat-container">
            {selectedUser && <div className="chat-header">
                <h3>{selectedUser.username}</h3>
            </div>}

            <div className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.sender === selectedUser.id ? "received" : "sent"}`}>
                        {msg.file ? (
                            msg.file.match(/.(jpeg|jpg|png|gif|bmp|webp)$/i) ? (
                                <img src={msg.file} alt="Uploaded" className="message-img" />
                            ) : (
                                <a href={msg.file} download>{msg.file.split("/").pop()}</a>
                            )
                        ) : (
                            <p>{msg.content}</p>
                        )}
                        <span className="timestamp">{msg.timestamp || "12:30 PM"}</span>
                        
                        {msg.sender !== selectedUser.id && (
                            <button className="delete-btn" onClick={() => handleDeleteMessage(msg.id)}>❌</button>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <label htmlFor="file-upload">
                    <img src={Img} alt="Upload" width="30" height="30" />
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept="*/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                {selectedFile && <p>{selectedFile.name}</p>}
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
