import React from 'react';
import { ClipboardList, FileText } from 'lucide-react';
import { ModalBackdrop, ModalCard, ModalHeader } from './ClassroomModal';

const CreateChoiceModal = ({ isOpen, onClose, onSelectActivity, onSelectMaterial }) => {
  if (!isOpen) return null;

  const options = [
    { icon: ClipboardList, label: 'Activity', desc: 'Create a quiz, assignment, or interactive task.', action: onSelectActivity },
    { icon: FileText, label: 'Material', desc: 'Upload a document, PDF, presentation, or notes.', action: onSelectMaterial },
  ];

  return (
    <ModalBackdrop>
      <ModalCard>
        <ModalHeader title="Create New" subtitle="What would you like to add?" onClose={onClose} gradientHeader />
        <div className="p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {options.map(({ icon: Icon, label, desc, action }) => (
            <button
              key={label}
              onClick={action}
              className="bg-[#FAFCFA] dark:bg-[#232B23] border border-gray-100 dark:border-white/10 rounded-2xl p-5 cursor-pointer flex flex-col items-center gap-3 hover:border-[#5D7C59]/40 dark:hover:border-[#7A9A7B]/40 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-none transition-all text-center group border-none font-sans"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20 group-hover:bg-[#5D7C59]/15 dark:group-hover:bg-[#5D7C59]/30 flex items-center justify-center transition-colors">
                <Icon size={26} className="text-[#5D7C59] dark:text-[#7A9A7B]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </ModalCard>
    </ModalBackdrop>
  );
};

export default CreateChoiceModal;
