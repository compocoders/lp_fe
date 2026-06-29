import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Lock, ServerCrash, RefreshCcw, Home, LogOut } from 'lucide-react';
import useErrorStore from '../../store/error.store';
import useAuthStore from '../../store/auth.store';

export default function GlobalErrorPage() {
  const { errorType, errorMessage, clearError } = useErrorStore();
  const logout = useAuthStore(state => state.logout);

  // Determine icon and title based on the error type
  const getErrorContent = () => {
    switch (errorType) {
      case 'timeout':
        return {
          icon: <Clock size={64} className="text-[#698864]" />,
          title: 'Connection Timeout',
          action: 'Try Again',
          onAction: () => {
            clearError();
            window.location.reload();
          }
        };
      case 'unauthorized':
        return {
          icon: <Lock size={64} className="text-[#52704E]" />,
          title: 'Access Denied',
          action: 'Return Home',
          onAction: () => {
            clearError();
            logout();
            window.location.href = '/';
          }
        };
      case 'ratelimit':
        return {
          icon: <AlertTriangle size={64} className="text-amber-500" />,
          title: 'Too Many Requests',
          action: 'Wait & Retry',
          onAction: () => {
            clearError();
            window.location.reload();
          }
        };
      case 'server':
        return {
          icon: <ServerCrash size={64} className="text-red-500" />,
          title: 'Server Error',
          action: 'Return Home',
          onAction: () => {
            clearError();
            window.location.href = '/dashboard';
          }
        };
      default:
        return {
          icon: <AlertTriangle size={64} className="text-[#7C9A76]" />,
          title: 'Something went wrong',
          action: 'Return Home',
          onAction: () => {
            clearError();
            window.location.href = '/dashboard';
          }
        };
    }
  };

  const content = getErrorContent();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F4F5F4] p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white max-w-md w-full rounded-3xl shadow-xl overflow-hidden text-center relative"
      >
        {/* Decorative Top Accent */}
        <div className="h-2 w-full bg-gradient-to-r from-[#52704E] via-[#698864] to-[#7C9A76]"></div>

        <div className="p-10 space-y-6">
          {/* Icon wrapper with soft pulsing animation */}
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 mx-auto bg-[#F4F5F4] rounded-full flex items-center justify-center shadow-inner"
          >
            {content.icon}
          </motion.div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#52704E] tracking-tight mb-3">
              {content.title}
            </h1>
            <p className="text-gray-500 font-medium leading-relaxed">
              {errorMessage || "We encountered an unexpected issue while processing your request."}
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={content.onAction}
              className="flex-1 bg-[#698864] hover:bg-[#52704E] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95"
            >
              {errorType === 'unauthorized' ? <Home size={18} /> : (errorType === 'timeout' || errorType === 'ratelimit' ? <RefreshCcw size={18} /> : <Home size={18} />)}
              {content.action}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
