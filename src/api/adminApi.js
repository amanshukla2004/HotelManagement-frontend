import { axiosInstance } from './axiosInstance';

export const adminApi = {
  getProfile: () => axiosInstance.get('/api/v1/admin/profile'),
  updateProfile: (data) => axiosInstance.patch('/api/v1/admin/profile', data),
};
