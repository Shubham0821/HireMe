import axios from 'axios';

// We create a custom Axios instance instead of calling axios.get() directly.
// This saves us from typing the full URL 100 times!
// We use VITE_API_URL from .env if available (for production), else fallback to localhost.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    withCredentials: true, // IMPORTANT: This tells Axios to ALWAYS attach the HTTP-Only cookie token to every request!
});

export default api;
