import React from 'react';
import Cam from '../assets/Cam.jpg';  
import Add from '../assets/Add.png';
import More from '../assets/More.png';

import Messages from './Messages';  
import Input from './Input';  

const Chat = ({ selectedUser, currentUserId, socket }) => {
  return (
    <div className='chat'>
      <div className='chatInfo'>
        {selectedUser ? <span>Chat with {selectedUser.username}</span> : <span>No user selected</span>}
        <div className='chatIcons'>
          <img src={Cam} alt="Camera" />
          <img src={Add} alt="Add" />
          <img src={More} alt="More" />
        </div>
      </div>

      <Messages selectedUser={selectedUser} currentUserId={currentUserId} socket={socket} />
      <Input selectedUser={selectedUser} currentUserId={currentUserId} socket={socket} />
    </div>
  );
};

export default Chat;
