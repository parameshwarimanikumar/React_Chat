import React, { useState, useEffect, useRef, useCallback } from "react";
import Img from "../assets/Img.png";
import api from "../services/apiService";

const Chat = ({ selectedUser }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
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
        if (!selectedUser || !message.trim()) {
            console.error("🚨 Missing recipient or message content");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("recipient_id", selectedUser.id);
            formData.append("content", message);

            const fileInput = document.getElementById("file-upload");
            const file = fileInput?.files?.[0];

            if (file) {
                formData.append("file", file);
            }

            const response = await api.post("send_message/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 201) {
                setMessages([...messages, response.data]);
                setMessage("");
                if (fileInput) fileInput.value = "";
            }
        } catch (error) {
            console.error("Failed to send message:", error.response?.data || error.message);
        }
    };

    return (
        <div className="chat">
            {selectedUser && <h3>Chatting with {selectedUser.username}</h3>}
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === selectedUser.id ? "received" : "sent"}`}>
                        {msg.content}
                        <span className="timestamp">{msg.timestamp || "12:30 PM"}</span>
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
