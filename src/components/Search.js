import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './src/pages/dashboard.css';

const Search = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users/');
        console.log('Fetched Users:', response.data); // Debugging log
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Error fetching user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle search input
  const handleSearch = (event) => {
    const value = event.target.value;
    console.log('Search Term:', value); // Debugging log
    setSearchTerm(value);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find or search a user"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Show loading or error messages */}
      {loading && <p>Loading users...</p>}
      {error && <p className="error">{error}</p>}

      {/* Display users only if searchTerm is not empty */}
      {searchTerm && (
        <div className="userChat">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div key={user.id} className="userChatInfo">
                <img
                  src={user.profile_picture || '/assets/default-avatar.jpeg'}
                  alt={user.username}
                  className="userAvatar"
                />
                <div className="userChatDetails">
                  <span>{user.username}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="noResults">
              <p>No users found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
