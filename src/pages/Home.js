import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';
import './home.css';

const Home = () => {
    const [selectedUser, setSelectedUser] = useState(null);

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

export default Home;
