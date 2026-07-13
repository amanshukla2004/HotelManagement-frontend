import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Cookie } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CookiePolicyPage = () => {
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
              <Cookie size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">
                Cookie Policy
              </h1>
              <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest">
                Effective as of April 2026
              </p>
            </div>
          </div>
          <div className="space-y-6 text-gray-500 font-medium">
            <p>
              This Cookie Policy explains how Roomly uses cookies and similar
              technologies to recognize you when you visit our website.
            </p>
            <h2 className="text-xl font-black text-[#0F172A] tracking-tight uppercase">
              1. What are cookies?
            </h2>
            <p>
              Cookies are small data files that are placed on your computer or
              mobile device when you visit a website. Cookies are widely used by
              website owners in order to make their websites work, or to work
              more efficiently, as well as to provide reporting information.
            </p>
            <h2 className="text-xl font-black text-[#0F172A] tracking-tight uppercase">
              2. Why do we use cookies?
            </h2>
            <p>
              We use first and third party cookies for several reasons. Some
              cookies are required for technical reasons in order for our
              Websites to operate, and we refer to these as "essential" or
              "strictly necessary" cookies.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
