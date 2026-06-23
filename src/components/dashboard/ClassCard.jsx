import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, MoreVertical, LogOut, Share2 } from 'lucide-react';

// Generate a consistent gradient from the landing page palette based on class name
const CARD_GRADIENTS = [
  'from-[#5D7C59] to-[#4A6447]',
  'from-[#4A6447] to-[#2d6a4f]',
  'from-[#7A9A7B] to-[#5D7C59]',
  'from-[#52796f] to-[#354f52]',
  'from-[#4A6447] to-[#52796f]',
  'from-[#2d6a4f] to-[#4A6447]',
];

const getGradient = (name = '') => {
  const idx = name.charCodeAt(0) % CARD_GRADIENTS.length;
  return CARD_GRADIENTS[idx];
};

// Subtle wavy pattern — same feel as the landing page blobs
const WaveBg = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
    viewBox="0 0 300 120"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="260" cy="-20" r="80" fill="white" />
    <circle cx="30" cy="130" r="60" fill="white" />
  </svg>
);

const ClassCard = ({
  title = 'BSIT 3G - Event Driven Programming',
  section = '3-G',
  teacher = 'Mr. Juan',
  letter = 'B',
  isOwner = false,
  onClick,
  onLeave,
  onShare,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const gradient = getGradient(title);

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-[#1A211A] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10 flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(74,100,71,0.15)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] cursor-pointer group"
    >
      {/* Colored header band — like Google Classroom */}
      <div className={`bg-gradient-to-br ${gradient} relative h-[110px] p-5 overflow-hidden`}>
        <WaveBg />

        {/* Title */}
        <h3 className="text-base font-bold text-white leading-snug pr-12 line-clamp-2 relative z-10 drop-shadow-sm">
          {title}
        </h3>
        <p className="text-white/75 text-xs mt-1 relative z-10 font-medium">{section}</p>

        {/* Letter avatar — top right corner */}
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 backdrop-blur-sm flex items-center justify-center text-white font-bold text-base uppercase shadow-sm z-10">
          {letter}
        </div>
      </div>

      {/* Card body */}
      <div className="flex-1 px-5 py-3.5 bg-transparent">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{teacher}</p>
      </div>

      {/* Footer actions */}
      <div className="px-4 py-3 flex justify-end items-center gap-1 border-t border-gray-50 dark:border-white/5 bg-transparent">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick();
          }}
          className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-[#4A6447]/8 dark:hover:bg-white/10 hover:text-[#4A6447] dark:hover:text-[#7A9A7B] transition-all"
          title="Open classroom"
        >
          <ExternalLink size={16} strokeWidth={2} />
        </button>

        <div ref={menuRef} className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-[#4A6447]/8 dark:hover:bg-white/10 hover:text-[#4A6447] dark:hover:text-[#7A9A7B] transition-all"
          >
            <MoreVertical size={16} strokeWidth={2} />
          </button>

          {showMenu && (
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-[#232B23] rounded-2xl shadow-xl overflow-hidden z-20 border border-gray-100 dark:border-white/10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  if (onShare) onShare();
                }}
                className="w-full text-left px-4 py-3 bg-transparent border-none cursor-pointer hover:bg-[#4A6447]/6 dark:hover:bg-white/5 transition-colors flex items-center gap-3 text-gray-700 dark:text-gray-300 text-sm font-medium"
              >
                <Share2 size={15} className="text-[#5D7C59]" />
                Share Classroom
              </button>

              {!isOwner && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    if (onLeave) onLeave();
                  }}
                  className="w-full text-left px-4 py-3 bg-transparent border-none cursor-pointer hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-medium border-t border-gray-50 dark:border-white/5"
                >
                  <LogOut size={15} />
                  Leave Classroom
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
