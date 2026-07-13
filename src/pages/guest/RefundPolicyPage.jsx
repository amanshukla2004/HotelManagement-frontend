import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  RefreshCcw,
  Clock,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RefundPolicyPage = () => {
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
              <RefreshCcw size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">
                Refund Policy
              </h1>
              <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest">
                Effective as of April 2026
              </p>
            </div>
          </div>

          <div className="space-y-12">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
                <Clock className="text-[#0284C7] mb-4" size={24} />
                <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-widest mb-2">
                  24h Window
                </h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed">
                  Full refund if cancelled within 24 hours of booking.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
                <ShieldCheck className="text-emerald-500 mb-4" size={24} />
                <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-widest mb-2">
                  Verified Claims
                </h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed">
                  Secure processing for all double-payment issues.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
                <AlertCircle className="text-[#F97316] mb-4" size={24} />
                <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-widest mb-2">
                  No Show
                </h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed">
                  Non-refundable if cancelled less than 48h before check-in.
                </p>
              </div>
            </section>

            <div className="space-y-6">
              <h2 className="text-xl font-black text-[#0F172A] tracking-tight uppercase">
                1. General Terms
              </h2>
              <p className="text-gray-500 leading-relaxed font-medium">
                At Roomly, we strive to ensure a seamless booking experience.
                Our refund policy is designed to be fair to both our guests and
                our hotel partners. All refund requests are processed through
                our central management system to ensure transparency and
                security.
              </p>

              <h2 className="text-xl font-black text-[#0F172A] tracking-tight uppercase">
                2. Cancellation Fees
              </h2>
              <ul className="space-y-4 text-gray-500 font-medium list-disc ml-6 uppercase text-xs tracking-wider">
                <li>Free cancellation for up to 48 hours before check-in.</li>
                <li>
                  Cancellations within 48-24 hours of check-in will incur a 50%
                  charge of the first night.
                </li>
                <li>
                  Cancellations within 24 hours of check-in are non-refundable.
                </li>
              </ul>

              <h2 className="text-xl font-black text-[#0F172A] tracking-tight uppercase">
                3. Processing Time
              </h2>
              <p className="text-gray-500 leading-relaxed font-medium">
                Once a refund is approved, the amount will be credited back to
                the original payment method within 5-7 business days. Please
                note that bank processing times may vary.
              </p>
            </div>

            <div className="p-8 bg-[#0F172A] rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <h4 className="text-lg font-black tracking-tight">
                  Need assistance with a refund?
                </h4>
                <p className="text-white/50 text-xs font-medium uppercase tracking-widest">
                  Our support team is available 24/7
                </p>
              </div>
              <button
                onClick={() => navigate("/support")}
                className="px-8 py-4 bg-[#0284C7] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#0284C7]/30 hover:bg-white hover:text-[#0F172A] transition-all"
              >
                Contact Support
              </button>
            </div>
          </div>
        </motion.div>

        <p className="text-center mt-12 text-xs font-black text-gray-300 uppercase tracking-[0.3em]">
          Roomly Premium Stays · Security & Privacy First
        </p>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
