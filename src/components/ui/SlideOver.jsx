import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Generic slide-over panel that slides in from the right.
 * Props: isOpen, onClose, title, subtitle, children, width (default 'max-w-lg')
 */
const SlideOver = ({ isOpen, onClose, title, subtitle, children, width = 'max-w-lg' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className={`fixed inset-y-0 right-0 z-[91] w-full ${width} bg-white shadow-[0_0_80px_rgba(0,0,0,0.2)] flex flex-col`}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">{title}</h2>
                {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all ml-4 flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SlideOver;
