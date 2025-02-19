import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Search from './Search'; // Import Search component
import Chats from './Chats';
import '../pages/dashboard.css';

const Sidebar = ({ onSelectUser, currentUser }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // For search results
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('No token found. Please log in.');

        const response = await axios.get('http://localhost:8000/api/users/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Remove the current user from the list
        const filtered = currentUser
          ? response.data.filter(user => user.username !== currentUser)
          : response.data;
          
        setUsers(filtered);
        setFilteredUsers(filtered); // Default to all users
      } catch (error) {
        console.error('🔴 Failed to fetch users:', error.response?.data || error.message);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUser]);

  // Handle search updates
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredUsers(users); // Reset to full list
    } else {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  return (
    <div className="sidebar">
      <Navbar /> {/* Navbar remains at the top */}
      <Search onSearch={handleSearch} /> {/* Search bar */}
      <Chats users={filteredUsers} loading={loading} error={error} onSelectUser={onSelectUser} />
    </div>
  );
};

export default Sidebar;
