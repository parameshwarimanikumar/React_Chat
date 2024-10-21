import React from 'react';

const Message = ({ message, isSentByCurrentUser }) => {
  return (
    <div className={isSentByCurrentUser ? 'message message--sent' : 'message message--received'}>
      <div className="message__info">
        <p className="message__body">{message.body}</p>
        <span className="message__timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default Message;
