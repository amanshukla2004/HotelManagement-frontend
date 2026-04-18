import { axiosInstance } from './axiosInstance';

export const authApi = {
  userRegister: (data) => axiosInstance.post('/api/v1/auth/user/register', data),
  userLogin: (data) => axiosInstance.post('/api/v1/auth/user/login', data),
  managerRegister: (data) => axiosInstance.post('/api/v1/auth/manager/register', data),
  managerLogin: (data) => axiosInstance.post('/api/v1/auth/manager/login', data),
  logout: () => {
    // In a real app, you might have a backend logout endpoint to clear the HttpOnly cookie.
    // For now, we clear the local token.
    localStorage.removeItem('accessToken');
  }
};

export const userProfileApi = {
  getProfile: () => axiosInstance.get('/api/v1/users/profile'),
  updateProfile: (data) => axiosInstance.patch('/api/v1/users/profile', data)
};
