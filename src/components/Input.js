import React, { useState } from 'react';
import { FaPaperPlane, FaImage, FaPaperclip } from 'react-icons/fa';  // Import icons

const Input = ({ selectedUser, currentUserId, socket }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);

  const sendMessage = () => {
    if (message.trim() || file) {
      const newMessage = {
        text: message,
        senderId: currentUserId,
        receiverId: selectedUser.id,
        timestamp: Date.now(),
        file,  // Optionally include file if it's uploaded
      };
      socket.emit('send_message', newMessage);
      setMessage('');
      setFile(null);  // Clear file input after sending
    }
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <input
        type="file"
        id="fileUpload"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <label htmlFor="fileUpload">
        <FaPaperclip className="icon" title="Send file" />
      </label>
      <label htmlFor="fileUpload">
        <FaImage className="icon" title="Send image" />
      </label>
      <button onClick={sendMessage}>
       Send <FaPaperPlane />
      </button>
    </div>
  );
};

export default Input;
