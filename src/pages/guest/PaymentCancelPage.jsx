import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, AlertCircle } from 'lucide-react';

const PaymentCancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-xl w-full bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-gray-100 p-12 text-center relative overflow-hidden"
      >
        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-red-100 shadow-xl shadow-red-500/10"
          >
            <XCircle size={48} className="text-red-500" />
          </motion.div>

          <h1 className="text-4xl font-black text-[#0A2540] tracking-tighter uppercase leading-tight mb-4">
            Payment Cancelled
          </h1>
          <p className="text-sm font-medium text-gray-400 max-w-xs mx-auto mb-12">
            The transaction was not completed. Your initial booking remains pending and is not yet confirmed.
          </p>

          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100/50 flex items-start gap-4 text-left mb-12">
             <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
             <div>
                <p className="text-xs font-black text-amber-700 uppercase tracking-widest mb-1">Information</p>
                <p className="text-xs font-bold text-amber-600/80 leading-relaxed uppercase tracking-wider">
                  You can try paying again from your stay history or find another property. No charges were made to your account.
                </p>
             </div>
          </div>

          <div className="flex flex-col gap-3">
             <button 
               onClick={() => navigate('/bookings')}
               className="w-full py-5 bg-[#0A2540] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#635BFF] transition-all shadow-xl shadow-[#0A2540]/20 flex items-center justify-center gap-3 active:scale-95 group"
             >
               <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
               View My Stays
             </button>
             <button 
               onClick={() => navigate('/')}
               className="w-full py-4 text-gray-400 hover:text-[#0A2540] font-black text-xs uppercase tracking-widest transition-colors"
             >
               Return to Home
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentCancelPage;
