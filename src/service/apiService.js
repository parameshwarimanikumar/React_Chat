import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/';

// Create Axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 🔥 Automatically attach token to requests (except login)
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');

    // 🚨 Skip Authorization header for login endpoint
    if (!config.url.includes('login/') && token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
}, (error) => Promise.reject(error));

// ✅ Login User
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}login/`, { email, password }, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 200) {
            const { access, refresh, username } = response.data;
            if (access) {
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
                localStorage.setItem('username', username);
                console.log("Token stored:", access);
                return response.data;
            }
        }
        return null;
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        return null;
    }
};

// ✅ Fetch Current User
export const fetchCurrentUser = async () => {
    try {
        const response = await apiClient.get('current_user/');
        return response.data;
    } catch (error) {
        console.error('Error fetching current user:', error.response?.data || error.message);
        return null;
    }
};

// ✅ Fetch All Users
export const fetchUsers = async () => {
    try {
        const response = await apiClient.get('users/');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error.response?.data || error.message);
        return null;
    }
};

// ✅ Logout User (Clear Token)
export const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    console.log("User logged out.");
};

// ✅ Check if User is Authenticated
export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
};

export default apiClient;
