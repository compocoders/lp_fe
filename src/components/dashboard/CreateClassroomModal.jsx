import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Book, AlignLeft, Shield, Lock, Loader2, AlertCircle } from 'lucide-react';
import {createClassroom} from '../../api/classroom.api';
const CreateClassroomModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    name: '',
    description: '',
    roomPassword: '',
  });
  const [isPrivate, setIsPrivate] = useState(true);
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.name.trim() || !data.description.trim()) {
      setError('all fields are required');
      return;
    }

    if(isPrivate && !data.roomPassword.trim()) {
      setError('Private classrooms must have a password');
      return;
    }
    
    try {
      setIsLoading(true);
      await createClassroom({ ...data, private: isPrivate });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while creating the classroom');
    } finally {
      setIsLoading(false);
    }
   
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
            className="bg-[#6b8e72] w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col border border-white/20"
          >
            <form onSubmit={handleSubmit} className="p-6 text-white flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold m-0 drop-shadow-sm">Create Classroom</h2>
                <button 
                  type="button"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 p-1.5 rounded-full transition-colors border-none bg-transparent cursor-pointer"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              <div className="flex flex-col gap-5">
                {error && (
                  <div className="bg-red-500/20 border border-red-200 text-white rounded-xl p-3 flex items-start gap-3 shadow-inner">
                    <AlertCircle size={20} className="text-red-200 shrink-0 mt-0.5" />
                    <p className="m-0 text-sm font-medium leading-tight">{error}</p>
                  </div>
                )}

                {/* Classroom Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-white/90 ml-1 drop-shadow-sm">Classroom name</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-[#517559]">
                      <Book size={18} />
                    </div>
                    <input 
                      type="text" 
                      value={data.name}
                      onChange={(e) => setData({ ...data, name: e.target.value })}
                      placeholder="Classroom name" 
                      className="w-full bg-white text-[#333] rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium placeholder:text-gray-400 placeholder:font-normal border-none shadow-inner"
                    />
                  </div>
                </div>

                {/* Classroom Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-white/90 ml-1 drop-shadow-sm">Classroom Description</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-[#517559]">
                      <AlignLeft size={18} />
                    </div>
                    <input 
                      type="text" 
                      value={data.description}
                      onChange={(e) => setData({ ...data, description: e.target.value })} 
                      placeholder="Classroom Description" 
                      className="w-full bg-white text-[#333] rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium placeholder:text-gray-400 placeholder:font-normal border-none shadow-inner"
                    />
                  </div>
                </div>

                {/* Classroom Private */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-white/90 ml-1 drop-shadow-sm">Classroom Private</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-[#517559] pointer-events-none">
                      <Shield size={18} />
                    </div>
                    <select 
                      className="w-full bg-white text-[#517559] rounded-xl py-3 pl-10 pr-10 outline-none focus:ring-2 focus:ring-white/50 transition-all font-semibold appearance-none border-none shadow-inner cursor-pointer"
                      value={isPrivate ? 'private' : 'public'}
                      onChange={(e) => setIsPrivate(e.target.value === 'private')}
                    >
                      <option value="private" className="font-medium text-[#333]">Private</option>
                      <option value="public" className="font-medium text-[#333]">Public</option>
                    </select>
                    <div className="absolute right-4 text-[#89a88c] pointer-events-none">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Classroom Password - Conditionally Rendered */}
                <AnimatePresence>
                  {isPrivate && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, marginTop: -20 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 0 }}
                      exit={{ opacity: 0, height: 0, marginTop: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-1.5 overflow-hidden"
                    >
                      <label className="text-sm font-semibold text-white/90 ml-1 drop-shadow-sm">Classroom Password</label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3 text-[#517559]">
                          <Lock size={18} />
                        </div>
                        <input 
                          type="password" 
                          placeholder="Classroom Password" 
                          value={data.roomPassword}
                          onChange={(e) => setData({ ...data, roomPassword: e.target.value })}
                          className="w-full bg-white text-[#333] rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium placeholder:text-gray-400 placeholder:font-normal border-none shadow-inner"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>                                  
              </div>
            </form>

            <div className="p-5 flex justify-end items-center gap-5 pt-0">
              <button 
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="bg-transparent border-none text-white font-medium cursor-pointer hover:text-white/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-transparent border-none text-white font-bold cursor-pointer relative group flex items-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {isLoading && <Loader2 size={18} className="animate-spin" />}
                {isLoading ? 'Creating...' : 'Create Room'}
                {!isLoading && <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-white scale-x-100 origin-left transition-transform group-hover:scale-x-110"></span>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateClassroomModal;
