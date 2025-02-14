// src/services/apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use(async (config) => {
    let token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (!token) return config;

    const isTokenExpired = (token) => {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp < Date.now() / 1000;
    };

    if (isTokenExpired(token) && refreshToken) {
        try {
            const response = await axios.post(`${API_BASE_URL}token/refresh/`, { refresh: refreshToken });
            const newAccessToken = response.data.access;
            localStorage.setItem('access_token', newAccessToken);
            token = newAccessToken;
        } catch (error) {
            console.error('🔴 Token refresh failed:', error);
            localStorage.clear();
            window.location.href = '/login';
        }
    }

    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
}, (error) => Promise.reject(error));

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}login/`, { email, password });
        return response.data;
    } catch (error) {
        console.error('🔴 Login failed:', error);
        throw error;
    }
};

export default apiClient;
