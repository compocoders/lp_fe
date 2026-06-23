import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Book, AlignLeft, Shield, Lock, Loader2, AlertCircle, ChevronDown } from 'lucide-react';
import { createClassroom } from '../../api/classroom.api';

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
      setError('All fields are required.');
      return;
    }
    if (isPrivate && !data.roomPassword.trim()) {
      setError('Private classrooms must have a password.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await createClassroom({ ...data, private: isPrivate });
      if (onSuccess) onSuccess();
      // Reset form
      setData({ name: '', description: '', roomPassword: '' });
      setIsPrivate(true);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while creating the classroom.');
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({ label, icon: Icon, type = 'text', placeholder, value, onChange }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-0.5">{label}</label>
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-gray-400 pointer-events-none">
          <Icon size={16} strokeWidth={2} />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-[#FAFCFA] dark:bg-[#232B23] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-[#5D7C59] dark:focus:border-[#7A9A7B] focus:ring-2 focus:ring-[#5D7C59]/15 transition-all font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-normal text-sm"
        />
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
            className="bg-white dark:bg-[#1A211A] w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-gray-100 dark:border-white/10 transition-colors duration-200"
          >
            {/* Modal header — matches landing page card style */}
            <div className="bg-gradient-to-br from-[#5D7C59] to-[#4A6447] px-6 pt-6 pb-8 relative overflow-hidden">
              {/* Decorative blobs */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#7A9A7B]/40 pointer-events-none" />
              <div className="absolute -bottom-4 left-1/3 w-20 h-20 rounded-full bg-[#FFC700]/10 pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Create Classroom</h2>
                  <p className="text-white/70 text-xs mt-1 font-medium">Set up your new learning space</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/15 transition-colors border-none bg-transparent cursor-pointer"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="px-6 pt-6 pb-5 flex flex-col gap-4">
              {/* Error */}
              {error && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 rounded-xl p-3.5 flex items-start gap-3">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-tight">{error}</p>
                </div>
              )}

              <InputField
                label="Classroom Name"
                icon={Book}
                placeholder="e.g. BSIT 3G — Event Driven"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />

              <InputField
                label="Description / Section"
                icon={AlignLeft}
                placeholder="e.g. Section 3-G"
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
              />

              {/* Privacy toggle */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-0.5">Visibility</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-gray-400 pointer-events-none">
                    <Shield size={16} strokeWidth={2} />
                  </div>
                  <select
                    className="w-full bg-[#FAFCFA] dark:bg-[#232B23] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 rounded-xl py-3 pl-10 pr-10 outline-none focus:border-[#5D7C59] dark:focus:border-[#7A9A7B] focus:ring-2 focus:ring-[#5D7C59]/15 transition-all font-medium appearance-none cursor-pointer text-sm"
                    value={isPrivate ? 'private' : 'public'}
                    onChange={(e) => setIsPrivate(e.target.value === 'private')}
                  >
                    <option value="private">Private — Requires password</option>
                    <option value="public">Public — Anyone with link</option>
                  </select>
                  <div className="absolute right-3.5 text-gray-400 pointer-events-none">
                    <ChevronDown size={15} strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              {/* Password field */}
              <AnimatePresence>
                {isPrivate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <InputField
                      label="Room Password"
                      icon={Lock}
                      type="password"
                      placeholder="Enter a secure password"
                      value={data.roomPassword}
                      onChange={(e) => setData({ ...data, roomPassword: e.target.value })}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-2 pt-4 border-t border-gray-50 dark:border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border-none bg-transparent cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#5D7C59] to-[#4A6447] hover:from-[#4A6447] hover:to-[#2d6a4f] text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 border-none cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Room'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateClassroomModal;
