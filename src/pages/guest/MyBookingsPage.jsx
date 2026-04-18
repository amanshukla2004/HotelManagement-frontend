import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { bookingApi } from '../../api/bookingApi';
import {
   CalendarCheck, Loader2, ServerCrash, XCircle,
   CheckCircle2, Clock, MapPin, BedDouble, ChevronRight,
   Receipt, ArrowRight, Building2, CreditCard, ShieldCheck, RefreshCw, ArrowLeft
} from 'lucide-react';

const STATUS_CONFIG = {
   RESERVED: { label: 'Reserved', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: <Clock size={12} /> },
   GUESTS_ADDED: { label: 'Processing', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: <Clock size={12} /> },
   PAYMENTS_PENDING: { label: 'Awaiting Payment', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: <CreditCard size={12} /> },
   CONFIRMED: { label: 'Active Stay', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', icon: <ShieldCheck size={12} /> },
   CANCELLED: { label: 'Cancelled', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', icon: <XCircle size={12} /> },
   EXPIRED: { label: 'Expired', color: 'text-gray-500', bg: 'bg-gray-100', border: 'border-gray-200', icon: <XCircle size={12} /> },
};

const SkeletonCard = () => (
   <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row items-center gap-8 animate-pulse">
      <div className="w-full md:w-32 h-32 rounded-[2rem] bg-gray-50" />
      <div className="flex-1 space-y-4">
         <div className="h-4 bg-gray-50 rounded w-1/4" />
         <div className="h-6 bg-gray-50 rounded w-1/2" />
         <div className="flex gap-2">
            <div className="h-6 w-20 bg-gray-50 rounded-lg" />
            <div className="h-6 w-20 bg-gray-50 rounded-lg" />
         </div>
      </div>
      <div className="h-10 w-32 bg-gray-50 rounded-xl" />
   </div>
);

const MyBookingsPage = () => {
   const navigate = useNavigate();
   const [bookings, setBookings] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [selectedBooking, setSelectedBooking] = useState(null);
   const [cancelling, setCancelling] = useState(null);

   const fetchBookings = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
         const res = await bookingApi.getMyBookings();
         const data = res.data?.data ?? res.data;
         // Sort: Latest to Earliest using createdAt
         const sorted = (Array.isArray(data) ? data : []).sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
         );
         setBookings(sorted);
      } catch (err) {
         setError(err.response?.data?.error?.message || 'Failed to load your bookings.');
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => { fetchBookings(); }, [fetchBookings]);

   const handleCancel = async (bookingId, status) => {
      const isPaid = status === 'CONFIRMED';
      const msg = isPaid
         ? 'This is a PRE-PAID confirmed stay. Are you sure you want to proceed with cancellation? This action may be subject to refund policies.'
         : 'Are you sure you want to cancel this booking?';

      if (!window.confirm(msg)) return;
      setCancelling(bookingId);
      try {
         await bookingApi.cancelBooking(bookingId);
         setBookings(prev =>
            prev.map(b => b.id === bookingId ? { ...b, bookingStatus: 'CANCELLED' } : b)
         );
      } catch (err) {
         console.error('Cancellation error:', err);
      } finally {
         setCancelling(null);
      }
   };

   const isCancelable = (status) => status === 'CONFIRMED';

   return (
      <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">
         {/* Background Glows for Glassmorphism */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#635BFF]/5 blur-[120px] rounded-full -mr-64 -mt-64" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#F6A100]/5 blur-[120px] rounded-full -ml-64 -mb-64" />

         <div className="max-w-6xl mx-auto px-4 py-20 space-y-12 relative z-10">

            {/* ─── Header Section ─────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
               <div className="space-y-4">
                  <div className="flex items-center gap-2">
                     <span className="px-3 py-1 bg-[#635BFF]/10 text-[#635BFF] text-xs font-black uppercase tracking-widest rounded-md">My Account</span>
                     <div className="h-1 w-1 bg-gray-300 rounded-full" />
                     <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Booking History</span>
                  </div>
                  <h1 className="text-5xl font-black text-[#0A2540] tracking-tighter uppercase leading-none">Your Stays</h1>
                  <p className="text-sm font-medium text-gray-400 max-w-lg">View and manage your current bookings, past stays, and upcoming trips.</p>
               </div>

               <div className="flex items-center gap-4">
                  <button
                     onClick={() => navigate('/')}
                     className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-[#0A2540] uppercase tracking-widest transition-all group mr-4"
                  >
                     <div className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm group-hover:bg-gray-50 transition-colors">
                        <ArrowLeft size={18} />
                     </div>
                     Back to Home
                  </button>
                  <button
                     onClick={fetchBookings}
                     className="p-4 bg-white border border-gray-100 rounded-[1.5rem] text-gray-400 hover:text-[#0A2540] transition-all shadow-sm hover:shadow-md"
                  >
                     <RefreshCw size={20} className={loading && !bookings.length ? 'animate-spin' : ''} />
                  </button>
                  <button
                     onClick={() => navigate('/')}
                     className="flex items-center gap-3 bg-[#0A2540] text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-[#635BFF] transition-all shadow-xl shadow-[#0A2540]/20 active:scale-95"
                  >
                     Find a Hotel <ArrowRight size={18} />
                  </button>
               </div>
            </div>

            {error && (
               <div className="flex items-center gap-4 bg-red-50 border border-red-100 text-red-700 p-8 rounded-[2.5rem] text-xs font-black uppercase tracking-wider">
                  <ServerCrash size={24} />
                  <div className="flex-1">
                     <p>{error}</p>
                     <button onClick={fetchBookings} className="mt-2 text-xs underline hover:no-underline">Retry Connection</button>
                  </div>
               </div>
            )}

            {/* ─── Main Content ─────────────────────────────────────────────────── */}
            <div className="space-y-8">
               {loading && !bookings.length ? (
                  <div className="space-y-6">
                     {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                  </div>
               ) : bookings.length === 0 ? (
                  <div className="bg-white rounded-[3rem] border border-gray-100 p-24 text-center shadow-lg relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-[#635BFF]/5 blur-3xl -mr-32 -mt-32" />
                     <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-gray-100 text-gray-300 group-hover:scale-110 transition-transform duration-500">
                        <CalendarCheck size={40} strokeWidth={1.5} />
                     </div>
                     <h3 className="text-2xl font-black text-[#0A2540] tracking-tighter uppercase mb-4">No Bookings Found</h3>
                     <p className="text-sm font-medium text-gray-400 max-w-xs mx-auto mb-10 leading-relaxed">
                        You haven't made any bookings yet. Start your journey by finding a perfect hotel.
                     </p>
                     <button onClick={() => navigate('/')} className="px-10 py-5 bg-[#0A2540] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-[#635BFF] transition-all active:scale-95 shadow-2xl shadow-[#0A2540]/20">
                        Discover Destinations
                     </button>
                  </div>
               ) : (
                  <div className="space-y-6">
                     <AnimatePresence>
                        {bookings.map((booking, idx) => {
                           const config = STATUS_CONFIG[booking.bookingStatus] || STATUS_CONFIG.EXPIRED;
                           const amount = Number(booking.amount ?? booking.totalPrice ?? 0);
                           const isPending = booking.bookingStatus === 'PAYMENTS_PENDING';

                           return (
                              <motion.div
                                 key={booking.id}
                                 initial={{ opacity: 0, x: -20 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{ delay: idx * 0.05 }}
                                 className="bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/40 shadow-sm hover:shadow-[0_40px_100px_rgba(0,0,0,0.1)] hover:bg-white/80 transition-all duration-700 overflow-hidden group"
                              >
                                 <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-10">

                                    {/* Visual ID / Status Column */}
                                    <div className="relative shrink-0">
                                       <div className="w-32 h-32 rounded-[2rem] bg-gray-50 flex items-center justify-center relative border border-gray-100 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                          {booking.hotel?.photos?.[0] ? (
                                             <img src={booking.hotel.photos[0]} className="w-full h-full object-cover" alt="" />
                                          ) : (
                                             <Building2 size={48} strokeWidth={1.5} className="text-gray-200" />
                                          )}
                                          <div className={`absolute inset-0 ${config.bg} opacity-10`} />
                                       </div>
                                       <div className={`absolute -bottom-2 -right-2 p-2.5 rounded-xl border bg-white shadow-xl ${config.color} ${config.border}`}>
                                          {config.icon}
                                       </div>
                                    </div>

                                    {/* Core Details */}
                                    <div className="flex-1 space-y-5 text-center md:text-left">
                                       <div className="space-y-1">
                                          <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                                             <span className="text-xs font-black text-[#635BFF] uppercase tracking-widest bg-[#635BFF]/5 px-3 py-1 rounded-md">ID: #{booking.id}</span>
                                             <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${config.bg} ${config.color} ${config.border}`}>
                                                {config.label}
                                             </div>
                                          </div>
                                          <h3 className="text-2xl font-black text-[#0A2540] tracking-tighter uppercase">
                                             {booking.hotel?.name || booking.hotelName || 'Property'}
                                          </h3>
                                          <div className="flex items-center justify-center md:justify-start gap-3 text-xs font-bold text-gray-400">
                                             <MapPin size={14} className="text-[#635BFF]" />
                                             <span>{booking.hotel?.city || booking.city || 'Location'}</span>
                                          </div>
                                       </div>

                                       <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2 border-t border-gray-50 pt-5">
                                          <div className="text-center md:text-left">
                                             <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-1">Stay Dates</p>
                                             <p className="text-xs font-black text-[#0A2540] uppercase">{booking.checkInDate} <span className="text-gray-300 mx-1">→</span> {booking.checkOutDate}</p>
                                          </div>
                                          <div className="text-center md:text-left">
                                             <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-1">Total Price</p>
                                             <p className="text-xs font-black text-[#0A2540]">₹{amount.toLocaleString()}</p>
                                          </div>
                                          <div className="text-center md:text-left">
                                             <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-1">Rooms</p>
                                             <p className="text-xs font-black text-[#0A2540] uppercase">{booking.roomsCount || 1} Room{(booking.roomsCount || 1) > 1 ? 's' : ''}</p>
                                          </div>
                                          <div className="text-center md:text-left">
                                             <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-1">Booked On</p>
                                             <p className="text-xs font-black text-[#635BFF] uppercase">
                                                {new Date(booking.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                             </p>
                                          </div>
                                       </div>
                                    </div>

                                    {/* Actions Column */}
                                    <div className="flex flex-col gap-3 w-full md:w-auto">
                                       {(booking.bookingStatus === 'PAYMENTS_PENDING' || booking.bookingStatus === 'GUESTS_ADDED' || booking.bookingStatus === 'RESERVED') && (
                                          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                                             <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">Incomplete Flow</p>
                                             <p className="text-[10px] font-bold text-amber-600/80 leading-tight uppercase tracking-wider">
                                                Session expired. Please rebook this hotel to complete your stay.
                                             </p>
                                          </div>
                                       )}
                                       {(booking.bookingStatus !== 'CANCELLED' && booking.bookingStatus !== 'EXPIRED') && (
                                          <button
                                             onClick={() => handleCancel(booking.id, booking.bookingStatus)}
                                             disabled={cancelling === booking.id || !isCancelable(booking.bookingStatus)}
                                             className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border active:scale-95 ${isCancelable(booking.bookingStatus)
                                                ? 'bg-red-50 text-red-500 border-red-100 hover:bg-red-500 hover:text-white'
                                                : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed opacity-50'
                                                }`}
                                          >
                                             {cancelling === booking.id ? <Loader2 className="animate-spin" size={18} /> : <XCircle size={18} />}
                                             <span>Cancel Booking</span>
                                          </button>
                                       )}
                                       <button
                                          className="flex items-center justify-center gap-3 bg-[#F8FAFC] text-[#0A2540] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
                                          onClick={() => setSelectedBooking(booking)}
                                       >
                                          <Receipt size={18} />
                                          <span>Details</span>
                                       </button>
                                    </div>
                                 </div>
                              </motion.div>
                           );
                        })}
                     </AnimatePresence>
                  </div>
               )}
            </div>

            {/* ─── Immersive Full-Screen Glass Modal ─────────────────────────── */}
            {selectedBooking && createPortal(
               <div className="fixed inset-0 w-full h-full z-[9999] flex items-center justify-center p-6 sm:p-12 overflow-hidden text-left">
                  <div className="absolute inset-0 bg-[#0A2540]/40 backdrop-blur-[20px]" onClick={() => setSelectedBooking(null)} />
                  <div className="relative bg-white/10 backdrop-blur-[50px] w-full max-w-2xl rounded-[3rem] border border-white/30 shadow-[0_60px_150px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                     <div className="h-2 bg-gradient-to-r from-[#635BFF] via-[#F6A100] to-[#635BFF]" />
                     <div className="p-10 md:p-12 relative z-10">
                        <div className="flex justify-between items-start mb-10">
                           <div>
                              <p className="text-[10px] font-black text-[#635BFF] uppercase tracking-[0.3em] mb-2">Authenticated Stay</p>
                              <h3 className="text-4xl font-black text-[#0A2540] tracking-tighter uppercase leading-none">Stay Details</h3>
                           </div>
                           <button onClick={() => setSelectedBooking(null)} className="p-3 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all">
                              <XCircle size={28} />
                           </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                           <div className="space-y-8">
                              <div>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Property Name</p>
                                 <h4 className="text-2xl font-black text-[#0A2540] tracking-tighter uppercase leading-none">{selectedBooking.hotel?.name || selectedBooking.hotelName || 'Nox Elite Stay'}</h4>
                                 <p className="text-xs font-bold text-gray-400 mt-3 flex items-center gap-2 uppercase tracking-widest"><MapPin size={12} className="text-[#635BFF]" /> {selectedBooking.hotel?.city || selectedBooking.city}</p>
                              </div>
                              <div className="space-y-4 p-6 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
                                 <div className="flex justify-between"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Check-In</span><span className="text-xs font-black text-white uppercase">{selectedBooking.checkInDate}</span></div>
                                 <div className="flex justify-between border-t border-white/10 pt-2"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Check-Out</span><span className="text-xs font-black text-white uppercase">{selectedBooking.checkOutDate}</span></div>
                                 <div className="flex justify-between border-t border-white/10 pt-4"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount Paid</span><span className="text-xl font-black text-[#635BFF] tracking-tighter drop-shadow-lg">₹{Number(selectedBooking.amount).toLocaleString()}</span></div>
                              </div>
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Guest List</p>
                              <div className="space-y-3 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                                 {selectedBooking.guests?.map((g, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm group/guest hover:bg-white/10 transition-colors">
                                       <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[10px] font-black text-white">{g.name[0].toUpperCase()}</div>
                                       <div>
                                          <p className="text-xs font-black text-white uppercase tracking-tight">{g.name}</p>
                                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{g.gender} · {g.age} Yrs</p>
                                       </div>
                                    </div>
                                 ))}
                                 {!selectedBooking.guests?.length && <p className="text-xs font-bold text-gray-300 italic uppercase">Primary Guest Only.</p>}
                              </div>
                           </div>
                        </div>
                        <div className="mt-12"><button onClick={() => setSelectedBooking(null)} className="w-full py-5 bg-[#635BFF] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#0A2540] transition-all shadow-xl shadow-[#635BFF]/20">Return to Dashboard</button></div>
                     </div>
                  </div>
               </div>,
               document.body
            )}

            {/* ─── Support Footer ───────────────────────────────────────────────── */}
            <div className="bg-[#0A2540] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10">
               <div className="absolute top-0 right-0 w-80 h-80 bg-[#635BFF]/10 blur-[120px] -mr-40 -mt-40" />
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[2rem] bg-white/5 flex items-center justify-center text-[#635BFF]">
                     <ShieldCheck size={32} />
                  </div>
                  <div className="space-y-1">
                     <p className="text-xs font-black text-[#635BFF] uppercase tracking-[0.3em]">Security</p>
                     <p className="text-xl font-bold tracking-tight">Your booking history is encrypted and secure.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Support Center</button>
               </div>
            </div>

         </div>
      </div>
   );
};

export default MyBookingsPage;
