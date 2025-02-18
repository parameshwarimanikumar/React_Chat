import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './src/pages/dashboard.css';

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log("No access token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/current_user/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log("Response from /api/current_user:", response.data);
        setCurrentUser(response.data.username || 'Guest'); // Set the username or Guest if missing
      } catch (error) {
        console.error('Error fetching current user:', error);
        if (error.response && error.response.status === 401) {
          setError('Unauthorized. Please log in again.');
          localStorage.clear(); // Clear invalid token
          navigate('/login'); // Redirect to login page using React Router
        } else {
          setError('Failed to load user data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser(); // Fetch current user data on mount
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token'); // Clear the access token
    localStorage.removeItem('refresh_token'); // Clear the refresh token
    navigate('/'); // Redirect to login page using React Router
  };

  return (
    <div className="navbar">
      <span className="logo">Chat</span>
      <div className="user">
        {loading ? (
          <span>Loading...</span>
        ) : error ? (
          <span>{error}</span>
        ) : (
          <>
            <span>{currentUser ? currentUser : 'Guest'}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
