import React, { useState, useEffect, useRef, useCallback } from "react";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import Img from "../assets/Img.png";
import api from "../services/apiService";
import "../pages/dashboard.css";

const Chat = ({ selectedUser, currentUserId, socket }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    // ✅ Fetch messages from the backend
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
        if (selectedUser) fetchMessages();
    }, [fetchMessages, selectedUser]);

    // ✅ WebSocket listener for new messages
    const handleMessage = useCallback((newMessage) => {
        if (newMessage?.id && !messages.some((msg) => msg.id === newMessage.id)) {
            setMessages((prev) => [...prev, newMessage]);
        }
    }, [messages]);

    useEffect(() => {
        if (!socket) return;
        socket.on("receive_message", handleMessage);
        return () => socket.off("receive_message", handleMessage);
    }, [socket, handleMessage]);

    // ✅ Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ✅ Handle sending messages
    const handleSendMessage = async () => {
        if (!selectedUser || (!message.trim() && !selectedFile)) return;

        try {
            const formData = new FormData();
            formData.append("recipient_id", selectedUser.id);
            if (message.trim()) formData.append("content", message);
            if (selectedFile) formData.append("file", selectedFile);

            const response = await api.post("send_message/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 201) {
                setMessages((prev) => [...prev, response.data]);
                setMessage("");
                setSelectedFile(null);
                setPreview(null);
            }
        } catch (error) {
            console.error("Failed to send message:", error.response?.data || error.message);
        }
    };

    // ✅ Handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    // ✅ Remove selected file before sending
    const removeSelectedFile = () => {
        setSelectedFile(null);
        setPreview(null);
    };

    // ✅ Handle deleting a message
    const handleDeleteMessage = async (messageId) => {
        try {
            await api.delete(`delete_message/${messageId}/`);
            setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        } catch (error) {
            console.error("Failed to delete message:", error.response?.data || error.message);
        }
    };

    // ✅ Handle scroll button visibility
    const handleScroll = () => {
        if (!messagesContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        setShowScrollButton(scrollTop + clientHeight < scrollHeight - 50);
    };

    if (!selectedUser) {
        return <div className="chat-container">Please select a user to start chatting</div>;
    }

    return (
        <div className="chat-container">
            {/* ✅ Chat Header */}
            <div className="chat-header">
                <h3>{selectedUser.username}</h3>
            </div>

            {/* ✅ Messages List */}
            <div className="chat-messages" ref={messagesContainerRef} onScroll={handleScroll}>
                {messages.length === 0 ? (
                    <p className="no-messages">No messages yet. Start the conversation!</p>
                ) : (
                    messages.map((msg, index) => {
                        const { id, content, file, sender, timestamp } = msg;
                        const msgTimestamp = timestamp ? parseISO(timestamp) : new Date();
                        const isSentByCurrentUser = sender?.id === currentUserId;

                        return (
                            <React.Fragment key={id}>
                                {/* ✅ Date Separator */}
                                {index === 0 || format(parseISO(messages[index - 1].timestamp), "yyyy-MM-dd") !== format(msgTimestamp, "yyyy-MM-dd") ? (
                                    <div className="date-header">
                                        {isToday(msgTimestamp)
                                            ? "Today"
                                            : isYesterday(msgTimestamp)
                                            ? "Yesterday"
                                            : format(msgTimestamp, "dd MMM yyyy")}
                                    </div>
                                ) : null}

                                {/* ✅ Message Bubble */}
                                <div className={`message ${isSentByCurrentUser ? "sent" : "received"}`}>
                                    {file ? (
                                        file.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i) ? (
                                            <img src={file} alt="Uploaded" className="message-img" />
                                        ) : (
                                            <a href={file} download>{file.split("/").pop()}</a>
                                        )
                                    ) : (
                                        <p>{content}</p>
                                    )}
                                    <span className="timestamp">{format(msgTimestamp, "hh:mm a")}</span>

                                    {isSentByCurrentUser && (
                                        <button className="delete-btn" onClick={() => handleDeleteMessage(id)}>❌</button>
                                    )}
                                </div>
                            </React.Fragment>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* ✅ Scroll to Bottom Button */}
            {showScrollButton && (
                <button className="scroll-to-bottom" onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}>
                    ↓
                </button>
            )}

            {/* ✅ Chat Input */}
            <div className="chat-input">
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />

                {/* ✅ File Upload */}
                <label htmlFor="file-upload">
                    <img src={Img} alt="Upload" width="30" height="30" />
                </label>
                <input id="file-upload" type="file" accept="image/*, application/pdf" onChange={handleFileChange} />

                {/* ✅ Show Image Preview */}
                {preview && <img src={preview} alt="Preview" className="preview-img" height={30} width={30} />}
                {selectedFile && !preview && <p>{selectedFile.name}</p>}
                
                {selectedFile && <button onClick={removeSelectedFile}>❌</button>}

                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
