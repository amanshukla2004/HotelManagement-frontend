import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Users, TrendingUp, Sparkles, Compass, ShieldCheck, Map, ArrowRight, History, Star, ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { normalizeCityName } from '../../utils/stringUtils';

const POPULAR_CITIES = [
  { city: 'Mumbai', image: 'https://images.unsplash.com/photo-1570160897040-30430ade2211?w=800&q=80', desc: 'Financial heart & nightlife hub', hotels: '1,200+' },
  { city: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80', desc: 'Beaches, parties & old cathedrals', hotels: '850+' },
  { city: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80', desc: 'History, street food & culture', hotels: '1,400+' },
  { city: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80', desc: 'Tech parks & garden escapes', hotels: '900+' },
  { city: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80', desc: 'Palaces, forts & pink streets', hotels: '400+' },
  { city: 'Udaipur', image: 'https://images.unsplash.com/photo-1615836245337-f839dffdbac3?w=800&q=80', desc: 'Romance by the lake palaces', hotels: '300+' },
];

const COLLECTIONS = [
  { title: 'Mountain Escapes', icon: <TrendingUp size={20} />, count: '420 properties', bg: 'bg-emerald-50 text-emerald-700' },
  { title: 'Beachfront Villas', icon: <Sparkles size={20} />, count: '150 properties', bg: 'bg-blue-50 text-blue-700' },
  { title: 'Business Stays', icon: <ShieldCheck size={20} />, count: '890 properties', bg: 'bg-gray-50 text-gray-700' },
  { title: 'Luxury Resorts', icon: <Compass size={20} />, count: '210 properties', bg: 'bg-amber-50 text-amber-700' },
];

const FindHotelPage = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(saved.slice(0, 5));
  }, []);

  const clearRecentSearches = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();

    const normalizedCity = normalizeCityName(city);
    const updated = [normalizedCity, ...recentSearches.filter(c => c !== normalizedCity)].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    setRecentSearches(updated);

    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);
    
    const params = new URLSearchParams({
      city: normalizedCity,
      roomsCount: 1,
      startDate: today.toISOString().split('T')[0],
      endDate: nextMonth.toISOString().split('T')[0]
    });
    navigate(`/search?${params.toString()}`);
  };

  const handleCityClick = (cityName) => {
    const normalizedCity = normalizeCityName(cityName);
    setCity(normalizedCity);
    // Auto trigger search logic
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);
    const params = new URLSearchParams({
      city: normalizedCity,
      roomsCount: 1,
      startDate: today.toISOString().split('T')[0],
      endDate: nextMonth.toISOString().split('T')[0]
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative w-full py-24 md:py-32 overflow-hidden bg-[#0A2540]">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#635BFF_0%,_transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-black tracking-widest text-white/50 hover:text-white uppercase border border-white/10 backdrop-blur-sm transition-all"
            >
              <ArrowLeft size={12} />
              Home
            </button>
            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black tracking-[0.2em] text-[#635BFF] uppercase border border-white/10 backdrop-blur-sm">
              Explore the World
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 leading-[0.95]"
          >
            Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#635BFF] to-[#F6A100]">next adventure</span>
          </motion.h1>

          {/* Search Box */}
          <motion.form 
            onSubmit={handleSearch}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mb-10"
          >
            <div className="bg-white p-2 rounded-[28px] shadow-2xl flex items-center group focus-within:ring-4 focus-within:ring-[#635BFF]/10 transition-all">
              <div className="flex-1 flex items-center px-6">
                <Search size={20} className="text-gray-400 mr-4 group-focus-within:text-[#635BFF] transition-colors" />
                <input 
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  required
                  placeholder="Where are you dreaming of going?"
                  className="w-full py-4 text-sm font-bold text-[#0A2540] outline-none placeholder:text-gray-300"
                />
              </div>
              <button 
                type="submit"
                className="bg-[#0A2540] hover:bg-[#635BFF] text-white px-8 py-4 rounded-[22px] font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"
              >
                Search <ArrowRight size={14} />
              </button>
            </div>
          </motion.form>

          {/* Recent Searches Chips */}
          {recentSearches.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-3 flex-wrap"
            >
              <History size={14} className="text-white/40" />
              {recentSearches.map(item => (
                <button 
                  key={item}
                  onClick={() => handleCityClick(item)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 rounded-full text-xs font-black uppercase tracking-widest transition-all backdrop-blur-sm"
                >
                  {item}
                </button>
              ))}
              <div className="h-4 w-px bg-white/10 mx-1" />
              <button 
                onClick={clearRecentSearches}
                className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors"
              >
                <Trash2 size={12} />
                Clear All
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── TRENDING CITIES (REDESIGNED) ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 pb-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-black text-[#0A2540] tracking-tighter leading-none">Popular Destinations</h2>
            <p className="text-sm text-gray-400 mt-2 font-medium">Curated favorites from our seasoned travelers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {POPULAR_CITIES.map((city, idx) => (
            <motion.div
              key={city.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              onClick={() => handleCityClick(city.city)}
              className="group cursor-pointer relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <img 
                src={city.image} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt={city.city}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              <div className="absolute top-6 right-6">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={16} />
                </div>
              </div>

              <div className="absolute bottom-10 left-10 right-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-[#635BFF] text-white text-xs font-black uppercase tracking-widest rounded-md">
                    {city.hotels} stays
                  </span>
                  <div className="flex items-center text-[#F6A100] scale-75">
                    {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                </div>
                <h3 className="text-3xl font-black text-white tracking-tighter mb-1">{city.city}</h3>
                <p className="text-sm text-white/60 font-medium leading-tight opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                  {city.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── COLLECTIONS SECTION ──────────────────────────────────────────── */}
      <section className="bg-white py-24 mb-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-[#0A2540] tracking-tighter mb-4">Travel Collections</h2>
            <p className="text-gray-400 max-w-lg mx-auto font-medium">Discover your perfect atmosphere with our hand-picked property catalogs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLLECTIONS.map((col, idx) => (
              <motion.div
                key={col.title}
                whileHover={{ scale: 1.02, y: -4 }}
                className="p-8 rounded-[2rem] bg-gray-50 border border-transparent hover:border-[#635BFF]/10 transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-12 ${col.bg}`}>
                  {col.icon}
                </div>
                <h4 className="text-lg font-black text-[#0A2540] mb-2">{col.title}</h4>
                <p className="text-sm text-gray-500 font-bold tracking-tight mb-6">{col.count}</p>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-300 group-hover:bg-[#635BFF] group-hover:text-white transition-all shadow-sm">
                  <ArrowRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE PULSE (BRAIN FEATURE) ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-20 bg-[#0A2540] rounded-[3rem] mb-20 overflow-hidden relative shadow-2xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#635BFF]/10 blur-[80px] -mr-32 -mt-32" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#635BFF]/10 blur-[80px] -ml-32 -mb-32" />
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
           <div className="space-y-4">
              <div className="flex justify-center"><Map className="text-[#635BFF]" size={28} /></div>
              <h5 className="text-3xl font-black text-white">12,400+</h5>
              <p className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Verified Units</p>
           </div>
           <div className="space-y-4 border-y md:border-y-0 md:border-x border-white/10 py-10 md:py-0">
              <div className="flex justify-center"><TrendingUp className="text-[#635BFF]" size={28} /></div>
              <h5 className="text-3xl font-black text-white">4.9/5</h5>
              <p className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Guest Satisfaction</p>
           </div>
           <div className="space-y-4">
              <div className="flex justify-center"><Sparkles className="text-[#635BFF]" size={28} /></div>
              <h5 className="text-3xl font-black text-white">2.4m</h5>
              <p className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Annual Searches</p>
           </div>
         </div>
      </section>

    </div>
  );
};

export default FindHotelPage;
