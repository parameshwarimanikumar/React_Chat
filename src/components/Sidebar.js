import React, { useState, useEffect } from 'react';

const Sidebar = ({ onSelectUser }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:8000/api/users/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data.filter(user => user.username !== localStorage.getItem('username')));
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="sidebar">
            <h3>Users</h3>
            {users.map((user) => (
                <div key={user.id} onClick={() => onSelectUser(user)}>
                    <span>{user.username}</span>
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
