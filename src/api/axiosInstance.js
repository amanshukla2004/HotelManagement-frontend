import axios from 'axios';

// In production, uses the deployed backend URL from .env (VITE_API_BASE_URL).
// In local dev, falls back to '' to leverage the Vite proxy (same-origin, no CORS).
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';



export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Crucial for sending/receiving the HttpOnly refresh token cookie
});

// Request Interceptor: Attach Access Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    // Sanitize token check: ensure it's not null, undefined, or empty, and contains at least one period (JWT format)
    if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '' && token.includes('.')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 and Token Refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('Access Token expired. Attempting silent refresh...');

      try {
        // Attempt to refresh token using the HttpOnly cookie
        const refreshResponse = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, {}, {
          withCredentials: true
        });

        // Backend might return { accessToken } or { data: { accessToken } }
        const newAccessToken = refreshResponse.data?.accessToken || refreshResponse.data?.data?.accessToken;

        if (!newAccessToken) {
           console.error('Refresh failed: No accessToken found in response structure.', refreshResponse.data);
           throw new Error('No access token in refresh response');
        }

        console.log('Silent refresh successful. Resuming session...');
        
        // Save new token
        localStorage.setItem('accessToken', newAccessToken);

        // Update authorization header for the retried request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Session expired or Refresh Token invalid. Redirecting to login...', refreshError);
        // If refresh fails, clear state and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('activeRole');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
