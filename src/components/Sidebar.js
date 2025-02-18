import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ onSelectUser, currentUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get('users/');
        // Only filter if currentUser is defined
        const filteredUsers = currentUser
          ? response.data.filter(user => user.username !== currentUser)
          : response.data;
        setUsers(filteredUsers);
      } catch (error) {
        console.error('🔴 Failed to fetch users:', error.response?.data || error.message);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUser]);

  const filteredUsers = users.filter(user =>
    (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/'); // Redirect to login page using React Router
  };

  return (
    <div className="sidebar">
      <div className="sidebar-nav">
        <h2>Chats</h2>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      <input
        type="text"
        placeholder="Search or start a new chat"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
        aria-label="Search users"
      />

      {loading && <p>Loading users...</p>}
      {error && <p className="error">{error}</p>}

      <ul>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <li key={user.id} onClick={() => onSelectUser(user)}>
              <img
                src={user.profile_picture || '/default-avatar.png'}
                alt="Avatar"
                className="avatar"
              />
              <div>
                <span className="username">{user.username}</span>
              </div>
            </li>
          ))
        ) : (
          !loading && !error && <p>No users found</p>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
