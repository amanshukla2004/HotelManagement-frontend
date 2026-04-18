import { axiosInstance } from './axiosInstance';

// Guest management — per FRONTEND_helper.md Section 4
export const guestApi = {
  createGuest: (data) => axiosInstance.post('/api/v1/guests', data),
  getGuests: () => axiosInstance.get('/api/v1/guests'),
  updateGuest: (guestId, data) => axiosInstance.put(`/api/v1/guests/${guestId}`, data),
  deleteGuest: (guestId) => axiosInstance.delete(`/api/v1/guests/${guestId}`),
};
