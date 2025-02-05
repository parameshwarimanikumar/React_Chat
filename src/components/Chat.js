import React, { useEffect, useState } from 'react';
import Cam from '../assets/Cam.jpg';  
import Add from '../assets/Add.png';
import More from '../assets/More.png';
import Messages from './Messages';  
import Input from './Input';  

const Chat = ({ selectedUser, currentUserId, socket, isTyping }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get JWT token from localStorage
    const token = localStorage.getItem('access_token'); 

    // Fetch current user data from the updated endpoint
    fetch('/api/current_user/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,  // Add JWT token to headers
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setCurrentUser(data);  // Set the fetched current user data
      })
      .catch(error => console.error('Error fetching current user:', error));
  }, []);  // Empty dependency array means this runs once on mount

  console.log("Selected User:", selectedUser);  // Log selected user details
  console.log("Current User:", currentUser);  // Log current user details

  return (
    <div className='chat'>
      <div className='chatInfo'>
        {selectedUser ? (
          <div className="chatHeader">
            <img
              src={selectedUser.profile_picture || Cam}  // Use selectedUser.profile_picture for the profile image
              alt={`${selectedUser.username} avatar`} 
              className="userAvatar"  // Ensure the class name matches the CSS
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

      {/* Display current user info */}
      {currentUser && (
        <div className="currentUserInfo">
          <h4>{currentUser.username}</h4>
          <img src={currentUser.profile_picture || Cam} alt="Current User Avatar" />
        </div>
      )}

      <Messages selectedUser={selectedUser} currentUserId={currentUserId} socket={socket} />
      {isTyping && <div className="typingIndicator">Typing...</div>}
      <Input selectedUser={selectedUser} currentUserId={currentUserId} socket={socket} />
    </div>
  );
};

export default Chat;
