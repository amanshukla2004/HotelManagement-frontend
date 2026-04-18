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
          src={photos[index]}
          alt={hotelName}
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
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-[#0A2540] transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setIndex(p => (p + 1) % photos.length); }}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-[#0A2540] transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 px-2">
        {photos.slice(0, 5).map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all ${i === index ? 'w-4 bg-[#635BFF]' : 'w-1 bg-white/40'}`} />
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
      className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col sm:flex-row overflow-hidden"
    >
      <div className="w-full sm:w-64 h-48 sm:h-auto shrink-0 border-r border-gray-50">
        <ImageCarousel photos={hotel.photos} hotelName={hotel.name} />
      </div>
      
      <div className="flex-1 p-6 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start gap-4 mb-2">
            <h2 className="text-xl font-black text-[#0A2540] tracking-tighter truncate group-hover:text-[#635BFF] transition-colors uppercase leading-none">
              {hotel.name}
            </h2>
            <div className="flex items-center gap-1.5 bg-[#F6A100]/10 text-[#F6A100] px-3 py-1 rounded-full shrink-0">
              <Star size={14} fill="currentColor" />
              <span className="text-xs font-black">4.8</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
            <MapPin size={12} className="text-[#635BFF]" /> 
            <span className="truncate">{hotel.city}</span>
          </div>
          
          <div className="flex gap-2 flex-wrap mb-4">
            {(hotel.amenities || []).map(a => (
              <span key={a} className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-[#635BFF]/5 text-[#635BFF] px-3 py-1.5 rounded-full border border-[#635BFF]/10">
                {AMENITY_ICONS[a] || null}{a}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Price Per Night</p>
            <p className="text-2xl font-black text-[#0A2540] tracking-tighter">
              ₹{price?.toLocaleString('en-IN') || '1,200'}
            </p>
          </div>
          <button className="bg-[#0A2540] group-hover:bg-[#635BFF] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#0A2540]/10 flex items-center gap-2 active:scale-95">
            Book Now <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters state
  const [priceRange, setPriceRange] = useState(10000);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [minRating, setMinRating] = useState(0);

  const city = searchParams.get('city') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const roomsCount = searchParams.get('roomsCount') || 1;

  const fetchHotels = useCallback(async () => {
    if (!city) return;
    setLoading(true);
    setError(null);
    try {
      const response = await hotelApi.searchHotels({
        city: normalizeCityName(city),
        startDate,
        endDate,
        roomsCount,
        page,
        size: 50, // Get more for client-side filtering support if needed
      });
      const raw = response.data;
      const pageObj = raw?.data ?? raw;
      const content = Array.isArray(pageObj?.content) ? pageObj.content
                    : Array.isArray(pageObj) ? pageObj
                    : [];
      setHotels(content);
      setTotalPages(pageObj?.totalPages ?? 1);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to fetch hotels. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [city, startDate, endDate, roomsCount, page]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  // Point 10 & 11: Frontend Filters
  const filteredHotels = useMemo(() => {
    return hotels.filter(hp => {
      const hotel = hp.hotel;
      const price = hp.price;
      
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
    <div className="bg-[#F8FAFC] min-h-screen">
      
      {/* Search Header Strip */}
      <div className="bg-white border-b border-gray-100 py-10 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#635BFF]/10 text-[#635BFF] text-xs font-black uppercase tracking-widest rounded-md border border-[#635BFF]/10">
                Search Results
              </span>
              <h1 className="text-3xl font-black text-[#0A2540] tracking-tighter uppercase leading-none">
                Stays in {normalizeCityName(city) || 'Your Area'}
              </h1>
            </div>
            <div className="flex items-center gap-4 text-xs font-black text-gray-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[#635BFF]" /> {startDate} - {endDate}</span>
              <span className="flex items-center gap-1.5"><Users size={12} className="text-[#635BFF]" /> {roomsCount} room</span>
              <span className="flex items-center gap-1.5"><Hotel size={12} className="text-[#635BFF]" /> {filteredHotels.length} available</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest text-[#0A2540] hover:bg-[#F6F9FC] transition-all"
          >
            <Search size={14} /> Modify Search
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR FILTERS */}
        <aside className="w-full lg:w-72 space-y-8 shrink-0">
          
          {/* Price Range */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <h4 className="text-xs font-black text-[#0A2540] uppercase tracking-[0.2em] mb-6">Price Range</h4>
            <div className="space-y-4">
              <input 
                type="range" 
                min={0} 
                max={20000} 
                step={500}
                value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#635BFF]" 
              />
              <div className="flex items-center justify-between text-xs font-black text-gray-500 uppercase tracking-wider">
                <span>₹0</span>
                <span className="text-[#635BFF]">₹{priceRange.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <h4 className="text-xs font-black text-[#0A2540] uppercase tracking-[0.2em] mb-6">Amenities</h4>
            <div className="space-y-2">
              {['WIFI', 'POOL', 'GYM', 'PARKING'].map(a => (
                <button
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                    selectedAmenities.includes(a) 
                      ? 'border-[#635BFF] bg-[#635BFF]/5 text-[#635BFF]' 
                      : 'border-transparent bg-gray-50 text-gray-500 hover:border-gray-200'
                  }`}
                >
                  <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    {AMENITY_ICONS[a]} {a}
                  </span>
                  {selectedAmenities.includes(a) && <X size={12} />}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* RESULTS LIST */}
        <div className="flex-1 space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
              <Loader2 className="animate-spin text-[#635BFF]" size={40} />
              <p className="text-xs font-black uppercase tracking-[0.2em]">Finding the best hotels...</p>
            </div>
          )}

          {!loading && error && (
            <div className="p-12 bg-white rounded-[3rem] text-center border border-red-50">
              <ServerCrash className="mx-auto text-red-200 mb-4" size={48} />
              <p className="text-sm font-bold text-gray-700">{error}</p>
              <button 
                onClick={fetchHotels}
                className="mt-6 px-8 py-3 bg-[#0A2540] text-white rounded-2xl text-xs font-black uppercase tracking-widest"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filteredHotels.length === 0 && (
            <div className="p-20 bg-white rounded-[3rem] text-center border border-gray-100 shadow-sm">
              <Hotel className="mx-auto text-gray-100 mb-6" size={64} />
              <h3 className="text-xl font-black text-[#0A2540] tracking-tighter mb-2">No matching stays found</h3>
              <p className="text-sm text-gray-400 font-medium">Try broadening your filters or searching a different area.</p>
              <button 
                onClick={() => { setPriceRange(20000); setSelectedAmenities([]); }}
                className="mt-8 px-8 py-3 bg-[#635BFF] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#635BFF]/20"
              >
                Reset Filters
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {!loading && filteredHotels.map(hp => (
                <HotelCard 
                  key={hp.hotel.id} 
                  hotelPrice={hp} 
                  onSelect={handleSelectHotel} 
                />
              ))}
            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
};

export default SearchResultsPage;
