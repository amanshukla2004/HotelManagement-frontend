import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  X, Calendar, Users, CreditCard, CheckCircle2,
  ChevronRight, Loader2, Plus, Minus, UserCircle2,
  ArrowLeft, AlertCircle, RefreshCcw, ShieldCheck,
  Check, UserPlus, Info
} from 'lucide-react';
import { bookingApi } from '../../api/bookingApi';
import { guestApi } from '../../api/guestApi';

// ── Step indicator (Redesigned) ──────────────────────────────────────────────
const STEPS = ['Dates', 'Guests', 'Payment', 'Confirmed'];

const StepBar = ({ current }) => (
  <div className="flex items-center justify-between px-2 mb-10">
    {STEPS.map((label, i) => (
      <div key={label} className="flex flex-col items-center gap-2 flex-1 relative">
        <div className={`relative z-10 w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-500 border ${
          i < current ? 'bg-[#635BFF] text-white border-transparent shadow-lg shadow-[#635BFF]/30' :
          i === current ? 'bg-[#0A2540] text-white border-transparent' : 'bg-white text-gray-300 border-gray-100'
        }`}>
          {i < current ? <Check size={14} /> : i + 1}
        </div>
        <span className={`text-xs font-black uppercase tracking-widest transition-colors duration-500 ${
          i <= current ? 'text-[#0A2540]' : 'text-gray-300'
        }`}>
          {label}
        </span>
        {i < STEPS.length - 1 && (
          <div className={`absolute left-1/2 top-4 w-full h-[1px] -z-0 transition-all duration-700 ${
            i < current ? 'bg-[#635BFF]' : 'bg-gray-100'
          }`} style={{ width: 'calc(100% - 32px)', left: 'calc(50% + 16px)' }} />
        )}
      </div>
    ))}
  </div>
);

// ── Utility ───────────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().split('T')[0];

const inputClass = 'w-full bg-gray-50 border border-transparent rounded-2xl px-4 py-3 text-sm font-bold text-[#0A2540] focus:bg-white focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/5 outline-none transition-all placeholder:text-gray-300';
const labelClass = 'block text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1';

const BookingDialog = ({ hotel, room, onClose }) => {
  const [step, setStep] = useState(0);
  const [bookingId, setBookingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Step 2: companions
  const [savedGuests, setSavedGuests] = useState([]);
  const [guestsLoading, setGuestsLoading] = useState(false);
  const [selectedGuestIds, setSelectedGuestIds] = useState([]);
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: '', gender: 'MALE', age: '' });
  const [addingGuest, setAddingGuest] = useState(false);

  // Step 4: confirmation / polling
  const [bookingStatus, setBookingStatus] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const pollRef = useRef(null);

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
    defaultValues: {
      checkInDate: todayStr(),
      checkOutDate: '',
      roomsCount: 1,
    }
  });

  // Smart Pre-fill logic
  useEffect(() => {
    const saved = localStorage.getItem('lastSearch');
    if (saved) {
      const { startDate, endDate, roomsCount } = JSON.parse(saved);
      reset({
        checkInDate: startDate || todayStr(),
        checkOutDate: endDate || '',
        roomsCount: roomsCount || 1
      });
    }
  }, [reset]);

  const checkinValue = watch('checkInDate');

  // Fetch saved guests when reaching step 1
  useEffect(() => {
    if (step !== 1) return;
    setGuestsLoading(true);
    guestApi.getGuests()
      .then(res => {
         const raw = res.data?.data ?? res.data;
         setSavedGuests(Array.isArray(raw?.content) ? raw.content : Array.isArray(raw) ? raw : []);
      })
      .catch(() => setSavedGuests([]))
      .finally(() => setGuestsLoading(false));
  }, [step]);

  // Point 10 Fix: Robust Status Polling
  const pollStatus = (bId) => {
    if (pollRef.current) clearInterval(pollRef.current);
    setIsPolling(true);
    let attempts = 0;
    const maxAttempts = 30; // 60 seconds total

    pollRef.current = setInterval(async () => {
      attempts++;
      try {
        const res = await bookingApi.getStatus(bId);
        const status = res.data?.data?.bookingStatus ?? res.data?.bookingStatus;
        setBookingStatus(status);
        
        if (status === 'CONFIRMED') {
          clearInterval(pollRef.current);
          setIsPolling(false);
          setStep(3); // Go to success step
          setLoading(false);
        } else if (status === 'CANCELLED' || attempts >= maxAttempts) {
          clearInterval(pollRef.current);
          setIsPolling(false);
          setStep(3); // Go to final step (even if pending)
          setLoading(false);
        }
      } catch (err) {
        if (attempts >= maxAttempts) {
          clearInterval(pollRef.current);
          setIsPolling(false);
          setStep(3);
          setLoading(false);
        }
      }
    }, 2000);
  };

  useEffect(() => () => { if(pollRef.current) clearInterval(pollRef.current); }, []);

  const handleInitBooking = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        hotelId: hotel.id,
        roomId: room.id,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        roomsCount: Number(formData.roomsCount),
      };
      const res = await bookingApi.initBooking(payload);
      const data = res.data?.data ?? res.data;
      setBookingId(data?.id ?? data?.bookingId ?? data);
      setBookingDetails(data);
      setStep(1);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Booking failed. Please check your dates.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingApi.addGuests(bookingId, selectedGuestIds);
      setBookingDetails(res.data?.data ?? res.data);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to add guests.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGuest = async () => {
    if (!newGuest.name.trim()) return;
    setAddingGuest(true);
    try {
      const res = await guestApi.createGuest({ ...newGuest, age: Number(newGuest.age) });
      const created = res.data?.data ?? res.data;
      setSavedGuests(prev => [...prev, created]);
      setSelectedGuestIds(prev => [...prev, created.id]);
      setShowAddGuest(false);
      setNewGuest({ name: '', gender: 'MALE', age: '' });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Guest save failed.');
    } finally {
      setAddingGuest(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingApi.startPayment(bookingId);
      const data = res.data?.data ?? res.data;
      
      if (data?.sessionUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.sessionUrl;
      } else {
        // Fallback to polling if sessionUrl is missing
        pollStatus(bookingId);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Payment system error.');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#0A2540]/60 backdrop-blur-md z-[150] flex items-center justify-center p-4 overflow-y-auto"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] w-full max-w-xl overflow-hidden relative"
          onClick={e => e.stopPropagation()}
        >
          {/* Top Bar Decor */}
          <div className="h-2 bg-gradient-to-r from-[#635BFF] to-[#0A2540] w-full" />

          <div className="px-8 pt-8 pb-4 flex items-start justify-between">
            <div>
               <h2 className="text-3xl font-black text-[#0A2540] tracking-tighter uppercase leading-none mb-2">Book Your Stay</h2>
               <div className="flex items-center gap-2 text-xs font-black text-[#635BFF] uppercase tracking-[0.2em]">
                 <ShieldCheck size={14} /> Secure Connection
               </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#0A2540] transition-colors"><X size={20} /></button>
          </div>

          <div className="px-8 pb-10">
            <StepBar current={step} />

            {error && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl text-xs font-black uppercase tracking-wider mb-6">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}

            {/* ── STEP 0: STAY DETAILS ────────────────────────────────────────────────── */}
            {step === 0 && (
              <form onSubmit={handleSubmit(handleInitBooking)} className="space-y-6">
                <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Room Type</p>
                    <h4 className="text-xl font-black text-[#0A2540] tracking-tighter uppercase">{room?.type}</h4>
                    <p className="text-xs font-black text-[#635BFF] uppercase tracking-widest">{hotel?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-[#0A2540] tracking-tighter">₹{room?.basePrice?.toLocaleString()}</p>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">PER NIGHT</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="cursor-pointer" onClick={() => document.getElementById('dialog-in').showPicker()}>
                    <label className={labelClass}>Check-In</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={16} />
                      <input id="dialog-in" type="date" min={todayStr()} {...register('checkInDate', { required: true })} className={`${inputClass} pl-12`} />
                    </div>
                  </div>
                  <div className="cursor-pointer" onClick={() => document.getElementById('dialog-out').showPicker()}>
                    <label className={labelClass}>Check-Out</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={16} />
                      <input id="dialog-out" type="date" min={checkinValue || todayStr()} {...register('checkOutDate', { required: true })} className={`${inputClass} pl-12`} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Room Configuration</label>
                  <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4">
                     <span className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex-1">Number of Units</span>
                     <div className="flex items-center gap-4">
                        {/* Placeholder for real counter if needed, but input works */}
                        <input type="number" min={1} max={room?.totalCount} {...register('roomsCount')} className="w-16 bg-white border border-gray-100 rounded-xl text-center py-2 font-black text-[#0A2540]" />
                     </div>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-5 bg-[#0A2540] hover:bg-[#635BFF] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-[#0A2540]/20 flex items-center justify-center gap-3 active:scale-[0.98]">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <ChevronRight size={18} />}
                  {loading ? 'Processing...' : 'Confirm Dates'}
                </button>
              </form>
            )}

            {/* ── STEP 1: GUESTS ──────────────────────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                   <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Guest Details</h4>
                   {selectedGuestIds.length > 0 && <span className="text-xs font-black text-[#635BFF] bg-[#635BFF]/5 px-2 py-0.5 rounded-md uppercase tracking-widest">{selectedGuestIds.length} Selected</span>}
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {guestsLoading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-200" size={32} /></div>
                  ) : savedGuests.length === 0 && !showAddGuest ? (
                    <div className="bg-gray-50 rounded-3xl p-10 text-center text-gray-400 border border-dashed border-gray-200">
                      <UserCircle2 size={40} className="mx-auto mb-4 opacity-20" />
                      <p className="text-xs font-black uppercase tracking-widest">No saved profiles found</p>
                    </div>
                  ) : (
                    savedGuests.map(g => (
                      <button
                        key={g.id}
                        onClick={() => setSelectedGuestIds(p => p.includes(g.id) ? p.filter(x => x !== g.id) : [...p, g.id])}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                          selectedGuestIds.includes(g.id) ? 'border-[#635BFF] bg-[#635BFF]/5 ring-2 ring-[#635BFF]/10' : 'border-gray-50 bg-white hover:border-gray-200 shadow-sm'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shadow-sm ${selectedGuestIds.includes(g.id) ? 'bg-[#635BFF] text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {g.name[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 text-left">
                           <p className="text-sm font-black text-[#0A2540] tracking-tight">{g.name}</p>
                           <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{g.gender} · {g.age} yrs</p>
                        </div>
                        {selectedGuestIds.includes(g.id) && <CheckCircle2 size={18} className="text-[#635BFF]" />}
                      </button>
                    ))
                  )}
                </div>

                {showAddGuest ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-4">
                     <p className="text-xs font-black text-[#635BFF] uppercase tracking-widest mb-4">Add Guest</p>
                     <input placeholder="Full Name" value={newGuest.name} onChange={e => setNewGuest(p => ({...p, name: e.target.value}))} className={inputClass} />
                     <div className="grid grid-cols-2 gap-4">
                        <select value={newGuest.gender} onChange={e => setNewGuest(p => ({...p, gender: e.target.value}))} className={`${inputClass} appearance-none`}>
                           <option value="MALE">Male</option>
                           <option value="FEMALE">Female</option>
                           <option value="OTHER">Other</option>
                        </select>
                        <input type="number" placeholder="Age" value={newGuest.age} onChange={e => setNewGuest(p => ({...p, age: e.target.value}))} className={inputClass} />
                     </div>
                     <div className="flex gap-2 pt-2">
                        <button onClick={() => setShowAddGuest(false)} className="flex-1 py-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-white rounded-xl transition">Dismiss</button>
                        <button onClick={handleCreateGuest} disabled={addingGuest} className="flex-1 py-3 bg-[#635BFF] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#635BFF]/20">
                          {addingGuest ? 'Saving...' : 'Save Guest'}
                        </button>
                     </div>
                  </motion.div>
                ) : (
                  <button onClick={() => setShowAddGuest(true)} className="w-full py-4 border border-dashed border-gray-200 text-gray-400 hover:text-[#635BFF] hover:border-[#635BFF] hover:bg-[#635BFF]/5 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all">
                    <UserPlus size={16} /> Add Guest
                  </button>
                )}

                <div className="flex gap-4 pt-4">
                   <button onClick={() => setStep(2)} className="flex-none px-8 py-4 border border-gray-100 text-gray-400 hover:text-[#0A2540] hover:bg-gray-50 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                     Skip
                   </button>
                   <button onClick={handleAddGuests} disabled={loading || selectedGuestIds.length === 0} className="flex-1 py-4 bg-[#0A2540] hover:bg-[#635BFF] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-[#0A2540]/20 disabled:opacity-30">
                     Add Guest & Continue
                   </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: CHECKOUT ───────────────────────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="relative group">
                   <div className="absolute inset-0 bg-gradient-to-br from-[#635BFF] to-[#0A2540] rounded-[2.5rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
                   <div className="relative bg-white border border-gray-100 rounded-[2.5rem] p-8">
                      <div className="flex justify-between items-start mb-8 relative z-10">
                         <div>
                            <p className="text-xs font-black text-[#635BFF] uppercase tracking-[0.3em] mb-1">Reservation Details</p>
                            <h4 className="text-3xl font-black text-[#0A2540] tracking-tighter leading-none">{room?.type}</h4>
                            <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{hotel?.name} · {hotel?.city}</p>
                         </div>
                         <div className="w-14 h-14 rounded-2xl bg-[#0A2540] flex items-center justify-center text-white shadow-xl shadow-[#0A2540]/20">
                            <ShieldCheck size={24} />
                         </div>
                      </div>
                      
                      <div className="space-y-4 mb-10">
                         {/* BreakDown logic calculation (UI-only for display) */}
                         {(() => {
                            const nights = Math.max(1, Math.ceil((new Date(watch('checkOutDate')) - new Date(watch('checkInDate'))) / (1000 * 60 * 60 * 24)));
                            const roomsCount = watch('roomsCount') || 1;
                            const baseRate = room?.basePrice || 0;
                            
                            return (
                               <>
                                 <div className="flex justify-between text-xs font-bold text-gray-500">
                                    <span>Stay Duration</span>
                                    <span>{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                                 </div>
                                 <div className="flex justify-between text-xs font-bold text-gray-500">
                                    <span>Units Requested</span>
                                    <span>{roomsCount} {roomsCount === 1 ? 'Room' : 'Rooms'}</span>
                                 </div>
                                 <div className="flex justify-between text-xs font-bold text-gray-400 italic">
                                    <span>Base Rate / per day / per room</span>
                                    <span>₹{baseRate?.toLocaleString()}</span>
                                 </div>
                                 <div className="h-px bg-gray-50 my-2" />
                               </>
                            );
                         })()}

                         <div className="flex justify-between items-center pt-2">
                            <span className="text-sm font-black text-[#0A2540] uppercase tracking-widest">Total Price</span>
                            <span className="text-3xl font-black text-[#635BFF] tracking-tighter shrink-0 ml-2">₹{bookingDetails?.amount?.toLocaleString() || room?.basePrice?.toLocaleString()}</span>
                         </div>
                      </div>

                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100/50 flex items-start gap-3">
                         <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                         <p className="text-xs font-bold text-amber-700 leading-relaxed uppercase tracking-widest">Test Environment: This is a demo payment system. No real money will be changed.</p>
                      </div>
                   </div>
                </div>

                <button onClick={handlePayment} disabled={loading} className="w-full py-5 bg-[#635BFF] hover:bg-[#0A2540] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-[#635BFF]/30 flex items-center justify-center gap-3 active:scale-95">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            )}

            {/* ── STEP 3: FINAL STATUS / LOGISTICS ────────────────────────────────── */}
            {step === 3 && (
              <div className="text-center py-6">
                {bookingStatus === 'CONFIRMED' ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                     <div className="w-24 h-24 bg-green-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-green-100 shadow-xl shadow-green-500/10">
                        <CheckCircle2 size={48} className="text-green-500" />
                     </div>
                     <h3 className="text-4xl font-black text-[#0A2540] tracking-tighter uppercase leading-none mb-4">Booking Confirmed</h3>
                     <p className="text-sm font-medium text-gray-400 max-w-sm mx-auto mb-10">Your booking is successful! You can view your details in your profile.</p>
                     
                     <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="p-4 bg-gray-50 rounded-3xl text-left border border-gray-100">
                           <p className="text-xs font-black text-gray-400 uppercase mb-1">Reference Number</p>
                           <p className="text-xs font-black text-[#0A2540]">#NOX-{String(bookingId).slice(-6).toUpperCase()}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-3xl text-left border border-gray-100">
                           <p className="text-xs font-black text-gray-400 uppercase mb-1">Guests</p>
                           <p className="text-xs font-black text-[#0A2540]">{selectedGuestIds.length} Companion(s)</p>
                        </div>
                     </div>

                     <button onClick={onClose} className="w-full py-5 bg-[#0A2540] hover:bg-[#635BFF] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all">
                        Go Back
                     </button>
                  </motion.div>
                ) : (
                  <div className="space-y-8">
                     <div className="relative inline-block">
                        <div className="w-24 h-24 bg-amber-50 rounded-[2.5rem] flex items-center justify-center mx-auto border border-amber-100">
                           {isPolling ? <RefreshCcw size={40} className="text-amber-500 animate-spin" /> : <Loader2 size={40} className="text-amber-500" />}
                        </div>
                     </div>
                     
                     <div>
                        <h3 className="text-3xl font-black text-[#0A2540] tracking-tighter uppercase leading-none mb-2">Verifying Payment...</h3>
                        <p className="text-sm font-medium text-gray-400 max-w-sm mx-auto">Waiting for payment confirmation. This may take up to 60 seconds.</p>
                     </div>

                     <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] text-left">
                        <div className="flex items-center justify-between mb-4">
                           <p className="text-xs font-black text-amber-700 uppercase tracking-widest">Status</p>
                           <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-black rounded uppercase">{bookingStatus?.replace(/_/g, ' ') || 'CHECKING'}</span>
                        </div>
                        <p className="text-xs font-bold text-amber-600 leading-relaxed tracking-wider uppercase">Your status will update automatically once the bank confirms the payment.</p>
                     </div>

                     <div className="flex flex-col gap-3">
                        <button 
                           onClick={() => pollStatus(bookingId)} 
                           disabled={isPolling}
                           className="w-full py-4 border border-amber-200 text-amber-600 hover:bg-amber-100 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                        >
                           <RefreshCcw size={14} className={isPolling ? 'animate-spin' : ''} /> Refresh Status
                        </button>
                        <button onClick={onClose} className="w-full py-4 text-gray-400 hover:text-[#0A2540] font-black text-xs uppercase tracking-widest">
                           Check My Bookings Later
                        </button>
                     </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingDialog;
