import React from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

export const ModalBackdrop = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15 }}
    className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 md:p-6"
  >
    <div onClick={e => e.stopPropagation()} className="w-full max-w-lg p-3 md:p-0">
      {children}
    </div>
  </motion.div>
);

export const ModalCard = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 15 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: 15 }}
    transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
    className={`bg-white dark:bg-[#1A211A] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 transition-colors duration-200 ${className}`}
  >
    {children}
  </motion.div>
);

export const ModalHeader = ({ title, subtitle, onClose, gradientHeader = false }) => (
  gradientHeader ? (
    <div className="bg-gradient-to-br from-[#5D7C59] to-[#4A6447] px-4 md:px-6 pt-4 md:pt-5 pb-5 md:pb-7 relative overflow-hidden">
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[#7A9A7B]/40 pointer-events-none" />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <h2 className="text-base md:text-lg font-bold text-white leading-tight">{title}</h2>
          {subtitle && <p className="text-white/65 text-[11px] md:text-xs mt-0.5">{subtitle}</p>}
        </div>
        <button onClick={onClose} className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/15 transition-colors border-none bg-transparent cursor-pointer">
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  ) : (
    <div className="px-4 md:px-6 py-4 md:py-5 border-b border-gray-100 dark:border-white/10 flex items-start justify-between transition-colors duration-200">
      <div>
        <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight">{title}</h2>
        {subtitle && <p className="text-gray-500 dark:text-gray-400 text-[11px] md:text-xs mt-0.5">{subtitle}</p>}
      </div>
      <button onClick={onClose} className="p-1.5 rounded-full text-[#5D7C59] bg-[#5D7C59]/10 hover:bg-[#5D7C59]/20 transition-colors border-none cursor-pointer shrink-0 ml-3">
        <X size={18} strokeWidth={2.5} />
      </button>
    </div>
  )
);

export const FormInput = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold text-[#5D7C59] dark:text-[#7A9A7B] uppercase tracking-widest">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-[#FAFCFA] dark:bg-[#232B23] border-2 border-gray-200 dark:border-white/10 rounded-xl text-gray-800 dark:text-gray-200 text-sm font-medium outline-none focus:border-[#5D7C59] dark:focus:border-[#7A9A7B] focus:ring-2 focus:ring-[#5D7C59]/15 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-normal"
    />
  </div>
);

export const FormTextarea = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold text-[#5D7C59] dark:text-[#7A9A7B] uppercase tracking-widest">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-[#FAFCFA] dark:bg-[#232B23] border-2 border-gray-200 dark:border-white/10 rounded-xl text-gray-800 dark:text-gray-200 text-sm font-medium outline-none focus:border-[#5D7C59] dark:focus:border-[#7A9A7B] focus:ring-2 focus:ring-[#5D7C59]/15 transition-all resize-none font-sans placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-normal"
    />
  </div>
);

export const ModalFooter = ({ children, className = '' }) => (
  <div className={`px-4 md:px-6 py-3 md:py-4 bg-[#FAFCFA] dark:bg-[#1A211A] border-t border-gray-100 dark:border-white/10 flex justify-end gap-2 md:gap-3 transition-colors duration-200 ${className}`}>
    {children}
  </div>
);

export const ModalCancelButton = ({ onClick, disabled = false, children = 'Cancel' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-5 py-2.5 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors border-none bg-transparent cursor-pointer disabled:opacity-50"
  >
    {children}
  </button>
);

export const ModalPrimaryButton = ({ onClick, disabled = false, loading = false, loadingText = 'Saving...', children }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#5D7C59] to-[#4A6447] text-white rounded-xl text-sm font-bold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all border-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
  >
    {loading ? <Loader2 size={15} className="animate-spin" /> : null}
    {loading ? loadingText : children}
  </button>
);
