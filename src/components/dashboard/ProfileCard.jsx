import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, ShieldCheck, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({ isOpen, onClose, user }) => {
  const cardRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      setTimeout(() => {
        if (cardRef.current && !cardRef.current.contains(event.target)) {
          onClose();
        }
      }, 10);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const fullName = user?.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : 'Unknown User';

  const initials = user?.profile
    ? `${user.profile.firstName?.charAt(0) || ''}${user.profile.lastName?.charAt(0) || ''}`
    : '?';

  return (
    <AnimatePresence>
      {isOpen && user && (
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="absolute top-[4.5rem] right-5 sm:right-8 w-[calc(100vw-2.5rem)] sm:w-72 max-w-[300px] sm:max-w-none bg-white dark:bg-[#1A211A] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden z-50 transition-colors duration-200"
        >
          {/* Header banner */}
          <div className="bg-gradient-to-br from-[#5D7C59] to-[#4A6447] h-20 w-full relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#7A9A7B]/50" />
            <div className="absolute -bottom-4 left-6 w-14 h-14 rounded-full bg-[#FFC700]/15" />

            {/* Avatar */}
            <div className="absolute -bottom-8 left-5">
              <div className="w-16 h-16 rounded-full border-3 border-white bg-[#7A9A7B] overflow-hidden shadow-lg flex items-center justify-center" style={{ borderWidth: '3px' }}>
                {user?.profile?.profilePicture ? (
                  <img src={user.profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-lg uppercase">{initials}</span>
                )}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="pt-10 px-5 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white capitalize flex items-center gap-1.5">
                  {fullName}
                  <ShieldCheck size={15} className="text-[#5D7C59] dark:text-[#7A9A7B] shrink-0" />
                </h3>
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mt-0.5 text-xs">
                  <Mail size={12} />
                  <span className="truncate max-w-[180px]">{user?.email}</span>
                </div>
              </div>
            </div>

            {/* Account ID */}
            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/10">
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-widest">Account ID</p>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 font-mono break-all bg-gray-50 dark:bg-white/5 px-3 py-2 rounded-xl border border-gray-100 dark:border-white/10">
                {user?.id}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-col gap-1">
              <button
                onClick={() => { navigate('/dashboard/settings'); onClose(); }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-[#4A6447]/8 dark:hover:bg-white/5 hover:text-[#4A6447] dark:hover:text-[#7A9A7B] transition-all w-full text-left"
              >
                <Settings size={16} strokeWidth={2} />
                Manage Account
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileCard;
