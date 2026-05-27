import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { hotelApi } from '../../api/hotelApi';
import { 
  MapPin, Star, Wifi, Waves, SlidersHorizontal, 
  Loader2, ServerCrash, Hotel, ChevronRight, ChevronLeft,
  Calendar, Users, X, Search, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { normalizeCityName } from '../../utils/stringUtils';

const AMENITY_ICONS = { 
  WIFI: <Wifi size={14} />, 
  POOL: <Waves size={14} />,
  GYM: <SlidersHorizontal size={14} />,
  PARKING: <MapPin size={14} />
};

const ImageCarousel = ({ photos, hotelName }) => {
  const [index, setIndex] = useState(0);
  if (!photos || photos.length === 0) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
        <Hotel size={40} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={photos[index] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'}
          alt={hotelName}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800';
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </AnimatePresence>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
      
      {photos.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); setIndex(p => (p - 1 + photos.length) % photos.length); }}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-[#0284C7] transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setIndex(p => (p + 1) % photos.length); }}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-[#0284C7] transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 px-2">
        {photos.slice(0, 5).map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-[#F97316]' : 'w-1.5 bg-white/50'}`} />
        ))}
      </div>
    </div>
  );
};

const HotelCard = ({ hotelPrice, onSelect }) => {
  const hotel = hotelPrice.hotel;
  const price = hotelPrice.price;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onSelect(hotel.id)}
      className="bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col sm:flex-row overflow-hidden"
    >
      <div className="w-full sm:w-72 h-56 sm:h-auto shrink-0 border-r border-gray-50">
        <ImageCarousel photos={hotel.photos} hotelName={hotel.name} />
      </div>
      
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start gap-4 mb-2">
            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight truncate group-hover:text-[#0284C7] transition-colors font-display">
              {hotel.name}
            </h2>
            <div className="flex items-center gap-1.5 bg-[#F97316]/10 text-[#F97316] px-3 py-1.5 rounded-full shrink-0">
              <Star size={14} fill="currentColor" />
              <span className="text-xs font-bold">4.8</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider mb-5">
            <MapPin size={14} className="text-[#0284C7]" /> 
            <span className="truncate">{hotel.city}</span>
          </div>
          
          <div className="flex gap-2 flex-wrap mb-4">
            {(hotel.amenities || []).map(a => (
              <span key={a} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-[#0284C7]/5 text-[#0284C7] px-3 py-1.5 rounded-full border border-[#0284C7]/10">
                {AMENITY_ICONS[a] || null}{a.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-4">
          <div className="flex flex-col">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Price Per Night</p>
            <p className="text-2xl font-black text-[#0F172A] font-display">
              ₹{price?.toLocaleString('en-IN') || '1,200'}
            </p>
          </div>
          <button className="bg-[#F97316] group-hover:bg-[#EA580C] text-white px-6 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-[#F97316]/20 flex items-center gap-2 active:scale-95">
            Book Now <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters state
  const [priceRange, setPriceRange] = useState(20000);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const city = searchParams.get('city') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const roomsCount = searchParams.get('roomsCount') || 1;

  // Reset page when search params change
  useEffect(() => {
    setPage(0);
    setHotels([]);
  }, [city, startDate, endDate, roomsCount]);

  const fetchHotels = useCallback(async (currentPage) => {
    if (!city) return;
    setLoading(true);
    setError(null);
    try {
      const response = await hotelApi.searchHotels({
        city: normalizeCityName(city),
        startDate,
        endDate,
        roomsCount,
        page: currentPage,
        size: 10, // Pagination size
      });
      const raw = response.data;
      const pageObj = raw?.data ?? raw;
      const content = Array.isArray(pageObj?.content) ? pageObj.content
                    : Array.isArray(pageObj) ? pageObj
                    : [];
      
      setHotels(prev => currentPage === 0 ? content : [...prev, ...content]);
      setTotalPages(pageObj?.totalPages ?? 1);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to fetch hotels. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [city, startDate, endDate, roomsCount]);

  useEffect(() => {
    fetchHotels(page);
  }, [page, fetchHotels]);

  // Frontend Filters
  const filteredHotels = useMemo(() => {
    return hotels.filter(hp => {
      const hotel = hp.hotel;
      const price = hp.price || 1200;
      
      // Filter by Price
      if (price > priceRange) return false;
      
      // Filter by Amenities
      if (selectedAmenities.length > 0) {
        const hasAll = selectedAmenities.every(a => hotel.amenities?.includes(a));
        if (!hasAll) return false;
      }
      
      return true;
    });
  }, [hotels, priceRange, selectedAmenities]);

  const toggleAmenity = (a) => {
    setSelectedAmenities(prev => 
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    );
  };

  const handleSelectHotel = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
  };

  return (
    <div className="bg-[#F0F9FF] min-h-screen pt-28">
      
      {/* Search Header Strip */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 py-8 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#F97316]/10 text-[#F97316] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#F97316]/20">
                Search Results
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tight font-display">
                Stays in {normalizeCityName(city) || 'Your Area'}
              </h1>
            </div>
            <div className="flex items-center gap-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#0284C7]" /> {startDate} - {endDate}</span>
              <span className="flex items-center gap-1.5"><Users size={14} className="text-[#0284C7]" /> {roomsCount} room</span>
              <span className="flex items-center gap-1.5"><Hotel size={14} className="text-[#0284C7]" /> {hotels.length} available</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 shadow-sm rounded-xl text-[11px] font-bold uppercase tracking-widest text-[#0F172A] hover:bg-gray-50 transition-all"
          >
            <Search size={14} /> Modify Search
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR FILTERS */}
        <aside className="w-full lg:w-72 space-y-6 shrink-0">
          
          {/* Price Range */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="text-[11px] font-bold text-[#0F172A] uppercase tracking-wider mb-6 flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-[#0284C7]" /> Price Range
            </h4>
            <div className="space-y-4">
              <input 
                type="range" 
                min={0} 
                max={50000} 
                step={1000}
                value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#F97316]" 
              />
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <span>₹0</span>
                <span className="text-[#F97316]">₹{priceRange.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h4 className="text-[11px] font-bold text-[#0F172A] uppercase tracking-wider mb-6">Amenities</h4>
            <div className="space-y-3">
              {['WIFI', 'POOL', 'SPA', 'GYM', 'PARKING', 'RESTAURANT', 'BAR', 'ROOM_SERVICE', 'AC', 'LAUNDRY', 'PET_FRIENDLY', 'BUSINESS_CENTER', 'CONFERENCE_ROOM', 'EV_CHARGING'].map(a => (
                <button
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                    selectedAmenities.includes(a) 
                      ? 'border-[#0284C7] bg-[#0284C7]/5 text-[#0284C7]' 
                      : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                    {AMENITY_ICONS[a] || null} {a.replace(/_/g, ' ')}
                  </span>
                  {selectedAmenities.includes(a) && <X size={14} />}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* RESULTS LIST */}
        <div className="flex-1 space-y-6 pb-20">
          
          {!loading && error && (
            <div className="p-12 bg-white rounded-3xl text-center border border-red-100 shadow-sm">
              <ServerCrash className="mx-auto text-red-300 mb-4" size={48} />
              <p className="text-sm font-bold text-gray-700">{error}</p>
              <button 
                onClick={() => fetchHotels(page)}
                className="mt-6 px-8 py-3 bg-[#0F172A] text-white rounded-xl text-[11px] font-bold uppercase tracking-widest"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filteredHotels.length === 0 && hotels.length > 0 && (
            <div className="p-16 bg-white rounded-3xl text-center border border-gray-100 shadow-sm">
              <Hotel className="mx-auto text-gray-200 mb-6" size={64} />
              <h3 className="text-xl font-black text-[#0F172A] tracking-tight mb-2 font-display">No matching stays found</h3>
              <p className="text-sm text-gray-500 font-medium">Try broadening your filters or searching a different area.</p>
              <button 
                onClick={() => { setPriceRange(50000); setSelectedAmenities([]); }}
                className="mt-8 px-8 py-3 bg-[#0284C7] text-white rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-[#0284C7]/20"
              >
                Reset Filters
              </button>
            </div>
          )}
          
          {!loading && !error && hotels.length === 0 && (
            <div className="p-16 bg-white rounded-3xl text-center border border-gray-100 shadow-sm">
               <MapPin className="mx-auto text-gray-200 mb-6" size={64} />
               <h3 className="text-xl font-black text-[#0F172A] tracking-tight mb-2 font-display">No stays available in {city}</h3>
               <p className="text-sm text-gray-500 font-medium">Try another destination for your dates.</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {filteredHotels.map(hp => (
                <HotelCard 
                  key={hp.hotel.id} 
                  hotelPrice={hp} 
                  onSelect={handleSelectHotel} 
                />
              ))}
            </AnimatePresence>
          </div>
          
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-gray-400">
              <Loader2 className="animate-spin text-[#F97316]" size={40} />
              <p className="text-[11px] font-bold uppercase tracking-widest">Finding best hotels...</p>
            </div>
          )}
          
          {!loading && page < totalPages - 1 && (
             <div className="flex justify-center mt-10">
               <button 
                 onClick={() => setPage(p => p + 1)}
                 className="px-8 py-3.5 bg-white border border-gray-200 text-[#0F172A] rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
               >
                 Load More Stays
               </button>
             </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default SearchResultsPage;
