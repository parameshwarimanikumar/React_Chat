// Dashboard Component
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className='home'>
      <div className='container'>
        <Sidebar onSelectUser={handleSelectUser} />
        <Chat selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default Dashboard;
