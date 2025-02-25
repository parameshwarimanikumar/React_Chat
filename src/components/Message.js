import { useRef, useEffect } from "react";

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toDateString();
};

const Message = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages">
      {messages.map((message, index) => (
        <div key={message.id}>
          {/* Display date separator if it's a new day */}
          {index === 0 || formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp) ? (
            <div className="date-separator">{formatDate(message.timestamp)}</div>
          ) : null}

          {/* Message Bubble */}
          <div className={`message ${message.sender.id === currentUserId ? "sent" : "received"}`}>
            {message.text}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Message;
