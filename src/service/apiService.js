// apiService.js

import axios from 'axios';

const fetchUserData = async () => {
    const token = localStorage.getItem('authToken');

    try {
        const response = await axios.get('http://localhost:8000/api/users/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

export { fetchUserData };
