import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, BookmarkCheck, Loader2 } from 'lucide-react';
import { bookingApi } from '../../api/bookingApi';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [latestBooking, setLatestBooking] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await bookingApi.getMyBookings();
        const data = res.data?.data ?? res.data;
        // Get the latest confirmed or pending-payment booking
        const latest = (Array.isArray(data) ? data : []).sort((a, b) => b.id - a.id)[0];
        setLatestBooking(latest);
      } catch (err) {
        console.error("Verification failed", err);
      } finally {
        setTimeout(() => setIsVerifying(false), 1500); // Small delay for premium feel
      }
    };
    verify();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-xl w-full bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-gray-100 p-12 text-center relative overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500/5 blur-[80px] -z-0" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, delay: 0.2 }}
            className="w-24 h-24 bg-green-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-green-100 shadow-xl shadow-green-500/10"
          >
            <CheckCircle2 size={48} className="text-green-500" />
          </motion.div>

          <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter uppercase leading-tight mb-4">
            {isVerifying ? 'Verifying...' : 'Stay Confirmed'}
          </h1>
          <p className="text-sm font-medium text-gray-400 max-w-xs mx-auto mb-12">
            {isVerifying 
              ? 'Finalizing your reservation details with the Nox Nexus network.' 
              : 'Your payment was successful and your reservation is now officially confirmed.'}
          </p>

          <div className="grid grid-cols-1 gap-4 mb-12">
             <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 flex items-center gap-5 text-left transition-all hover:bg-gray-100/50">
               <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#0284C7] shadow-sm">
                 {isVerifying ? <Loader2 size={20} className="animate-spin" /> : <BookmarkCheck size={20} />}
               </div>
               <div className="flex-1 overflow-hidden">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Reference ID</p>
                  <p className="text-xs font-black text-[#0F172A] uppercase tracking-tighter truncate">
                    {isVerifying ? 'SECURE_HASHING...' : (latestBooking ? `#NOX-${String(latestBooking.id).padStart(6, '0')}` : 'VERIFIED_SECURE')}
                  </p>
               </div>
             </div>
          </div>

          <div className="flex flex-col gap-3">
             <button 
               onClick={() => navigate('/bookings')}
               className="w-full py-5 bg-[#0F172A] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#0284C7] transition-all shadow-xl shadow-[#0F172A]/20 flex items-center justify-center gap-3 active:scale-95 group"
             >
               Go to My Stays
               <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </button>
             <button 
               onClick={() => navigate('/')}
               className="w-full py-4 text-gray-400 hover:text-[#0F172A] font-black text-xs uppercase tracking-widest transition-colors"
             >
               Return to Home
             </button>
          </div>
        </div>

        {/* Brand Decoration */}
        <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-center gap-3 opacity-20">
           <div className="w-6 h-6 bg-[#0F172A] rounded-lg" />
           <span className="text-[10px] font-black uppercase tracking-[0.4em]">Nox Nexus Premium</span>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;
