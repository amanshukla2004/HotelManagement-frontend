import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Menu, LogOut, Hotel, Heart, ChevronDown, UserCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { role, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 z-[100] pt-6 px-6">
      <header className="mx-auto max-w-7xl transition-all duration-500 rounded-[2.5rem] bg-[#0F172A]/30 backdrop-blur-3xl border border-white/10 shadow-2xl shadow-black/30">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-2.5 group transition-transform hover:scale-[1.02]">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0F172A] to-[#0284C7] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0284C7]/20 group-hover:rotate-6 transition-all duration-300">
            <Hotel className="text-white" size={22} />
          </div>
          <span className="text-2xl font-display font-black tracking-tighter group-hover:text-[#0284C7] transition-colors text-white">
            NOX
          </span>
        </NavLink>

        <div className="hidden md:flex items-center space-x-8 ml-auto mr-8">
          <nav className="flex items-center space-x-6">
            {role !== 'HOTEL_MANAGER' && (
              <NavLink to="/bookings" className={({isActive}) => `text-[15px] font-black uppercase tracking-[0.2em] transition-all hover:text-[#0284C7] ${isActive ? 'text-[#0284C7]' : 'text-white/60'}`}>
                My Bookings
              </NavLink>
            )}
            <NavLink to="/support" className={({isActive}) => `text-[15px] font-black uppercase tracking-[0.2em] transition-all hover:text-[#0284C7] ${isActive ? 'text-[#0284C7]' : 'text-white/60'}`}>
              Support
            </NavLink>
          </nav>

          {role === 'HOTEL_MANAGER' && (
            <NavLink to="/admin/hotels" className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-[#0284C7] px-6 py-2.5 rounded-full hover:bg-white hover:text-[#0284C7] transition-all shadow-lg shadow-[#0284C7]/30 active:scale-95 leading-none flex items-center h-10">
              Portal
            </NavLink>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-4">
          {role ? (
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`flex items-center space-x-2.5 pl-3 pr-2 py-1.5 rounded-full border transition-all ${
                  isMenuOpen ? 'bg-white border-gray-100 shadow-md ring-4 ring-gray-50' : 'bg-gray-50 border-gray-100 hover:bg-white'
                }`}
              >
                <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-[#0284C7] to-[#0F172A] text-white flex justify-center items-center text-xs font-black shadow-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                </div>
                <span className="text-xs font-black text-[#0F172A] hidden sm:block">ACCOUNT</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10, originX: 1, originY: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute top-[calc(100%+12px)] right-0 w-56 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] rounded-2xl border border-gray-50 p-2 z-[110] overflow-hidden"
                  >
                    <div className="px-4 py-3 mb-2 border-b border-gray-50 flex flex-col gap-0.5">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Signed in as</p>
                      <p className="text-sm font-black text-[#0F172A] truncate leading-tight">{user?.name || 'Guest User'}</p>
                      <p className="text-[10px] font-bold text-gray-400 truncate tracking-tight">{user?.email}</p>
                    </div>

                    <div className="space-y-0.5">
                      <NavLink 
                        to="/profile" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-600 hover:text-[#0284C7] hover:bg-[#F6F9FC] rounded-xl transition-all"
                      >
                        <UserCircle2 size={16} /> My Profile
                      </NavLink>
                      {role !== 'HOTEL_MANAGER' && (
                        <>
                          <NavLink 
                            to="/bookings" 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-600 hover:text-[#0284C7] hover:bg-[#F6F9FC] rounded-xl transition-all"
                          >
                            <Hotel size={16} /> My Bookings
                          </NavLink>
                          <NavLink 
                            to="/guests" 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-600 hover:text-[#0284C7] hover:bg-[#F6F9FC] rounded-xl transition-all"
                          >
                            <User size={16} /> Saved Guests
                          </NavLink>
                        </>
                      )}
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-50">
                      <button 
                        onClick={() => { logout(); setIsMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <NavLink to="/login" className="flex items-center space-x-2.5 bg-[#0F172A] text-white px-5 py-2.5 rounded-2xl font-black text-xs hover:bg-[#0284C7] transition-all shadow-lg shadow-[#0F172A]/20 active:scale-[0.98]">
              <User size={16} />
              <span>SIGN IN</span>
            </NavLink>
          )}

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </div>
      </header>
    </div>
  );
};

export default Header;
