import { axiosInstance } from './axiosInstance';

// Booking flow — strict 4-step sequence per FRONTEND_helper.md Section 6
export const bookingApi = {
  // Step 0: fetch existing bookings
  getMyBookings: () => axiosInstance.get('/api/v1/users/myBookings'),

  // Step 1: Initialise booking — returns bookingId
  initBooking: (data) => axiosInstance.post('/api/v1/bookings/init', data),

  // Step 2: Attach saved guests
  addGuests: (bookingId, guestIds) => axiosInstance.post(`/api/v1/bookings/${bookingId}/addGuests`, guestIds),

  // Step 3: Trigger payment intent
  startPayment: (bookingId) => axiosInstance.post(`/api/v1/bookings/${bookingId}/payments`),

  // Step 4: Poll confirmation status
  getStatus: (bookingId) => axiosInstance.post(`/api/v1/bookings/${bookingId}/status`),

  // Cancel
  cancelBooking: (bookingId) => axiosInstance.post(`/api/v1/bookings/${bookingId}/cancel`),
};
