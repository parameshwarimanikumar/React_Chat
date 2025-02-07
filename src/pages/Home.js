import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            // If no token, redirect to login page
            navigate('/');
        }
    }, [navigate]);

    const handleSelectUser = (user) => {
        setSelectedUser(user); // Update selected user
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

export default Home;
