import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-[#0F172A] uppercase tracking-widest mb-12 transition-all group"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-gray-50 transition-colors">
            <ArrowLeft size={16} />
          </div>
          Go Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] shadow-[0_32px_80px_rgba(0,0,0,0.06)] border border-gray-50 overflow-hidden p-10 md:p-16"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-3xl bg-[#0284C7]/10 flex items-center justify-center text-[#0284C7]">
              <Shield size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">Privacy Policy</h1>
              <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest">Effective as of April 2026</p>
            </div>
          </div>
          <div className="space-y-6 text-gray-500 font-medium">
            <p>At Nox, we take your privacy seriously. This policy describes what personal information we collect and how we use it.</p>
            <h2 className="text-xl font-black text-[#0F172A] tracking-tight uppercase">1. Information Collection</h2>
            <p>We collect information to provide better services to all our users. We collect information in the following ways: information you give us, and information we get from your use of our services.</p>
            <h2 className="text-xl font-black text-[#0F172A] tracking-tight uppercase">2. Use of Information</h2>
            <p>We use the information we collect from all of our services to provide, maintain, protect and improve them, to develop new ones, and to protect Nox and our users.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;
