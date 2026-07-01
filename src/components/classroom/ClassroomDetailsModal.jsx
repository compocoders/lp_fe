import React from 'react';
import { Hash, Lock, Unlock, Calendar, User, Settings } from 'lucide-react';
import { ModalBackdrop, ModalCard, ModalHeader } from './ClassroomModal';

const ClassroomDetailsModal = ({ isOpen, onClose, classroom, onUpdateClick, isTeacher }) => {
  if (!isOpen || !classroom) return null;

  return (
    <ModalBackdrop>
      <ModalCard>
        <ModalHeader title="Classroom Details" subtitle="View information about this learning space." onClose={onClose} gradientHeader />
        <div className="px-6 py-5 flex flex-col gap-5">
          <div>
            <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Classroom Name</p>
            <p className="text-base font-bold text-gray-900 dark:text-white">{classroom.name}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Description</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{classroom.description || 'No description provided.'}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Hash, label: 'Room Code', value: classroom.roomCode },
              { icon: classroom.private ? Lock : Unlock, label: 'Privacy', value: classroom.private ? 'Private' : 'Public' },
              { icon: Calendar, label: 'Created On', value: new Date(classroom.createdAt).toLocaleDateString() },
              { icon: User, label: 'Owner', value: `${classroom.User?.profile?.firstName} ${classroom.User?.profile?.lastName}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 bg-[#FAFCFA] dark:bg-[#232B23] px-4 py-3 rounded-xl border border-gray-100 dark:border-white/5 transition-colors duration-200 min-w-0">
                <Icon size={18} className="text-[#5D7C59] dark:text-[#7A9A7B] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {isTeacher && (
          <div className="px-6 py-4 bg-[#FAFCFA] dark:bg-[#121612] border-t border-gray-100 dark:border-white/10 flex justify-center sm:justify-end transition-colors duration-200">
            <button
              onClick={onUpdateClick}
              className="w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#5D7C59] to-[#4A6447] text-white rounded-xl text-sm font-bold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all border-none cursor-pointer"
            >
              <Settings size={15} strokeWidth={2.5} /> Update Room
            </button>
          </div>
        )}
      </ModalCard>
    </ModalBackdrop>
  );
};

export default ClassroomDetailsModal;
