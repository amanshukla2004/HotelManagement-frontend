import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

/**
 * Generic confirmation dialog.
 * Props:
 *   isOpen, onClose, onConfirm, title, message, confirmLabel, isDangerous
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  isDangerous = false,
  isLoading = false,
}) => {
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.92, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.18)] w-full max-w-md p-6 relative">
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={18} />
              </button>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDangerous ? 'bg-red-50' : 'bg-amber-50'}`}>
                <AlertTriangle size={22} className={isDangerous ? 'text-red-500' : 'text-amber-500'} />
              </div>

              <h2 className="text-lg font-bold text-[#0F172A] mb-2">{title}</h2>
              <p className="text-sm text-gray-500 mb-6">{message}</p>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors flex items-center justify-center ${
                    isDangerous
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-[#0284C7] hover:bg-[#0F172A]'
                  } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
