import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Search = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users/');
        setUsers(response.data);
      } catch (error) {
        setError('Error fetching user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='search'>
      <div className='searchForm'>
        <input
          type='text'
          placeholder='Find or search a user'
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      {loading && <p>Loading users...</p>}
      {error && <p className='error'>{error}</p>}
      {/* Only render user list if searchTerm has a value */}
      {searchTerm && (
        <div className='userChat'>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div key={user.id} className='userChatInfo'>
                <img
                  src={user.profile_picture || '/assets/default-avatar.jpeg'}
                  alt={user.username}
                  className='userAvatar'
                />
                <div className='userChatDetails'>
                  <span>{user.username}</span>
                </div>
              </div>
            ))
          ) : (
            <div className='noResults'>
              <p>No users found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
