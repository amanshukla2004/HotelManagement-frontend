import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelApi } from '../../api/hotelApi';
import BookingDialog from '../../components/booking/BookingDialog';
import { 
  MapPin, Phone, Mail, Loader2, ServerCrash, 
  ChevronLeft, Users, Bed, Star, ArrowRight,
  Wifi, Waves, SlidersHorizontal, UserCheck, ShieldCheck,
  Maximize2, Image as ImageIcon
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

const RoomCard = ({ room, hotelActive, onBook }) => {
  const [photoIdx, setPhotoIdx] = useState(0);
  const hasPhotos = room.photos && room.photos.length > 0;

  useEffect(() => {
    if (hasPhotos && room.photos.length > 1) {
      const interval = setInterval(() => {
         setPhotoIdx(p => (p + 1) % room.photos.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [hasPhotos, room.photos]);

  return (
    <motion.div 
      whileHover={{ scale: 1.01, y: -4 }}
      className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-sm transition-all flex flex-col md:flex-row items-center gap-10 hover:shadow-2xl group"
    >
      <div className="w-full md:w-48 h-48 rounded-[2rem] bg-gray-50 overflow-hidden relative shrink-0">
         <div className="absolute inset-x-0 bottom-0 py-2 bg-[#0284C7] text-white text-[10px] font-bold uppercase tracking-widest text-center z-20">
            Only {room.totalCount} Units Left
         </div>
         {hasPhotos ? (
            <AnimatePresence mode="wait">
              <motion.img 
                key={photoIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                src={room.photos[photoIdx]} 
                alt={room.type} 
                className="absolute inset-0 w-full h-full object-cover z-10" 
              />
            </AnimatePresence>
         ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 relative z-10">
               <Bed size={40} />
            </div>
         )}
      </div>

      <div className="flex-1 space-y-4 text-center md:text-left">
         <div>
            <h4 className="text-2xl font-black text-[#0F172A] tracking-tighter uppercase leading-none mb-1 group-hover:text-[#0284C7] transition-colors">{room.type}</h4>
            <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-black text-gray-400 uppercase tracking-widest">
               <span className="flex items-center gap-1.5"><Users size={12} className="text-[#0284C7]" /> Guests: {room.capacity}</span>
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
          <h5 className="text-3xl font-black text-[#0F172A] tracking-tight mb-4 font-display">₹{room.basePrice?.toLocaleString()}</h5>
         <button
           onClick={() => onBook(room)}
           disabled={!hotelActive}
           className="w-full md:w-auto px-8 py-3.5 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-30 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-[#F97316]/20 flex items-center justify-center gap-2 active:scale-95"
         >
           Book Now <ArrowRight size={14} />
         </button>
      </div>
    </motion.div>
  );
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

  useEffect(() => {
    if (data?.hotel?.photos?.length) {
      const interval = setInterval(() => {
        setActivePhoto((prev) => (prev + 1) % data.hotel.photos.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [data?.hotel?.photos]);

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh] flex-col gap-4 text-gray-400">
      <div className="relative">
         <div className="w-16 h-16 border-4 border-[#0284C7]/10 border-t-[#0284C7] rounded-full animate-spin" />
         <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-pulse text-[#0284C7]" size={20} />
         </div>
      </div>
      <p className="text-xs font-black uppercase tracking-[0.2em]">Loading hotel details...</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-[80vh] flex-col gap-6 text-red-400 max-w-sm mx-auto text-center px-4">
      <ServerCrash size={64} className="opacity-20" />
      <div>
        <h3 className="text-xl font-black text-[#0F172A] uppercase tracking-tighter mb-2">Loading Error</h3>
        <p className="text-sm font-medium text-gray-400">{error}</p>
      </div>
      <button onClick={() => navigate(-1)} className="px-8 py-3.5 bg-[#0F172A] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#0F172A]/20 active:scale-95 transition-all">
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
      <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-[#0F172A]">
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

        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-black/20" />
        
        {/* Navigation Overlays */}
        <div className="absolute top-20 md:top-24 left-4 md:left-8 z-50">
           <button onClick={() => navigate(-1)} className="group flex items-center gap-2 bg-white/20 backdrop-blur-xl border border-white/30 px-5 py-2.5 rounded-xl text-white transition-all hover:bg-white hover:text-[#0284C7] shadow-xl">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[11px] font-bold uppercase tracking-wider leading-none pt-0.5">All Hotels</span>
           </button>
        </div>

        {/* Thumbnail Strip (Removed) */}

        {/* Hero Content Overlay */}
        <div className="absolute left-4 right-4 bottom-32 md:left-12 md:bottom-40 pointer-events-none z-40">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <div className="flex items-center gap-3 mb-3">
                 <span className="px-3 py-1 bg-[#F97316] text-white text-[10px] font-bold uppercase tracking-wider rounded-md">Premium Hotel</span>
                 <div className="flex items-center text-[#F97316] gap-0.5 scale-90">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                 </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-3 max-w-3xl drop-shadow-2xl font-display">{hotel?.name}</h1>
              <div className="flex items-center gap-2 text-white text-xs font-bold tracking-wider uppercase">
                 <MapPin size={16} className="text-[#F97316]" />
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
                 <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center text-center group hover:bg-[#0284C7] transition-all duration-500">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#0284C7] mb-3 group-hover:bg-white transition-colors">
                       {stat.icon}
                    </div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-white/60 transition-colors">{stat.label}</p>
                    <p className="text-xs font-black text-[#0F172A] uppercase tracking-tighter group-hover:text-white transition-colors">{stat.val}</p>
                 </div>
               ))}
            </div>

            {/* Description & Amenities */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 shadow-sm">
               <h3 className="text-xs font-black text-[#0284C7] uppercase tracking-[0.3em] mb-4">About this Hotel</h3>
               <p className="text-gray-500 leading-relaxed font-medium mb-10 text-lg">
                 Experience the pinnacle of hospitality at {hotel?.name}. Each room is designed with high-end architecture and modern amenities tailored for your comfort.
               </p>
               
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                 {(hotel?.amenities || []).map(a => (
                   <div key={a} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#0284C7]">
                         {AMENITY_ICONS[a] || <Maximize2 size={16} />}
                      </div>
                      <span className="text-xs font-black text-[#0F172A] uppercase tracking-widest whitespace-nowrap">{a}</span>
                   </div>
                 ))}
               </div>
            </div>

            {/* Room Inventory Selection */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-4">
                  <h2 className="text-2xl font-black text-[#0F172A] tracking-tighter uppercase">Room Types</h2>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{rooms.length} Room Types</span>
               </div>

               <div className="grid grid-cols-1 gap-6">
                  {rooms.length === 0 && <p className="p-12 text-center text-gray-400 bg-white rounded-[2rem] border border-gray-100">Rooms details are being updated.</p>}
                  {rooms.map(room => (
                    <RoomCard 
                      key={room.id} 
                      room={room} 
                      hotelActive={hotel?.active !== false} 
                      onBook={(r) => setBookingRoom(r)} 
                    />
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
                   <p className="text-sm font-bold text-[#0F172A] leading-snug">{hotel?.contactInfo?.address || 'Restricted Address'}, {hotel?.city}</p>
                </div>
             </div>

             {/* Support/Contact */}
             <div className="bg-[#0F172A] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0284C7]/10 blur-3xl -mr-16 -mt-16" />
                <h4 className="text-xs font-black text-[#0284C7] uppercase tracking-[0.3em] mb-8">Help & Support</h4>
                <div className="space-y-6">
                   <div className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#0284C7] transition-all">
                         <Phone size={18} />
                      </div>
                      <div>
                         <p className="text-xs font-black text-white/40 uppercase tracking-widest">Primary Line</p>
                         <p className="text-sm font-bold">{hotel?.contactInfo?.phoneNumber || '+91 ACCESS RESTRICTED'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#0284C7] transition-all">
                         <Mail size={18} />
                      </div>
                      <div>
                         <p className="text-xs font-black text-white/40 uppercase tracking-widest">Email</p>
                         <p className="text-sm font-bold break-all pr-2">{hotel?.contactInfo?.email || 'support@noxstays.com'}</p>
                      </div>
                   </div>
                </div>
             </div>

          </aside>
        </div>

        {/* ── GALLERY SECTION ────────────────────────────────────────────────── */}
        <div className="mt-16 space-y-8">
           <div className="flex items-center justify-between px-4">
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tighter uppercase">Photo Gallery</h2>
           </div>
           
           <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {photos?.map((photo, i) => (
                 <div key={i} className="break-inside-avoid rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group relative">
                    <img src={photo} alt={`${hotel?.name} ${i}`} className="w-full h-auto object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <ImageIcon className="text-white" size={32} strokeWidth={1} />
                    </div>
                 </div>
              ))}
              {(!photos || photos.length === 0) && (
                 <div className="col-span-full py-32 flex flex-col items-center justify-center text-gray-300">
                    <ImageIcon size={64} strokeWidth={1} className="mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest">No Photos Found</p>
                 </div>
              )}
           </div>
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
