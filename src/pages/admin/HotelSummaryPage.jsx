import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, MapPin, BedDouble, ChevronLeft, 
  Sparkles, Image as ImageIcon, LayoutGrid, 
  TrendingUp, Users, Calendar, ArrowRight,
  ShieldCheck, Info, Star, RefreshCw, Mail, Phone
} from 'lucide-react';
import { adminHotelApi } from '../../api/hotelApi';

const HotelSummaryPage = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW | ROOMS | GALLERY

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // We'll reuse getHotelInfo from hotelApi but via admin access or just fetch separately
      const hotelRes = await adminHotelApi.getMyHotels();
      const currentHotel = hotelRes.data?.data?.find(h => h.id === parseInt(hotelId)) || 
                           hotelRes.data?.find(h => h.id === parseInt(hotelId));
      
      if (currentHotel) {
        setHotel(currentHotel);
        
        // Fetch Rooms
        const roomsRes = await adminHotelApi.getRooms(hotelId);
        setRooms(roomsRes.data?.data ?? roomsRes.data ?? []);
        
        // Fetch some basic reports/stats
        const reportsRes = await adminHotelApi.getReports(hotelId, { startDate: '2000-01-01', endDate: '2099-12-31' });
        setStats(reportsRes.data?.data ?? reportsRes.data);
      }
    } catch (err) {
      console.error('Failed to load asset summary:', err);
    } finally {
      setIsLoading(false);
    }
  }, [hotelId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <RefreshCw className="animate-spin text-[#0284C7]" size={40} />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center space-y-6">
        <div className="w-20 h-20 bg-red-50 rounded-[2.5rem] flex items-center justify-center text-red-500">
           <Info size={40} />
        </div>
        <h2 className="text-2xl font-black text-[#0F172A] uppercase tracking-tighter">Hotel Not Found</h2>
        <button onClick={() => navigate('/admin/hotels')} className="px-8 py-4 bg-[#0F172A] text-white rounded-2xl font-black text-xs uppercase tracking-widest">Back to Hotels</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      
      {/* ─── Premium Header Section ────────────────────────────────────────── */}
      <div className="bg-[#0F172A] text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-[#0284C7]/20 to-transparent" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] -ml-32 -mb-32" />
         
         <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
            <button 
              onClick={() => navigate('/admin/hotels')}
              className="flex items-center gap-2 text-xs font-black text-white/40 uppercase tracking-widest hover:text-white transition-all mb-10 group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Hotel List
            </button>
            
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
               <div className="space-y-6">
                  <div className="flex items-center gap-3">
                     <span className="px-3 py-1 bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-md border border-white/10">Hotel ID: #{hotel.id}</span>
                     <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${hotel.active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        <div className={`w-1 h-1 rounded-full ${hotel.active ? 'bg-green-400' : 'bg-red-400'}`} />
                        {hotel.active ? 'Online' : 'Offline'}
                     </div>
                  </div>
                  <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">{hotel.name}</h1>
                  <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-white/60">
                     <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#0284C7]" />
                        <span>{hotel.city}</span>
                     </div>
                     <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                     <div className="flex items-center gap-2">
                        <BedDouble size={16} className="text-[#0284C7]" />
                        <span>{rooms.length} Room Types</span>
                     </div>
                     <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                     <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest">
                        <Star size={14} fill="#F97316" className="text-[#F97316]" />
                        <span>Premium Property</span>
                     </div>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button 
                    onClick={() => navigate(`/admin/hotels/${hotelId}/rooms`)}
                    className="flex items-center gap-3 bg-[#0284C7] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-[#0F172A] transition-all shadow-2xl shadow-[#0284C7]/20 active:scale-95"
                  >
                     Manage Rooms <ArrowRight size={18} />
                  </button>
                  <button 
                    onClick={() => navigate('/admin/reports')}
                    className="flex items-center justify-center w-14 h-14 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all"
                  >
                     <TrendingUp size={20} />
                  </button>
               </div>
            </div>
         </div>

         {/* Navigation Tabs */}
         <div className="max-w-7xl mx-auto px-4">
            <div className="flex border-b border-white/5">
               {['OVERVIEW', 'ROOMS', 'GALLERY'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-6 text-xs font-black uppercase tracking-[0.3em] transition-all relative ${
                      activeTab === tab ? 'text-white' : 'text-white/30 hover:text-white/60'
                    }`}
                  >
                     {tab}
                     {activeTab === tab && (
                        <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-1 bg-[#0284C7]" />
                     )}
                  </button>
               ))}
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
         <AnimatePresence mode="wait">
            {activeTab === 'OVERVIEW' && (
               <motion.div 
                 key="overview"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 className="space-y-12"
               >
                  {/* KPI Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0284C7] flex items-center justify-center mb-4">
                           <TrendingUp size={24} />
                        </div>
                        <div>
                           <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
                           <p className="text-4xl font-black text-[#0F172A] tracking-tighter">₹{stats?.totalRevenue?.toLocaleString() || '0'}</p>
                        </div>
                     </div>
                     <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mb-4">
                           <ShieldCheck size={24} />
                        </div>
                        <div>
                           <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Bookings</p>
                           <p className="text-4xl font-black text-[#0F172A] tracking-tighter">{stats?.bookingCount || '0'}</p>
                        </div>
                     </div>
                     <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center mb-4">
                           <LayoutGrid size={24} />
                        </div>
                        <div>
                           <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Avg. Price</p>
                           <p className="text-4xl font-black text-[#0F172A] tracking-tighter">₹{Math.round(stats?.avgRevenue || 0).toLocaleString()}</p>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                     {/* Asset Details */}
                     <div className="lg:col-span-2 space-y-10">
                        <section className="space-y-6">
                           <div className="flex items-center gap-3">
                              <Sparkles className="text-[#0284C7]" size={20} />
                              <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-[0.3em]">Description</h3>
                           </div>
                           <p className="text-lg font-medium text-gray-500 leading-relaxed italic">
                              "{hotel.name} is a premium hotel within the Nox global network, offering luxury and modern design."
                           </p>
                        </section>

                        <section className="bg-white rounded-[3rem] border border-gray-100 p-12 space-y-10">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                              <div className="space-y-6">
                                 <h4 className="text-xs font-black text-[#0284C7] uppercase tracking-[0.3em]">Contact Information</h4>
                                 <div className="space-y-4">
                                    <div className="flex gap-4">
                                       <MapPin className="text-gray-300 shrink-0" size={18} />
                                       <p className="text-sm font-bold text-[#0F172A] tracking-tight">{hotel.contactInfo?.address || 'Physical deployment details not defined.'}</p>
                                    </div>
                                    <div className="flex gap-4">
                                       <Phone className="text-gray-300 shrink-0" size={18} />
                                       <p className="text-sm font-bold text-[#0F172A]">{hotel.contactInfo?.phoneNumber || 'Line inactive'}</p>
                                    </div>
                                    <div className="flex gap-4">
                                       <Mail className="text-gray-300 shrink-0" size={18} />
                                       <p className="text-sm font-bold text-[#0F172A]">{hotel.contactInfo?.email || 'nexus@system.io'}</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="space-y-6">
                                 <h4 className="text-xs font-black text-[#0284C7] uppercase tracking-[0.3em]">Amenities</h4>
                                 <div className="flex flex-wrap gap-2">
                                    {hotel.amenities?.map(a => (
                                       <span key={a} className="px-3 py-1.5 bg-gray-50 text-xs font-black text-gray-400 uppercase tracking-widest rounded-lg border border-gray-100">{a}</span>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </section>
                     </div>

                     {/* Main Image Teaser */}
                     <div className="lg:col-span-1">
                        <div className="aspect-[3/4] rounded-[3rem] bg-gray-100 overflow-hidden relative group">
                           {hotel.photos?.[0] ? (
                              <img src={hotel.photos[0]} alt="Hero" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" />
                           ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                 <ImageIcon size={48} strokeWidth={1} />
                              </div>
                           )}
                           <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60" />
                           <div className="absolute bottom-10 left-10">
                              <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-1">Property Image</p>
                              <p className="text-xl font-bold text-white uppercase tracking-tighter">Main View</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}

            {activeTab === 'ROOMS' && (
               <motion.div 
                 key="rooms"
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="space-y-10"
               >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {rooms.map((room, idx) => (
                        <div key={room.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                           <div className="aspect-video relative overflow-hidden bg-gray-50">
                              <img src={room.photos?.[0] || 'https://via.placeholder.com/800x450'} alt={room.type} className="w-full h-full object-cover" />
                              <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-xs font-black text-[#0F172A] uppercase tracking-widest border border-white/50">
                                 {room.type}
                              </div>
                           </div>
                           <div className="p-8 space-y-6">
                              <div className="flex items-center justify-between">
                                 <div>
                                    <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-1">Price</p>
                                    <p className="text-2xl font-black text-[#0F172A] tracking-tighter">₹{room.basePrice.toLocaleString()}</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-1">Capacity</p>
                                    <p className="text-xl font-black text-[#0F172A] tracking-tighter">{room.capacity} GUESTS</p>
                                 </div>
                              </div>
                              <div className="flex flex-wrap gap-1.5 pt-6 border-t border-gray-50">
                                 {room.amenities?.slice(0, 4).map(a => (
                                    <span key={a} className="px-2 py-1 bg-gray-50 text-xs font-bold text-gray-400 rounded-md border border-gray-100">{a}</span>
                                 ))}
                              </div>
                              <button 
                                onClick={() => navigate(`/admin/hotels/${hotelId}/rooms/${room.id}/inventory`, { state: { hotelName: hotel.name, roomType: room.type } })}
                                className="w-full py-4 bg-gray-50 text-[#0F172A] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0F172A] hover:text-white transition-all border border-gray-100"
                              >
                                View Availability
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            )}

            {activeTab === 'GALLERY' && (
               <motion.div 
                 key="gallery"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
               >
                  {hotel.photos?.map((photo, i) => (
                     <div key={i} className="break-inside-avoid rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group relative">
                        <img src={photo} alt={`${hotel.name} ${i}`} className="w-full h-auto object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <ImageIcon className="text-white" size={32} strokeWidth={1} />
                        </div>
                     </div>
                  ))}
                  {(!hotel.photos || hotel.photos.length === 0) && (
                     <div className="col-span-full py-32 flex flex-col items-center justify-center text-gray-300">
                        <ImageIcon size={64} strokeWidth={1} className="mb-4" />
                        <p className="text-xs font-black uppercase tracking-widest">No Photos Found</p>
                     </div>
                  )}
               </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Persistence Controls Footer */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 px-10 py-5 bg-[#0F172A]/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl z-50 flex items-center gap-10">
         <div className="flex items-center gap-4 border-r border-white/10 pr-10">
            <div className={`w-3 h-3 rounded-full ${hotel.active ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs font-black text-white uppercase tracking-widest">{hotel.active ? 'Online' : 'Offline'}</span>
         </div>
         <div className="flex items-center gap-6">
            <button className="text-xs font-black text-white/60 hover:text-[#0284C7] uppercase tracking-widest transition-all">Edit Hotel</button>
            <button className="text-xs font-black text-red-400 hover:text-red-500 uppercase tracking-widest transition-all">Delete Hotel</button>
         </div>
      </div>

    </div>
  );
};

export default HotelSummaryPage;
