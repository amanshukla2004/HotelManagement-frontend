import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, subtitle, children, width = 'max-w-2xl' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full ${width} max-h-[90vh] bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden`}
          >
            <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50 shrink-0">
              <div>
                <h2 className="text-xl font-black text-[#0F172A] uppercase tracking-tighter">{title}</h2>
                {subtitle && <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-[#0F172A] hover:bg-gray-200 transition-all ml-4 shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar relative">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
