import { useRef, useEffect } from "react";

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toDateString();
};

const Message = ({ message, currentUserId }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // ✅ Ensure correct sender comparison
  const isSentByCurrentUser = message.sender_id === currentUserId;

  return (
    <div className="message-wrapper" ref={messagesEndRef}>
      {/* Display Date Separator */}
      <div className="date-separator">{formatDate(message.timestamp)}</div>

      {/* Message Bubble */}
      <div className={`message ${isSentByCurrentUser ? "sent" : "received"}`}>
        {message.text}
      </div>
    </div>
  );
};

export default Message;
