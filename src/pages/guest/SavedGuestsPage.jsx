import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { guestApi } from '../../api/guestApi';
import {
  UserCircle2, Plus, Edit2, Trash2, Loader2,
  ServerCrash, X, Check, RefreshCw, Users,
  Heart, User, ChevronRight, AlertCircle, Info,
  ArrowLeft
} from 'lucide-react';

const inputClass = 'w-full bg-white border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-[#0F172A] outline-none focus:border-[#0284C7] focus:ring-4 focus:ring-[#0284C7]/10 transition-all placeholder:text-gray-300';
const labelClass = 'block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1';

const GuestFormModal = ({ onClose, onSave, initial }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (initial) {
      reset({ name: initial.name, gender: initial.gender, age: initial.age });
    } else {
      reset({ name: '', gender: 'MALE', age: '' });
    }
  }, [initial, reset]);

  return (
    <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] w-full max-w-md overflow-hidden border border-white/20"
      >
        <div className="p-8 pb-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-black text-[#0284C7] uppercase tracking-widest bg-[#0284C7]/5 px-2 py-1 rounded-md mb-2 inline-block">
              {initial ? 'Edit Details' : 'New Guest'}
            </span>
            <h3 className="text-2xl font-black text-[#0F172A] tracking-tighter">{initial ? 'Modify Guest' : 'Add New Guest'}</h3>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#0F172A] transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                {...register('name', { required: 'Full name is required' })}
                placeholder="e.g. Vikram Malhotra"
                className={inputClass}
              />
              {errors.name && <p className="text-xs text-red-500 font-bold mt-2 ml-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Gender</label>
                <select {...register('gender')} className={`${inputClass} appearance-none`}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Age</label>
                <input
                  type="number"
                  {...register('age', { required: 'Age is mandatory', min: 1 })}
                  placeholder="e.g. 28"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition">
              Cancel
            </button>
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-4 text-xs font-black text-white bg-[#0F172A] hover:bg-[#0284C7] rounded-2xl transition shadow-xl shadow-[#0F172A]/20 active:scale-95">
              <Check size={16} /> {initial ? 'Save Changes' : 'Save Guest'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const SavedGuestsPage = () => {
  const navigate = useNavigate();
  const [guests, setGuests]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editGuest, setEditGuest] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await guestApi.getGuests();
      const pageObj = res.data?.data ?? res.data;
      // Handle both Page format and direct array
      const content = Array.isArray(pageObj?.content) ? pageObj.content 
                    : Array.isArray(pageObj) ? pageObj 
                    : [];
      setGuests(content);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load guest profiles.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGuests(); }, [fetchGuests]);

  const handleSave = async (formData) => {
    try {
      if (editGuest) {
        // Point 9 Fix: Ensure updateGuest uses correct ID and data mapping
        const res = await guestApi.updateGuest(editGuest.id, { ...formData, age: Number(formData.age) });
        const updated = res.data?.data ?? res.data;
        setGuests(prev => prev.map(g => g.id === editGuest.id ? updated : g));
      } else {
        const res = await guestApi.createGuest({ ...formData, age: Number(formData.age) });
        const created = res.data?.data ?? res.data;
        setGuests(prev => [...prev, created]);
      }
      setModalOpen(false);
      setEditGuest(null);
    } catch (err) {
      console.error('Error saving guest:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this profile?')) return;
    setDeletingId(id);
    try {
      await guestApi.deleteGuest(id);
      setGuests(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-[#0284C7] transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
            <div className="space-y-2">
              <span className="px-3 py-1 bg-[#0284C7]/10 rounded-full text-xs font-black tracking-widest text-[#0284C7] uppercase">
                My Account
              </span>
              <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">Saved Guests</h1>
              <p className="text-sm font-medium text-gray-400">Manage your frequent travelers for faster booking.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchGuests}
              disabled={loading}
              className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#0284C7] transition-all shadow-sm active:rotate-180"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => { setEditGuest(null); setModalOpen(true); }}
              className="flex items-center gap-3 bg-[#0F172A] text-white px-8 py-3.5 rounded-[1.25rem] font-black text-xs uppercase tracking-widest hover:bg-[#0284C7] transition-all shadow-xl shadow-[#0F172A]/10"
            >
              <Plus size={16} /> {guests.length === 0 ? 'Add First Guest' : 'Add New Guest'}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 p-6 rounded-[2rem] text-sm font-bold mb-8">
            <AlertCircle size={20} /> <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="h-48 rounded-[2rem] bg-white border border-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-200" size={32} />
              </div>
            ))}
          </div>
        )}

        {!loading && guests.length === 0 && !error && (
          <div className="bg-white rounded-[3rem] border border-gray-100 p-20 text-center shadow-sm">
            <Users size={64} className="mx-auto text-gray-100 mb-8" />
            <h3 className="text-2xl font-black text-[#0F172A] tracking-tighter mb-2">No Saved Guests</h3>
            <p className="text-sm text-gray-400 font-medium mb-10">You haven't added any travelers to your list yet.</p>
            <button
              onClick={() => { setEditGuest(null); setModalOpen(true); }}
              className="inline-flex items-center gap-3 bg-[#0284C7] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0F172A] transition-all"
            >
              <Plus size={18} /> Add Your First Guest
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {!loading && guests.map((guest, idx) => (
              <motion.div
                key={guest.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-[2.5rem] border border-gray-50 p-6 shadow-sm hover:shadow-2xl transition-all group flex flex-col"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-tr from-[#0284C7] to-[#0F172A] flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-[#0284C7]/20">
                    {guest.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => { setEditGuest(guest); setModalOpen(true); }}
                      className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-[#0284C7] hover:bg-[#0284C7]/10 flex items-center justify-center transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(guest.id)}
                      disabled={deletingId === guest.id}
                      className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all disabled:opacity-50"
                    >
                      {deletingId === guest.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-black text-[#0F172A] tracking-tighter leading-tight mb-1">{guest.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{guest.gender}</span>
                    <div className="w-1 h-1 rounded-full bg-gray-200" />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Age {guest.age}</span>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {modalOpen && (
        <GuestFormModal
          initial={editGuest}
          onClose={() => { setModalOpen(false); setEditGuest(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default SavedGuestsPage;
