import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Trash2, Plus, Bed, DollarSign, Users, Maximize2, Sparkles, Image as ImageIcon, RefreshCw, AlertCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import { motion, AnimatePresence } from 'framer-motion';

const ROOM_TYPES = ['STANDARD', 'DELUXE', 'SUITE', 'PREMIUM', 'VILLA', 'PENTHOUSE'];
const ROOM_AMENITY_OPTIONS = ['AC', 'MINIBAR', 'TV', 'WIFI', 'SAFE', 'BATHTUB', 'BALCONY', 'KITCHEN', 'JACUZZI', 'SEA_VIEW', 'COFFEE_MAKER', 'HAIR_DRYER', 'IRON', 'WORK_DESK', 'ROOM_SERVICE', 'SOUNDPROOFING'];

const RoomFormModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: 'STANDARD',
      basePrice: '',
      totalCount: '',
      capacity: '',
      photos: [''],
      amenities: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          type: initialData.type || 'STANDARD',
          basePrice: initialData.basePrice || '',
          totalCount: initialData.totalCount || '',
          capacity: initialData.capacity || '',
          photos: initialData.photos?.length ? initialData.photos : [''],
          amenities: initialData.amenities || [],
        });
      } else {
        reset({ type: 'STANDARD', basePrice: '', totalCount: '', capacity: '', photos: [''], amenities: [] });
      }
    }
  }, [isOpen, initialData, reset]);

  const photos = watch('photos') || [''];
  const selectedAmenities = watch('amenities') || [];

  const addPhoto = () => setValue('photos', [...photos, '']);
  const removePhoto = (idx) => setValue('photos', photos.filter((_, i) => i !== idx));

  const toggleAmenity = (a) => {
    if (selectedAmenities.includes(a)) {
      setValue('amenities', selectedAmenities.filter((x) => x !== a));
    } else {
      setValue('amenities', [...selectedAmenities, a]);
    }
  };

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      basePrice: parseFloat(data.basePrice),
      totalCount: parseInt(data.totalCount, 10),
      capacity: parseInt(data.capacity, 10),
      photos: (data.photos || []).filter((p) => p.trim() !== ''),
    });
  };

  const inputClass = 'w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-xs font-bold text-[#0F172A] outline-none focus:border-[#0284C7] focus:ring-4 focus:ring-[#0284C7]/5 transition-all placeholder:text-gray-300';
  const labelClass = 'block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Room Type' : 'Add New Room Type'}
      subtitle="Configure pricing and availability for your property rooms."
      width="max-w-3xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-10">

        {/* ─── SECTION: SUITE SPECIFICATIONS ────────────────────────── */}
        <section className="space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0284C7]/10 flex items-center justify-center text-[#0284C7]">
                 <Bed size={16} />
              </div>
              <h3 className="text-xs font-black text-[#0284C7] uppercase tracking-[0.3em]">Room Configuration</h3>
           </div>
           
           <div className="space-y-5">
              <div>
                 <label className={labelClass}>Variant Classification *</label>
                 <select
                   {...register('type', { required: 'Classification is required' })}
                   className={`${inputClass} appearance-none uppercase tracking-tighter`}
                 >
                   {ROOM_TYPES.map((t) => (
                     <option key={t} value={t}>{t}</option>
                   ))}
                 </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                 <div>
                    <label className={labelClass}>Baseline (₹)</label>
                    <div className="relative">
                       <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                       <input
                         type="number"
                         step="0.01"
                         {...register('basePrice', { required: true })}
                         className={`${inputClass} pl-10`}
                         placeholder="1500"
                       />
                    </div>
                 </div>
                 <div>
                    <label className={labelClass}>Total Units</label>
                    <div className="relative">
                       <Maximize2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                       <input
                         type="number"
                         {...register('totalCount', { required: true })}
                         className={`${inputClass} pl-10`}
                         placeholder="10"
                       />
                    </div>
                 </div>
                 <div>
                    <label className={labelClass}>Capacity</label>
                    <div className="relative">
                       <Users size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                       <input
                         type="number"
                         {...register('capacity', { required: true })}
                         className={`${inputClass} pl-10`}
                         placeholder="2"
                       />
                    </div>
                 </div>
              </div>

              <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
                 <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                 <p className="text-xs font-bold text-amber-700 leading-relaxed uppercase tracking-tight">
                    Baseline updates will automatically propagate to all future non-reserved temporal inventory nodes.
                 </p>
              </div>
           </div>
        </section>

        {/* ─── SECTION: AMENITIES ────────────────────────────────────────── */}
        <section className="space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                 <Sparkles size={16} />
              </div>
              <h3 className="text-xs font-black text-green-600 uppercase tracking-[0.3em]">Amenities</h3>
           </div>
           
           <div className="flex flex-wrap gap-2.5 p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100">
              {ROOM_AMENITY_OPTIONS.map((a) => {
                const isSelected = selectedAmenities.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                      isSelected 
                        ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-lg' 
                        : 'bg-white text-gray-400 border-gray-100 hover:border-[#0284C7]'
                    }`}
                  >
                    {a.replace('_', ' ')}
                  </button>
                );
              })}
           </div>
        </section>

        {/* ─── SECTION: VISUAL ASSETS ────────────────────────────────────── */}
        <section className="space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                 <ImageIcon size={16} />
              </div>
              <h3 className="text-xs font-black text-purple-600 uppercase tracking-[0.3em]">Room Images</h3>
           </div>
           
           <div className="space-y-4">
              <AnimatePresence>
                {photos.map((url, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <div className="w-full sm:w-28 h-20 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden shrink-0 relative">
                       {url ? (
                         <img src={url} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150?text=Error'; }} />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={20} /></div>
                       )}
                    </div>
                    <div className="flex-1 flex gap-3">
                      <input
                        {...register(`photos.${idx}`)}
                        className={`${inputClass} self-start`}
                        placeholder="https://cdn.lux.io/room-v1.jpg"
                      />
                      {photos.length > 1 && (
                        <button type="button" onClick={() => removePhoto(idx)} className="p-3.5 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all self-start h-[46px]">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button
                type="button"
                onClick={addPhoto}
                className="flex items-center gap-2 px-6 py-3 border border-dashed border-gray-200 rounded-2xl text-xs font-black text-gray-400 uppercase tracking-widest hover:border-[#0284C7] hover:text-[#0F172A] transition-all"
              >
                <Plus size={14} /> Add Reference URL
              </button>
           </div>
        </section>

        {/* ─── SUBMIT ────────────────────────────────────────────────────── */}
        <div className="sticky bottom-0 -mx-8 -mb-6 px-8 py-6 bg-white/90 backdrop-blur-xl border-t border-gray-100 flex gap-4 z-50 mt-10">
           <button
             type="button"
             onClick={onClose}
             className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
           >
             Abort
           </button>
           <button
             type="submit"
             disabled={isLoading}
             className="flex-3 py-4 bg-[#0F172A] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0284C7] transition-all shadow-xl shadow-[#0F172A]/20 flex items-center justify-center gap-3 px-12"
           >
             {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
             <span>{isEditing ? 'Commit Changes' : 'Initialize Suite'}</span>
           </button>
        </div>
      </form>
    </Modal>
  );
};

export default RoomFormModal;
