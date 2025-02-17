import React, { useState, useEffect } from 'react';  // Add this import for useState and useEffect
import axios from 'axios';  // Add this import for axios

const Chats = ({ onSelectUser }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://localhost:8000/api/users/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                setError(error.response ? error.response.data.detail : error.message);
            }
        };

        fetchUsers();
    }, []);

    const handleUserClick = (user) => {
        onSelectUser(user); // Trigger user selection
    };

    return (
        <div className="chats">
            {error && <p className="error">Error: {error}</p>}
            {users.length === 0 && !error ? (
                <p>No users found.</p>
            ) : (
                users.map(user => (
                    <div
                        className="userChat"
                        key={user.id}
                        onClick={() => handleUserClick(user)}
                    >
                        <div className="userChatInfo">
                            <img
                                src={user.profile_picture_url || '/assets/default-avatar.jpeg'} 
                                alt={user.username}
                                className="userAvatar"
                            />
                            <span className="username">{user.username}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Chats;
