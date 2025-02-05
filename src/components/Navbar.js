import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('access_token'); // Fetch JWT token from local storage
      if (!token) {
        console.log("No access token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/current_user/', {
          headers: {
            'Authorization': `Bearer ${token}`, // Set the authorization header
          },
        });
        console.log("Response from /api/current_user:", response.data); // Debugging line
        setCurrentUser(response.data.username); // Set the current user
      } catch (error) {
        console.error('Error fetching current user:', error);
        if (error.response && error.response.status === 401) {
          setError('Unauthorized. Please log in again.');
          localStorage.clear(); // Clear invalid token
          window.location.href = '/login'; // Redirect to login page
        } else {
          setError('Failed to load user data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser(); // Fetch current user data on mount
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token'); // Clear the access token
    localStorage.removeItem('refresh_token'); // Clear the refresh token
    window.location.href = '/login'; // Redirect to login
  };

  return (
    <div className='navbar'>
      <span className='logo'>Chat</span>
      <div className='user'>
        {loading ? (
          <span>Loading...</span> // Show loading state
        ) : error ? (
          <span>{error}</span> // Show error message
        ) : (
          <>
            <span>{currentUser ? currentUser : "Guest"}</span> {/* Display the current username */}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
