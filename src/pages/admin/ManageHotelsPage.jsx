import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, ToggleLeft, ToggleRight,
  BedDouble, BarChart2, MapPin, Wifi, CheckCircle2,
  XCircle, RefreshCw, Building2, AlertCircle, 
  ArrowRight, Search, LayoutGrid, List, MoreVertical,
  ChevronRight
} from 'lucide-react';
import { adminHotelApi } from '../../api/hotelApi';
import HotelFormModal from '../../components/admin/HotelFormModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

// ─── Skeleton Row ────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <div className="grid grid-cols-12 gap-6 px-8 py-6 items-center animate-pulse border-b border-gray-50 bg-white">
    <div className="col-span-1 w-12 h-12 rounded-2xl bg-gray-50" />
    <div className="col-span-3 space-y-2">
      <div className="h-4 bg-gray-50 rounded w-3/4" />
      <div className="h-3 bg-gray-50 rounded w-1/2" />
    </div>
    <div className="col-span-2 h-4 bg-gray-50 rounded w-20" />
    <div className="col-span-2 h-7 w-20 bg-gray-50 rounded-full" />
    <div className="col-span-4 flex justify-end gap-2">
      {[1, 2, 3, 4].map((i) => <div key={i} className="w-10 h-10 rounded-xl bg-gray-50" />)}
    </div>
  </div>
);

// ─── Empty State ─────────────────────────────────────────────────────────────
const EmptyState = ({ onAdd }) => (
  <div className="flex flex-col items-center justify-center py-32 text-center px-4">
    <div className="w-24 h-24 bg-[#0284C7]/5 rounded-[2.5rem] flex items-center justify-center mb-8 border border-[#0284C7]/10">
      <Building2 size={40} className="text-[#0284C7]" />
    </div>
    <h3 className="text-2xl font-black text-[#0F172A] tracking-tighter mb-2 uppercase">No Hotels Found</h3>
    <p className="text-sm font-medium text-gray-400 max-w-xs mb-10 leading-relaxed">
      Add your first hotel property to start managing bookings and rooms in the Nox system.
    </p>
    <button
      onClick={onAdd}
      className="flex items-center gap-3 bg-[#0F172A] text-white px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-[#0284C7] transition-all shadow-2xl shadow-[#0F172A]/20 active:scale-95"
    >
      <Plus size={18} />
      <span>Register Property</span>
    </button>
  </div>
);

const ManageHotelsPage = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  const [slideOpen, setSlideOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [countdown, setCountdown] = useState(180);

  useEffect(() => {
    let timer;
    if (togglingId) {
      setCountdown(180);
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [togglingId]);

  const fetchHotels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminHotelApi.getMyHotels();
      const data = res.data?.data ?? res.data;
      setHotels(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load hotels.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchHotels(); }, [fetchHotels]);

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingHotel) {
        await adminHotelApi.updateHotel(editingHotel.id, data);
      } else {
        await adminHotelApi.createHotel(data);
      }
      setSlideOpen(false);
      setEditingHotel(null);
      fetchHotels();
    } catch (err) {
      console.error('Error saving hotel:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const openCreate = () => { setEditingHotel(null); setSlideOpen(true); };
  const openEdit   = (hotel) => { setEditingHotel(hotel); setSlideOpen(true); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await adminHotelApi.deleteHotel(deleteTarget.id);
      setDeleteTarget(null);
      fetchHotels();
    } catch (err) {
      console.error('Error deleting hotel:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleActive = async (hotel) => {
    setTogglingId(hotel.id);
    try {
      await adminHotelApi.toggleActivate(hotel.id);
      setHotels((prev) =>
        prev.map((h) => (h.id === hotel.id ? { ...h, active: !h.active } : h))
      );
    } catch (err) {
      console.error('Update error:', err);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative pt-28">
      {/* ─── MODALS (Top Level) ────────────────────────────────────────── */}
      <AnimatePresence>
        {togglingId && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/80 backdrop-blur-sm p-4"
          >
            <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center space-y-6">
              <div className="relative flex items-center justify-center">
                <div className="w-24 h-24 border-4 border-gray-100 border-t-[#0284C7] rounded-full animate-spin" />
                <div className="absolute text-[#0F172A] font-black text-lg">
                  {Math.floor(countdown / 60)}:{(countdown % 60) < 10 ? '0' : ''}{countdown % 60}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black text-[#0F172A] tracking-tighter uppercase mb-2">Processing Update</h3>
                <p className="text-sm font-medium text-gray-500 leading-relaxed">
                  Please wait... Preparing hotel inventory for the next 365 days. This may take up to 3 minutes.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <HotelFormModal
        isOpen={slideOpen}
        onClose={() => { 
          console.log('Closing Modal...');
          setSlideOpen(false); 
          setEditingHotel(null); 
        }}
        onSubmit={handleFormSubmit}
        initialData={editingHotel}
        isLoading={formLoading}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete Property: "${deleteTarget?.name}"?`}
        message="This operation will permanently remove the property, its room inventory, and all associated booking logs. This action cannot be undone."
        confirmLabel="Confirm Deletion"
        isDangerous
        isLoading={deleteLoading}
      />

      <div className="max-w-screen-2xl mx-auto px-6 py-16 space-y-12">
        {/* ─── Header Strip ─────────────────────────────────────────────────── */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
          <div className="space-y-6">
             <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#0284C7]/10 text-[#0284C7] text-xs font-black uppercase tracking-[0.3em] rounded-md border border-[#0284C7]/10">Admin Portal</span>
                <div className="h-1 w-1 bg-gray-300 rounded-full" />
                <span className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Property Manager</span>
             </div>
             <h1 className="text-6xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">Your Properties</h1>
             <p className="text-[#0284C7] font-black text-xs uppercase tracking-[0.4em]">Management interface for your hotels, room availability, and performance reports.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#0F172A] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}><List size={18} /></button>
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#0F172A] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}><LayoutGrid size={18} /></button>
            </div>
            
            <button
              onClick={fetchHotels}
              disabled={isLoading}
              className="p-3.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#0F172A] transition-all shadow-sm hover:shadow-md active:rotate-180"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
            
            <button
              onClick={() => {
                console.log('Registering new property...');
                openCreate();
              }}
              className="flex items-center gap-3 bg-[#0F172A] text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-[#0284C7] cursor-pointer transition-all shadow-xl shadow-[#0F172A]/20 active:scale-95"
            >
              <Plus size={18} />
              <span>Register Property</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-4 bg-red-50 border border-red-100 text-red-700 p-6 rounded-[2rem] text-xs font-black uppercase tracking-wider">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* ─── Assets View ──────────────────────────────────────────────────── */}
        <div className="relative">
          {isLoading ? (
            <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
              {[1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)}
            </div>
          ) : hotels.length === 0 ? (
            <EmptyState onAdd={openCreate} />
          ) : viewMode === 'list' ? (
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-[0_32px_80px_rgba(0,0,0,0.04)] overflow-hidden">
               {/* Label Header */}
                <div className="grid grid-cols-12 gap-6 px-8 py-5 bg-gray-50/50 border-b border-gray-50">
                  <div className="col-span-1" />
                  <div className="col-span-3 text-xs font-black text-gray-400 uppercase tracking-widest">Property Details</div>
                  <div className="col-span-2 text-xs font-black text-gray-400 uppercase tracking-widest">Location</div>
                  <div className="col-span-2 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Visibility</div>
                  <div className="col-span-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</div>
               </div>
               
               <AnimatePresence>
                 {hotels.map((hotel, idx) => (
                    <motion.div
                      key={hotel.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="grid grid-cols-12 gap-6 px-8 py-6 items-center border-b border-gray-50 hover:bg-[#F8FAFC]/50 transition-all group"
                    >
                       <div className="col-span-1">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm relative group-hover:rotate-6 transition-transform">
                             <img src={hotel.photos?.[0] || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" />
                             <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                       </div>

                       <div className="col-span-3">
                          <h4 
                            onClick={() => navigate(`/admin/hotels/${hotel.id}`)}
                            className="text-sm font-black text-[#0F172A] uppercase tracking-tighter mb-0.5 hover:text-[#0284C7] cursor-pointer transition-colors"
                          >
                            {hotel.name}
                          </h4>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest truncate">{hotel.amenities?.slice(0, 3).join(' · ')}</p>
                       </div>

                       <div className="col-span-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                             <MapPin size={14} className="text-[#0284C7]" />
                             <span>{hotel.city}</span>
                          </div>
                       </div>

                       <div className="col-span-2 flex justify-center">
                          <button 
                            onClick={() => handleToggleActive(hotel)}
                            disabled={togglingId === hotel.id}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest transition-all ${
                              hotel.active ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-100 text-gray-400 border-gray-200'
                            }`}
                          >
                             {hotel.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                             {hotel.active ? 'Online' : 'Offline'}
                          </button>
                       </div>

                       <div className="col-span-4 flex items-center justify-end gap-2">
                          <button onClick={() => navigate(`/admin/hotels/${hotel.id}/rooms`, { state: { hotelName: hotel.name } })} className="p-2.5 rounded-xl bg-[#0284C7]/5 text-[#0284C7] hover:bg-[#0284C7] hover:text-white transition-all group/btn" title="Manage Rooms">
                             <BedDouble size={18} />
                          </button>
                          <button onClick={() => navigate(`/admin/reports?hotelId=${hotel.id}`, { state: { hotelName: hotel.name } })} className="p-2.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-all" title="View Analytics">
                             <BarChart2 size={18} />
                          </button>
                          <div className="w-[1px] h-6 bg-gray-100 mx-1" />
                          <button onClick={() => openEdit(hotel)} className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-[#0F172A] transition-all">
                             <Edit2 size={16} />
                          </button>
                          <button onClick={() => setDeleteTarget(hotel)} className="p-2.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </motion.div>
                 ))}
               </AnimatePresence>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel, idx) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all group p-6"
                >
                  <div className="aspect-video rounded-[1.5rem] bg-gray-50 overflow-hidden mb-6 relative">
                     <img src={hotel.photos?.[0] || 'https://via.placeholder.com/300'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                     <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={() => openEdit(hotel)} className="p-2.5 rounded-xl bg-white/20 backdrop-blur-xl text-white border border-white/20 hover:bg-white hover:text-[#0F172A] transition-all"><Edit2 size={14} /></button>
                     </div>
                     {!hotel.active && <div className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-sm flex items-center justify-center font-black text-white text-xs uppercase tracking-[0.3em]">OFFLINE</div>}
                  </div>
                  
                  <div className="space-y-4">
                     <div>
                        <div className="flex items-center justify-between mb-1">
                           <h4 
                             onClick={() => navigate(`/admin/hotels/${hotel.id}`)}
                             className="text-lg font-black text-[#0F172A] uppercase tracking-tighter truncate hover:text-[#0284C7] cursor-pointer transition-colors"
                           >
                             {hotel.name}
                           </h4>
                           <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded-md ${hotel.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                              {hotel.active ? 'Live' : 'Off'}
                           </span>
                        </div>
                         <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                            <MapPin size={12} /> {hotel.city}
                         </div>
                     </div>
                                          <div className="grid grid-cols-2 gap-3 pt-2">
                        <button onClick={() => navigate(`/admin/hotels/${hotel.id}/rooms`)} className="flex items-center justify-center gap-2 py-3 bg-[#0F172A] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#0284C7] transition-all">Rooms</button>
                        <button onClick={() => navigate(`/admin/reports?hotelId=${hotel.id}`)} className="flex items-center justify-center gap-2 py-3 bg-gray-50 text-[#0F172A] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all">Reports</button>
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Global Stats Bar */}
        {!isLoading && hotels.length > 0 && (
          <div className="bg-[#0F172A] rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#0284C7]/10 blur-[100px] -mr-32 -mt-32" />
             <div className="flex items-center gap-10">
                <div className="text-center md:text-left">
                   <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">Total Hotels</p>
                   <p className="text-3xl font-black tracking-tighter">{hotels.length}</p>
                </div>
                <div className="w-[1px] h-10 bg-white/10 hidden md:block" />
                <div className="text-center md:text-left">
                   <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">Online</p>
                   <p className="text-3xl font-black text-green-400 tracking-tighter">{hotels.filter(h => h.active).length}</p>
                </div>
                <div className="w-[1px] h-10 bg-white/10 hidden md:block" />
                <div className="text-center md:text-left">
                   <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">Inactive</p>
                   <p className="text-3xl font-black text-gray-400 tracking-tighter">{hotels.filter(h => !h.active).length}</p>
                </div>
             </div>
              <button 
                onClick={() => {
                  console.log('Registering new property (Stats Bar)...');
                  openCreate();
                }}
                className="flex items-center gap-3 bg-white text-[#0F172A] px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#0284C7] hover:text-white cursor-pointer transition-all active:scale-95 shadow-xl shadow-white/5"
              >
                 Add New Hotel <ArrowRight size={14} />
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageHotelsPage;
