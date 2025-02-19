import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Token Refresh Logic
const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp < Date.now() / 1000;
    } catch (error) {
        console.error('🔴 Invalid Token:', error);
        return true;
    }
};

apiClient.interceptors.request.use(async (config) => {
    let token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (token && isTokenExpired(token)) {
        try {
            const response = await axios.post(`${API_BASE_URL}/token/refresh/`, { refresh: refreshToken });
            token = response.data.access;
            localStorage.setItem('access_token', token);
        } catch (error) {
            console.error('🔴 Token refresh failed:', error);
            localStorage.clear();
            window.location.href = '/login';
            return Promise.reject(error);
        }
    }

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use(
    response => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('🔴 Unauthorized! Redirecting to login...');
            localStorage.clear();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export const loginUser = async (email, password) => {
    try {
        const response = await apiClient.post('/login/', { email, password });
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        return response.data;
    } catch (error) {
        console.error('🔴 Login failed:', error);
        throw error;
    }
};

export default apiClient;
