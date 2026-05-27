import { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, Bed, Users, 
  ChevronLeft, RefreshCw, BarChart, 
  Settings2, AlertCircle, Building2,
  Maximize2, ArrowRight, Layers
} from 'lucide-react';
import { adminHotelApi } from '../../api/hotelApi';
import RoomFormModal from '../../components/admin/RoomFormModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const SkeletonSuite = () => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row items-center gap-10 animate-pulse">
    <div className="w-full md:w-40 h-40 rounded-[2rem] bg-gray-50" />
    <div className="flex-1 space-y-4">
      <div className="h-6 bg-gray-50 rounded w-1/3" />
      <div className="h-3 bg-gray-50 rounded w-1/2" />
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-gray-50 rounded-md" />
        <div className="h-6 w-16 bg-gray-50 rounded-md" />
      </div>
    </div>
    <div className="flex flex-col items-end gap-2">
      <div className="h-8 w-24 bg-gray-50 rounded-xl" />
      <div className="flex gap-2">
        <div className="w-10 h-10 bg-gray-50 rounded-xl" />
        <div className="w-10 h-10 bg-gray-50 rounded-xl" />
      </div>
    </div>
  </div>
);

const ManageRoomsPage = () => {
  const { hotelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const hotelName = location.state?.hotelName || 'Property';

  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminHotelApi.getRooms(hotelId);
      const data = res.data?.data ?? res.data;
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load rooms.');
    } finally {
      setIsLoading(false);
    }
  }, [hotelId]);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingRoom) {
        await adminHotelApi.updateRoom(hotelId, editingRoom.id, data);
      } else {
        await adminHotelApi.createRoom(hotelId, data);
      }
      setModalOpen(false);
      setEditingRoom(null);
      fetchRooms();
    } catch (err) {
      console.error('Suite save error:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const openCreate = () => { setEditingRoom(null); setModalOpen(true); };
  const openEdit = (room) => { setEditingRoom(room); setModalOpen(true); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await adminHotelApi.deleteRoom(hotelId, deleteTarget.id);
      setDeleteTarget(null);
      fetchRooms();
    } catch (err) {
      console.error('Deletion error:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-screen-2xl mx-auto px-6 py-16 space-y-12">

        {/* ─── Breadcrumbs & Header ─────────────────────────────────────────── */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
          <div className="space-y-6">
            <button 
              onClick={() => navigate('/admin/hotels')} 
              className="flex items-center gap-3 text-sm font-black text-gray-400 uppercase tracking-[0.2em] hover:text-[#0284C7] transition-all group"
            >
              <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Return to Properties
            </button>
            <div className="space-y-3">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-2xl bg-[#0284C7] flex items-center justify-center text-white shadow-xl shadow-[#0284C7]/20">
                    <Layers size={28} />
                 </div>
                 <div>
                    <h1 className="text-5xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">{hotelName}</h1>
                    <p className="text-[#0284C7] font-black text-xs uppercase tracking-[0.4em] mt-3">Room Type Management & Configurations</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
             <button
               onClick={fetchRooms}
               disabled={isLoading}
               className="p-5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#0F172A] hover:border-gray-300 transition-all shadow-sm"
             >
               <RefreshCw size={24} className={isLoading ? 'animate-spin' : ''} />
             </button>
             <button
               onClick={openCreate}
               className="flex items-center gap-4 bg-[#0F172A] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#0284C7] transition-all shadow-2xl shadow-[#0F172A]/20 active:scale-95"
             >
               <Plus size={20} />
               <span>Add Room Type</span>
             </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex items-center gap-4 text-xs font-black text-red-700 uppercase tracking-wider">
             <AlertCircle size={20} />
             <span>{error}</span>
          </div>
        )}

        {/* ─── Room Cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-8">
           {isLoading ? (
             [1, 2, 3].map(i => <SkeletonSuite key={i} />)
           ) : rooms.length === 0 ? (
             <div className="py-32 bg-white rounded-[3rem] border border-gray-100 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mb-6">
                   <Bed size={32} />
                </div>
                <h3 className="text-xl font-black text-[#0F172A] uppercase tracking-tighter mb-2">No Rooms Defined</h3>
                <p className="text-sm text-gray-400 font-medium mb-8">This property needs room types to accept bookings.</p>
                <button onClick={openCreate} className="text-[#0284C7] font-black text-xs uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all">Add Your First Room →</button>
             </div>
           ) : (
             <AnimatePresence>
                {rooms.map((room, idx) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-[3rem] border border-gray-100 p-8 md:p-10 flex flex-col md:flex-row items-center gap-10 shadow-sm hover:shadow-2xl transition-all group"
                  >
                    {/* Thumbnail placeholder */}
                    <div className="w-full md:w-48 h-48 rounded-[2.5rem] bg-gray-50 flex items-center justify-center text-gray-200 relative overflow-hidden shrink-0 group-hover:bg-[#0284C7]/5 transition-colors">
                       <Bed size={40} className="group-hover:text-[#0284C7] transition-colors" />
                       <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-xs font-black text-gray-400 uppercase tracking-widest shadow-sm">ID: {room.id}</span>
                       </div>
                    </div>

                    <div className="flex-1 space-y-4 text-center md:text-left">
                       <div>
                          <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                             <h4 className="text-2xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">{room.type}</h4>
                             <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs font-black uppercase tracking-widest rounded-md border border-green-100">Active</span>
                          </div>
                          <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-black text-gray-400 uppercase tracking-widest">
                             <span className="flex items-center gap-1.5"><Users size={12} className="text-[#0284C7]" /> Max Sleep: {room.capacity}</span>
                             <span className="w-1.5 h-1.5 rounded-full bg-gray-100" />
                             <span className="flex items-center gap-1.5"><Maximize2 size={12} className="text-[#F97316]" /> {room.totalCount} total rooms</span>
                          </div>
                       </div>
                       
                       <div className="flex flex-wrap justify-center md:justify-start gap-2">
                          {(room.amenities || []).map(a => (
                            <span key={a} className="px-2.5 py-1 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest rounded-lg border border-gray-50">{a}</span>
                          ))}
                       </div>
                    </div>

                    <div className="text-center md:text-right shrink-0 md:pl-12 md:border-l border-gray-50 space-y-4 min-w-[200px]">
                       <div>
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-1">Base Price</p>
                          <p className="text-5xl font-black text-[#0F172A] tracking-tighter leading-none">₹{room.basePrice?.toLocaleString()}</p>
                       </div>
                       
                       <div className="flex items-center justify-center md:justify-end gap-2 pt-2">
                          <button 
                            onClick={() => navigate(`/admin/hotels/${hotelId}/rooms/${room.id}/inventory`, { state: { hotelName, roomType: room.type } })}
                            className="p-3.5 bg-[#0F172A] text-white rounded-2xl hover:bg-[#0284C7] transition-all shadow-lg active:scale-95"
                            title="Manage Availability"
                          >
                             <BarChart size={18} />
                          </button>
                          <button onClick={() => openEdit(room)} className="p-3.5 bg-gray-50 text-gray-400 hover:text-[#0F172A] rounded-2xl hover:bg-gray-100 transition-all" title="Edit Room">
                             <Edit2 size={18} />
                          </button>
                          <button onClick={() => setDeleteTarget(room)} className="p-3.5 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all" title="Delete Room">
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                  </motion.div>
                ))}
             </AnimatePresence>
           )}
        </div>

        {/* Global Action Footer */}
        {!isLoading && rooms.length > 0 && (
           <div className="bg-[#0F172A] rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#0284C7]/10 blur-[100px] -mr-32 -mt-32" />
              <div className="space-y-1">
                 <p className="text-xs font-black text-[#0284C7] uppercase tracking-[0.3em]">System Status</p>
                 <p className="text-xl font-bold tracking-tight">Room details are saved and live in the system.</p>
              </div>
              <button onClick={openCreate} className="px-10 py-4 bg-white text-[#0F172A] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0284C7] hover:text-white transition-all shadow-xl shadow-white/5 flex items-center gap-2">
                 New Room Type <ArrowRight size={16} />
              </button>
           </div>
        )}

      </div>

      {/* ─── MODALS ───────────────────────────────────────────────────────── */}
      <RoomFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingRoom(null); }}
        onSubmit={handleFormSubmit}
        initialData={editingRoom}
        isLoading={formLoading}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete Room Type: "${deleteTarget?.type}"?`}
        message="This will permanently delete this room type and its availability. This action cannot be undone."
        confirmLabel="Confirm Delete"
        isDangerous
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default ManageRoomsPage;
