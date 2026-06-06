import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, ShieldCheck } from 'lucide-react';

const ProfileCard = ({ isOpen, onClose, user }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Small timeout to prevent immediate closing when clicking the profile icon
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

  return (
    <AnimatePresence>
      {isOpen && user && (
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-80 max-w-[320px] sm:max-w-none bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
        >
          <div className="bg-gradient-to-r from-[#517559] to-[#71967a] h-24 w-full relative">
            <div className="absolute -bottom-10 left-6">
              <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm flex items-center justify-center">
                {user?.profile?.profilePicture ? (
                  <img src={user.profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-gray-400" />
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-12 px-6 pb-6">
            <h3 className="text-xl font-bold text-gray-800 m-0 flex items-center gap-2 capitalize">
              {user?.profile?.firstName} {user?.profile?.lastName}
              <ShieldCheck size={18} className="text-[#517559]" />
            </h3>
            
            <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm">
              <Mail size={16} />
              <span>{user?.email}</span>
            </div>
            
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">Account ID</p>
              <div className="text-xs text-gray-500 font-mono break-all bg-gray-50 p-2 rounded-md border border-gray-100">
                {user?.id}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileCard;
