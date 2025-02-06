import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/';
const token = localStorage.getItem('access_token'); // Retrieve the token

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
    }
});

export const fetchCurrentUser = async () => {
    try {
        const response = await apiClient.get('current_user/');
        return response.data;
    } catch (error) {
        console.error('Error fetching current user:', error.response);
        return null;
    }
};

export const fetchUsers = async () => {
    try {
        const response = await apiClient.get('users/');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error.response);
        return null;
    }
};
