import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Trash2, Building2, MapPin, Mail, Phone, Maximize2, Sparkles, Image as ImageIcon, RefreshCw } from 'lucide-react';
import SlideOver from '../ui/SlideOver';
import { motion, AnimatePresence } from 'framer-motion';

const AMENITY_OPTIONS = ['WIFI', 'POOL', 'SPA', 'GYM', 'PARKING', 'RESTAURANT', 'BAR', 'ROOM_SERVICE', 'AC', 'LAUNDRY'];

const HotelFormModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
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
      name: '',
      city: '',
      photos: [''],
      amenities: [],
      contactInfo: { address: '', phoneNumber: '', email: '', location: '' },
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name || '',
          city: initialData.city || '',
          photos: initialData.photos?.length ? initialData.photos : [''],
          amenities: initialData.amenities || [],
          contactInfo: {
            address: initialData.contactInfo?.address || '',
            phoneNumber: initialData.contactInfo?.phoneNumber || '',
            email: initialData.contactInfo?.email || '',
            location: initialData.contactInfo?.location || '',
          },
        });
      } else {
        reset({
           name: '', city: '', photos: [''], amenities: [],
           contactInfo: { address: '', phoneNumber: '', email: '', location: '' }
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const photos = watch('photos') || [''];
  const selectedAmenities = watch('amenities') || [];

  const addPhotoField = () => setValue('photos', [...photos, '']);
  const removePhotoField = (idx) => setValue('photos', photos.filter((_, i) => i !== idx));

  const toggleAmenity = (amenity) => {
    const current = selectedAmenities;
    if (current.includes(amenity)) {
      setValue('amenities', current.filter((a) => a !== amenity));
    } else {
      setValue('amenities', [...current, amenity]);
    }
  };

  const handleFormSubmit = (data) => {
    const cleaned = {
      ...data,
      photos: (data.photos || []).filter((p) => p.trim() !== ''),
    };
    onSubmit(cleaned);
  };

  const inputClass = 'w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 text-xs font-bold text-[#0F172A] outline-none focus:border-[#0284C7] focus:ring-4 focus:ring-[#0284C7]/5 transition-all placeholder:text-gray-300';
  const labelClass = 'block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1';

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Update Property' : 'Add New Property'}
      subtitle={isEditing ? `Modifying Record: ${initialData?.name}` : 'Register a new property to the Nox management system.'}
      width="max-w-xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-10 pb-20">

        {/* ─── SECTION: IDENTITY ────────────────────────────────────────── */}
        <section className="space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0284C7]/10 flex items-center justify-center text-[#0284C7]">
                 <Building2 size={16} />
              </div>
              <h3 className="text-xs font-black text-[#0284C7] uppercase tracking-[0.3em]">Basic Information</h3>
           </div>
           
           <div className="grid grid-cols-1 gap-6">
              <div>
                 <label className={labelClass}>Property Name *</label>
                 <input
                   {...register('name', { required: 'Property name is required' })}
                   className={inputClass}
                   placeholder="e.g., Nox Grand Royale"
                 />
                 {errors.name && <p className="text-xs font-bold text-red-500 mt-2 ml-1">{errors.name.message}</p>}
              </div>
              <div>
                 <label className={labelClass}>City *</label>
                 <input
                   {...register('city', { required: 'City is required' })}
                   className={inputClass}
                   placeholder="e.g., Mumbai"
                 />
                 {errors.city && <p className="text-xs font-bold text-red-500 mt-2 ml-1">{errors.city.message}</p>}
              </div>
           </div>
        </section>

        {/* ─── SECTION: CONTACT & GEOLOCATION ────────────────────────────── */}
        <section className="space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center text-[#F97316]">
                 <MapPin size={16} />
              </div>
              <h3 className="text-xs font-black text-[#F97316] uppercase tracking-[0.3em]">Contact & Location</h3>
           </div>
           
           <div className="space-y-5">
              <div>
                 <label className={labelClass}>Physical Address *</label>
                 <textarea
                   {...register('contactInfo.address', { required: 'Address is required' })}
                   rows={2}
                   className={`${inputClass} resize-none`}
                   placeholder="Architectural Coordinate Details..."
                 />
                 {errors.contactInfo?.address && <p className="text-xs font-bold text-red-500 mt-2 ml-1">{errors.contactInfo.address.message}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className={labelClass}>Phone Number</label>
                    <input {...register('contactInfo.phoneNumber')} className={inputClass} placeholder="+91..." />
                 </div>
                 <div>
                    <label className={labelClass}>Email Address</label>
                    <input {...register('contactInfo.email')} className={inputClass} placeholder="hotel@example.com" />
                 </div>
              </div>

              <div>
                 <label className={labelClass}>Precise Coordinates (Lat,Lng)</label>
                 <input {...register('contactInfo.location')} className={inputClass} placeholder="18.9220, 72.8347" />
              </div>
           </div>
        </section>

        {/* ─── SECTION: AMENITIES ────────────────────────────────────────── */}
        <section className="space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                 <Sparkles size={16} />
              </div>
              <h3 className="text-xs font-black text-green-600 uppercase tracking-[0.3em]">Amenities & Specs</h3>
           </div>
           
           <div className="flex flex-wrap gap-2.5 p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100">
              {AMENITY_OPTIONS.map((a) => {
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
                    {a}
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
              <h3 className="text-xs font-black text-purple-600 uppercase tracking-[0.3em]">Photos & Gallery</h3>
           </div>
           
           <div className="space-y-4">
              <AnimatePresence>
                {photos.map((_, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex gap-3"
                  >
                    <input
                      {...register(`photos.${idx}`)}
                      className={inputClass}
                      placeholder="https://cdn.lux.io/asset-v1.jpg"
                    />
                    {photos.length > 1 && (
                      <button type="button" onClick={() => removePhotoField(idx)} className="p-3.5 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <button
                type="button"
                onClick={addPhotoField}
                className="flex items-center gap-2 px-6 py-3 border border-dashed border-gray-200 rounded-2xl text-xs font-black text-gray-400 uppercase tracking-widest hover:border-[#0284C7] hover:text-[#0F172A] transition-all"
              >
                <Plus size={14} /> Add Image URL
              </button>
           </div>
        </section>

        {/* ─── SUBMIT ────────────────────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-white/90 backdrop-blur-xl border-t border-gray-100 flex gap-4 z-50">
           <button
             type="button"
             onClick={onClose}
             className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
           >
             Cancel
           </button>
           <button
             type="submit"
             disabled={isLoading}
             className="flex-3 py-4 bg-[#0F172A] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0284C7] transition-all shadow-xl shadow-[#0F172A]/20 flex items-center justify-center gap-3 px-12"
           >
             {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Maximize2 size={16} />}
             <span>{isEditing ? 'Save Changes' : 'Register Hotel'}</span>
           </button>
        </div>
      </form>
    </SlideOver>
  );
};

export default HotelFormModal;
