import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JoinRoomModal = ({ isOpen, onClose }) => {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const input = roomCode.trim();
    if (!input) {
      setError('Please enter a room code or link.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // Extract code if it's a full URL
      let code = input;
      if (input.includes('/join/')) {
        code = input.split('/join/')[1].split('/')[0];
      } else if (input.includes('http')) {
        // Just take the last segment if they pasted some other link format
        const parts = input.split('/').filter(Boolean);
        code = parts[parts.length - 1];
      }

      // We just navigate to the join page and let it handle the joining + password logic
      navigate(`/join/${code}`);
      onClose();
    } catch (err) {
      setError('Invalid code format.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="bg-white dark:bg-[#1A211A] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#151a15]/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#5D7C59]/10 flex items-center justify-center">
                    <Link2 size={20} className="text-[#5D7C59]" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Join Room</h2>
                    <p className="text-[13px] text-gray-500 font-medium">Enter a room code or invite link</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-200/50 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-all cursor-pointer border-none"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-xl text-[13px] font-medium flex items-center gap-2 border border-red-100 dark:border-red-500/20"
                    >
                      <AlertCircle size={14} className="shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-0.5">Room Code or Link</label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 text-gray-400 pointer-events-none">
                        <Link2 size={16} strokeWidth={2} />
                      </div>
                      <input
                        type="text"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        placeholder="e.g. xyz or https://.../join/xyz"
                        className="w-full bg-[#FAFCFA] dark:bg-[#232B23] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-[#5D7C59] dark:focus:border-[#7A9A7B] focus:ring-2 focus:ring-[#5D7C59]/15 transition-all font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-normal text-sm"
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 w-full flex flex-col items-center justify-center gap-1 bg-[#5D7C59] hover:bg-[#4A6447] text-white py-3.5 rounded-xl font-bold shadow-md shadow-[#5D7C59]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed border-none cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      'Join Room'
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default JoinRoomModal;
