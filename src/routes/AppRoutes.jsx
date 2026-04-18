import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import BaseLayout from '../components/layout/BaseLayout';
import { motion, AnimatePresence } from 'framer-motion';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import HomePage from '../pages/guest/HomePage';
import SearchResultsPage from '../pages/guest/SearchResultsPage';
import HotelDetailsPage from '../pages/guest/HotelDetailsPage';
import MyBookingsPage from '../pages/guest/MyBookingsPage';
import SavedGuestsPage from '../pages/guest/SavedGuestsPage';
import ProfilePage from '../pages/guest/ProfilePage';
import SupportPage from '../pages/guest/SupportPage';
import RefundPolicyPage from '../pages/guest/RefundPolicyPage';
import PaymentSuccessPage from '../pages/guest/PaymentSuccessPage';
import PaymentCancelPage from '../pages/guest/PaymentCancelPage';

// Admin Pages
import ManageHotelsPage from '../pages/admin/ManageHotelsPage';
import ManageRoomsPage from '../pages/admin/ManageRoomsPage';
import ManageInventoryPage from '../pages/admin/ManageInventoryPage';
import ReportsPage from '../pages/admin/ReportsPage';
import HotelSummaryPage from '../pages/admin/HotelSummaryPage';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={<BaseLayout />}>
          {/* Shared Route */}
          <Route index element={<HomePage />} />
          
          {/* Guest Routes */}
          <Route path="search" element={<SearchResultsPage />} />
          <Route path="hotels/:hotelId" element={<HotelDetailsPage />} />
          <Route path="bookings" element={<MyBookingsPage />} />
          <Route path="guests" element={<SavedGuestsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="refund-policy" element={<RefundPolicyPage />} />
          <Route path="payments/success" element={<PaymentSuccessPage />} />
          <Route path="payments/cancel" element={<PaymentCancelPage />} />
          
          {/* Manager Routes */}
          <Route path="admin/hotels" element={<ManageHotelsPage />} />
          <Route path="admin/hotels/:hotelId" element={<HotelSummaryPage />} />
          <Route path="admin/hotels/:hotelId/rooms" element={<ManageRoomsPage />} />
          <Route path="admin/hotels/:hotelId/rooms/:roomId/inventory" element={<ManageInventoryPage />} />
          <Route path="admin/reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AnimatedRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;

