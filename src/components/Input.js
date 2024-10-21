import React, { useState } from 'react';
import AttachIcon from '../assets/Attach.png'; // Ensure the correct relative path

const Input = ({ selectedUser, socket, currentUserId, setMessages }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null); // State for the file
  const [preview, setPreview] = useState(null); // State for the file preview (image)

  // Helper function to upload and read the file as base64
  const handleFileUpload = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file); // Convert to base64
    });
  };

  const handleSendMessage = async () => {
    if (!selectedUser) {
      console.error('No user selected!');
      return;
    }

    if (message.trim() || file) {
      const messageData = {
        message,
        sender_id: currentUserId, // Use the currentUserId prop
        recipient_id: selectedUser.id,
        timestamp: new Date().toISOString(),
      };

      // If a file is attached, process it
      if (file) {
        const fileData = await handleFileUpload(file);
        messageData.file = fileData; // Append the base64 encoded file
      }

      // Debugging line: log the message before sending
      console.log('Message data being sent:', messageData);

      try {
        // Optimistically add the message to the UI before sending via WebSocket
        setMessages((prevMessages) => [...prevMessages, messageData]);

        // Send message via WebSocket
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(messageData)); // Ensure WebSocket connection is open
          console.log('Message sent successfully');
        } else {
          console.error('WebSocket connection is not open');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }

      // Reset input fields
      setMessage('');
      setFile(null);
      setPreview(null); // Reset the preview
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); // Store the selected file in state

    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const previewURL = URL.createObjectURL(selectedFile); // Create a local URL for image preview
      setPreview(previewURL);
    } else {
      setPreview(null); // No preview for non-image files
    }
  };

  return (
    <div className="input" style={{ display: 'flex', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ flexGrow: 1, marginRight: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
      />

      <input
        id="file-input"
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <label htmlFor="file-input">
        <img
          src={AttachIcon}
          alt="Attach"
          style={{ cursor: 'pointer', width: '24px', marginLeft: '10px' }}
        />
      </label>

      {preview ? (
        <div className="preview" style={{ marginLeft: '10px' }}>
          <img src={preview} alt="Preview" style={{ maxHeight: '100px' }} />
        </div>
      ) : (
        file && <p style={{ marginLeft: '10px' }}>{file.name}</p>
      )}

      <button onClick={handleSendMessage} className="input-button">
        Send
      </button>
    </div>
  );
};

export default Input;
