import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/current_user/');
        setCurrentUser(response.data);
      } catch (error) {
        setError(error.response ? error.response.data.detail : error.message);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
