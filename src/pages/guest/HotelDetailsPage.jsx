import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelApi } from '../../api/hotelApi';
import BookingDialog from '../../components/booking/BookingDialog';
import { 
  MapPin, Phone, Mail, Loader2, ServerCrash, 
  ChevronLeft, Users, Bed, Star, ArrowRight,
  Wifi, Waves, SlidersHorizontal, UserCheck, ShieldCheck,
  Maximize2
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';

// Fix leaflet default icons
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
L.Marker.prototype.options.icon = L.icon({ iconUrl, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });

const AMENITY_ICONS = { 
  WIFI: <Wifi size={16} />, 
  POOL: <Waves size={16} />,
  GYM: <SlidersHorizontal size={16} />,
  PARKING: <MapPin size={16} />
};

const parseLocation = (str) => {
  if (!str) return null;
  const [lat, lng] = str.split(',').map(s => parseFloat(s.trim()));
  return isNaN(lat) || isNaN(lng) ? null : [lat, lng];
};

const HotelDetailsPage = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [bookingRoom, setBookingRoom] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await hotelApi.getHotelInfo(hotelId);
        setData(res.data?.data || res.data);
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Failed to load hotel details.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [hotelId]);

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh] flex-col gap-4 text-gray-400">
      <div className="relative">
         <div className="w-16 h-16 border-4 border-[#635BFF]/10 border-t-[#635BFF] rounded-full animate-spin" />
         <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-pulse text-[#635BFF]" size={20} />
         </div>
      </div>
      <p className="text-xs font-black uppercase tracking-[0.2em]">Loading hotel details...</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-[80vh] flex-col gap-6 text-red-400 max-w-sm mx-auto text-center px-4">
      <ServerCrash size={64} className="opacity-20" />
      <div>
        <h3 className="text-xl font-black text-[#0A2540] uppercase tracking-tighter mb-2">Loading Error</h3>
        <p className="text-sm font-medium text-gray-400">{error}</p>
      </div>
      <button onClick={() => navigate(-1)} className="px-8 py-3.5 bg-[#0A2540] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#0A2540]/20 active:scale-95 transition-all">
        ← Go Back
      </button>
    </div>
  );

  const { hotel, rooms = [] } = data || {};
  const coords = parseLocation(hotel?.contactInfo?.location);
  const photos = hotel?.photos || [];

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      
      {/* ── CINEMATIC HERO ─────────────────────────────────────────────────── */}
      <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-[#0A2540]">
        <AnimatePresence mode="wait">
          <motion.img
            key={activePhoto}
            src={photos[activePhoto] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80'}
            alt={hotel?.name}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-transparent to-black/20" />
        
        {/* Navigation Overlays */}
        <div className="absolute top-8 left-8">
           <button onClick={() => navigate(-1)} className="group flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl text-white transition-all hover:bg-white hover:text-[#0A2540] shadow-2xl">
              <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest leading-none pt-0.5">All Hotels</span>
           </button>
        </div>

        {/* Thumbnail Strip */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 px-8 max-w-full overflow-x-auto pb-4 no-scrollbar">
           {photos.map((p, i) => (
             <button 
               key={i} 
               onClick={() => setActivePhoto(i)}
               className={`shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all duration-500 scale-90 hover:scale-100 ${i === activePhoto ? 'border-[#635BFF] ring-4 ring-[#635BFF]/30 scale-100' : 'border-white/20 opacity-40 hover:opacity-100'}`}
             >
               <img src={p} alt="" className="w-full h-full object-cover" />
             </button>
           ))}
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute left-8 right-8 bottom-36 md:left-16 md:bottom-48 pointer-events-none">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <div className="flex items-center gap-3 mb-4">
                 <span className="px-3 py-1 bg-[#635BFF] text-white text-xs font-black uppercase tracking-widest rounded-md">Premium Hotel</span>
                 <div className="flex items-center text-[#F6A100] gap-0.5 scale-90">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                 </div>
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-4 max-w-3xl drop-shadow-2xl">{hotel?.name}</h1>
              <div className="flex items-center gap-2 text-white/70 text-sm font-bold tracking-tight">
                 <MapPin size={18} className="text-[#635BFF]" />
                 {hotel?.city} · {hotel?.contactInfo?.address}
              </div>
           </motion.div>
        </div>
      </section>

      {/* ── CONTENT SECTION ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 -mt-24 md:-mt-32 relative z-20 pb-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: INFO & ROOMS */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { label: 'Rating', val: '4.8/5', icon: <Star size={16} /> },
                 { label: 'Location', val: hotel?.city, icon: <MapPin size={16} /> },
                 { label: 'Verified', val: 'Secure', icon: <ShieldCheck size={16} /> },
                 { label: 'Status', val: hotel?.active ? 'Active' : 'Private', icon: <UserCheck size={16} /> }
               ].map(stat => (
                 <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center text-center group hover:bg-[#635BFF] transition-all duration-500">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#635BFF] mb-3 group-hover:bg-white transition-colors">
                       {stat.icon}
                    </div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-white/60 transition-colors">{stat.label}</p>
                    <p className="text-xs font-black text-[#0A2540] uppercase tracking-tighter group-hover:text-white transition-colors">{stat.val}</p>
                 </div>
               ))}
            </div>

            {/* Description & Amenities */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 shadow-sm">
               <h3 className="text-xs font-black text-[#635BFF] uppercase tracking-[0.3em] mb-4">About this Hotel</h3>
               <p className="text-gray-500 leading-relaxed font-medium mb-10 text-lg">
                 Experience the pinnacle of hospitality at {hotel?.name}. Each room is designed with high-end architecture and modern amenities tailored for your comfort.
               </p>
               
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                 {(hotel?.amenities || []).map(a => (
                   <div key={a} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#635BFF]">
                         {AMENITY_ICONS[a] || <Maximize2 size={16} />}
                      </div>
                      <span className="text-xs font-black text-[#0A2540] uppercase tracking-widest whitespace-nowrap">{a}</span>
                   </div>
                 ))}
               </div>
            </div>

            {/* Room Inventory Selection */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-4">
                  <h2 className="text-2xl font-black text-[#0A2540] tracking-tighter uppercase">Room Types</h2>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{rooms.length} Room Types</span>
               </div>

               <div className="grid grid-cols-1 gap-6">
                  {rooms.length === 0 && <p className="p-12 text-center text-gray-400 bg-white rounded-[2rem] border border-gray-100">Rooms details are being updated.</p>}
                  {rooms.map(room => (
                    <motion.div 
                      key={room.id}
                      whileHover={{ scale: 1.01, y: -4 }}
                      className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-sm transition-all flex flex-col md:flex-row items-center gap-10 hover:shadow-2xl group"
                    >
                      <div className="w-full md:w-48 h-48 rounded-[2rem] bg-gray-50 overflow-hidden relative shrink-0">
                         <div className="absolute inset-x-0 bottom-0 py-2 bg-[#635BFF] text-white text-xs font-black uppercase tracking-widest text-center">
                            Only {room.totalCount} Units Left
                         </div>
                         <div className="w-full h-full flex items-center justify-center text-gray-200">
                            <Bed size={40} />
                         </div>
                      </div>

                      <div className="flex-1 space-y-4 text-center md:text-left">
                         <div>
                            <h4 className="text-2xl font-black text-[#0A2540] tracking-tighter uppercase leading-none mb-1 group-hover:text-[#635BFF] transition-colors">{room.type}</h4>
                            <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                               <span className="flex items-center gap-1.5"><Users size={12} className="text-[#635BFF]" /> Guests: {room.capacity}</span>
                               <span className="w-1 h-1 rounded-full bg-gray-200" />
                               <span>Prime Studio</span>
                            </div>
                         </div>
                         
                         <div className="flex flex-wrap justify-center md:justify-start gap-2">
                           {(room.amenities || []).map(a => (
                             <span key={a} className="px-2 py-1 bg-gray-50 text-xs font-black text-gray-400 uppercase tracking-widest rounded-md border border-gray-100">{a}</span>
                           ))}
                         </div>
                      </div>

                      <div className="text-center md:text-right shrink-0 md:pl-10 md:border-l border-gray-50">
                         <p className="text-xs font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Price</p>
                         <h5 className="text-4xl font-black text-[#0A2540] tracking-tighter mb-4">₹{room.basePrice?.toLocaleString()}</h5>
                         <button
                           onClick={() => setBookingRoom(room)}
                           disabled={hotel?.active === false}
                           className="w-full md:w-auto px-10 py-4 bg-[#0A2540] hover:bg-[#635BFF] disabled:opacity-30 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#0A2540]/10 flex items-center justify-center gap-2 active:scale-95"
                         >
                           Book Now <ArrowRight size={16} />
                         </button>
                      </div>
                    </motion.div>
                  ))}
               </div>
            </div>
          </div>

          {/* RIGHT: MAP & CONTACT */}
          <aside className="space-y-8 sticky top-32">
             
             {/* Integrated Map */}
             <div className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden group">
                {coords ? (
                  <div className="rounded-[1.5rem] overflow-hidden h-72 lg:h-80 grayscale-[0.5] hover:grayscale-0 transition-all duration-700">
                    <MapContainer center={coords} zoom={14} scrollWheelZoom={false} className="w-full h-full z-0">
                      <TileLayer
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={coords}>
                        <Popup><b>{hotel?.name}</b></Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                ) : (
                  <div className="h-72 rounded-[1.5rem] bg-gray-50 flex flex-col items-center justify-center text-gray-300 gap-4 border border-dashed border-gray-200">
                    <MapPin size={40} className="opacity-10" />
                    <p className="text-xs font-black uppercase tracking-widest">Map not available</p>
                  </div>
                )}
                <div className="p-4 pt-6">
                   <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Precise Location</p>
                   <p className="text-sm font-bold text-[#0A2540] leading-snug">{hotel?.contactInfo?.address || 'Restricted Address'}, {hotel?.city}</p>
                </div>
             </div>

             {/* Support/Contact */}
             <div className="bg-[#0A2540] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#635BFF]/10 blur-3xl -mr-16 -mt-16" />
                <h4 className="text-xs font-black text-[#635BFF] uppercase tracking-[0.3em] mb-8">Help & Support</h4>
                <div className="space-y-6">
                   <div className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#635BFF] transition-all">
                         <Phone size={18} />
                      </div>
                      <div>
                         <p className="text-xs font-black text-white/40 uppercase tracking-widest">Primary Line</p>
                         <p className="text-sm font-bold">{hotel?.contactInfo?.phoneNumber || '+91 ACCESS RESTRICTED'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#635BFF] transition-all">
                         <Mail size={18} />
                      </div>
                      <div>
                         <p className="text-xs font-black text-white/40 uppercase tracking-widest">Email</p>
                         <p className="text-sm font-bold truncate max-w-[160px]">{hotel?.contactInfo?.email || 'support@noxstays.com'}</p>
                      </div>
                   </div>
                </div>
             </div>

          </aside>
        </div>
      </div>

      {/* Booking Dialog */}
      {bookingRoom && (
        <BookingDialog
          hotel={hotel}
          room={bookingRoom}
          onClose={() => setBookingRoom(null)}
        />
      )}
    </div>
  );
};

export default HotelDetailsPage;
