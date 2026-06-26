import React, { useEffect, useState } from 'react';
import { Loader2, Copy, Check } from 'lucide-react';
import { generateInviteLink } from '../../api/classroom.api';
import { ModalBackdrop, ModalCard, ModalHeader } from './ClassroomModal';

const InviteClassroomModal = ({ isOpen, onClose, classroom }) => {
  const [inviteLink, setInviteLink] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !classroom?.id) return;

    let cancelled = false;
    const fetchLink = async () => {
      setIsGeneratingLink(true);
      setInviteLink('');
      setCopied(false);
      try {
        const { token } = await generateInviteLink(classroom.id);
        if (!cancelled) {
          setInviteLink(`${window.location.origin}/join/${token}`);
        }
      } catch (err) {
        console.error('Error generating link', err);
      } finally {
        if (!cancelled) setIsGeneratingLink(false);
      }
    };

    fetchLink();
    return () => { cancelled = true; };
  }, [isOpen, classroom?.id]);

  const handleCopyLink = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <ModalBackdrop>
      <ModalCard>
        <ModalHeader title="Share Classroom" subtitle="Invite students to join your classroom." onClose={onClose} gradientHeader />
        <div className="px-4 md:px-6 py-4 md:py-5 flex flex-col gap-4">
          {isGeneratingLink ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 size={28} className="text-[#5D7C59] dark:text-[#7A9A7B] animate-spin" />
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Generating invite link...</span>
            </div>
          ) : inviteLink ? (
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-bold text-[#5D7C59] dark:text-[#7A9A7B] uppercase tracking-widest">Invite Link</label>
              <div className="flex gap-2">
                <input type="text" readOnly value={inviteLink} className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 text-sm bg-[#FAFCFA] dark:bg-[#232B23] outline-none font-medium" />
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center justify-center w-12 h-12 rounded-xl border-none cursor-pointer transition-all font-bold shrink-0
                    ${copied
                      ? 'bg-green-105 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                      : 'bg-[#5D7C59] dark:bg-[#7A9A7B] text-white hover:bg-[#4A6447] dark:hover:bg-[#5D7C59]'}`}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
              <p className="text-[12px] text-gray-400 dark:text-gray-400 text-center">
                Anyone with this link {classroom?.private ? 'and the classroom password ' : ''}can join.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8">
              <span className="text-sm text-red-500 dark:text-red-400 font-medium">Only the owner can generate an invite link.</span>
            </div>
          )}
        </div>
      </ModalCard>
    </ModalBackdrop>
  );
};

export default InviteClassroomModal;
