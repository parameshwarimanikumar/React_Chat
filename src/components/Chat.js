import React from 'react';
import Cam from '../assets/Cam.jpg';  
import Add from '../assets/Add.png';
import More from '../assets/More.png';

import Messages from './Messages';  
import Input from './Input';  

const Chat = ({ selectedUser, currentUserId, socket, isTyping }) => {
  return (
    <div className='chat'>
      <div className='chatInfo'>
        {selectedUser ? (
          <div className="chatHeader">
            <img
              src={selectedUser.avatar || Cam} // Use selectedUser.avatar for the profile image
              alt={`${selectedUser.username} avatar`} 
              className="userAvatar" // Ensure the class name matches the CSS
            />
            <div className="userDetails">
              <span>{selectedUser.username}</span>
              <span className="status">{selectedUser.isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        ) : (
          <span>No user selected</span>
        )}
        <div className='chatIcons'>
          <img src={Cam} alt="Camera" />  {/* Camera icon for other actions */}
          <img src={Add} alt="Add" />
          <img src={More} alt="More" />
        </div>
      </div>

      <Messages selectedUser={selectedUser} currentUserId={currentUserId} socket={socket} />
      {isTyping && <div className="typingIndicator">Typing...</div>}
      <Input selectedUser={selectedUser} currentUserId={currentUserId} socket={socket} />
    </div>
  );
};

export default Chat;
