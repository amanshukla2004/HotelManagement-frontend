import { axiosInstance } from './axiosInstance';

// ─── Public Hotel Browsing ─────────────────────────────────────────────────────
// Section 5 of FRONTEND_helper.md — no auth required
export const hotelApi = {
  // GET /api/v1/hotels/search?city=&startDate=&endDate=&roomsCount=&page=&size=
  searchHotels: (params) => axiosInstance.get('/api/v1/hotels/search', { params }),

  // GET /api/v1/hotels/{hotelId}/info → { hotel: HotelDto, rooms: RoomDto[] }
  getHotelInfo: (hotelId) => axiosInstance.get(`/api/v1/hotels/${hotelId}/info`),
};

// ─── Manager Hotel Operations (Section 7 of FRONTEND_helper.md) ───────────────
export const adminHotelApi = {
  // Hotel CRUD
  getMyHotels:    ()                   => axiosInstance.get('/api/v1/admin/hotels'),
  createHotel:    (data)               => axiosInstance.post('/api/v1/admin/hotels', data),
  updateHotel:    (hotelId, data)      => axiosInstance.put(`/api/v1/admin/hotels/${hotelId}`, data),
  deleteHotel:    (hotelId)            => axiosInstance.delete(`/api/v1/admin/hotels/${hotelId}`),
  toggleActivate: (hotelId)            => axiosInstance.patch(`/api/v1/admin/hotels/${hotelId}/activate`, null, { timeout: 240000 }),

  // Analytics — Section 7
  // GET /api/v1/admin/hotels/{hotelId}/bookings
  getHotelBookings: (hotelId)          => axiosInstance.get(`/api/v1/admin/hotels/${hotelId}/bookings`),
  // GET /api/v1/admin/hotels/{hotelId}/reports?startDate=&endDate=
  // → { bookingCount, totalRevenue, avgRevenue }
  getReports:     (hotelId, params)    => axiosInstance.get(`/api/v1/admin/hotels/${hotelId}/reports`, { params }),

  // Room CRUD — Section 8
  // GET /api/v1/admin/hotels/{hotelId}/rooms
  getRooms:       (hotelId)            => axiosInstance.get(`/api/v1/admin/hotels/${hotelId}/rooms`),
  // POST /api/v1/admin/hotels/{hotelId}/rooms
  createRoom:     (hotelId, data)      => axiosInstance.post(`/api/v1/admin/hotels/${hotelId}/rooms`, data),
  // PUT /api/v1/admin/hotels/{hotelId}/rooms/{roomId}
  updateRoom:     (hotelId, roomId, data) => axiosInstance.put(`/api/v1/admin/hotels/${hotelId}/rooms/${roomId}`, data),
  // DELETE /api/v1/admin/hotels/{hotelId}/rooms/{roomId}
  deleteRoom:     (hotelId, roomId)    => axiosInstance.delete(`/api/v1/admin/hotels/${hotelId}/rooms/${roomId}`),

  // Inventory — Section 8
  // GET /api/v1/admin/inventory/rooms/{roomId}
  getInventory:   (roomId)             => axiosInstance.get(`/api/v1/admin/inventory/rooms/${roomId}`),
  // PATCH /api/v1/admin/inventory/rooms/{roomId}
  // Body: { startDate, endDate, surgeFactor, price, closed }
  updateInventory:(roomId, data)       => axiosInstance.patch(`/api/v1/admin/inventory/rooms/${roomId}`, data),
};
