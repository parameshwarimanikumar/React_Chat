import React, { useEffect, useState } from "react";
import apiClient from '../services/apiService';

const Sidebar = ({ onSelectUser }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apiClient.get('users/');
                const currentUser = localStorage.getItem('username');
                const filteredUsers = response.data.filter(user => user.username !== currentUser);
                setUsers(filteredUsers);
            } catch (error) {
                console.error('🔴 Failed to fetch users:', error.response?.data || error.message);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="sidebar">
            <h2>Chats</h2>
            <ul>
                {users.length > 0 ? (
                    users.map((user) => (
                        <li key={user.id} onClick={() => onSelectUser(user)}>
                            <img src={user.profile_picture || '/default-avatar.png'} alt="Avatar" className="avatar"/>
                            <div>
                                <span className="username">{user.username}</span>
                                
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No users found</p>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
