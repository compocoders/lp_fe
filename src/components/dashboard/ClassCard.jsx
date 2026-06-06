import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, MoreVertical, LogOut, Share2 } from 'lucide-react';

const ClassCard = ({ 
  title = "BSIT 3G - Event Driven Programming", 
  section = "3-G", 
  teacher = "Mr. Juan", 
  letter = "B",
  isOwner = false,
  onClick,
  onLeave,
  onShare
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

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_6px_rgba(0,0,0,0.05)] flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_15px_rgba(0,0,0,0.1)] cursor-pointer h-[220px]"
    >
      <div className="bg-[#517559] text-white p-4 relative h-[90px] border-b-4 border-white">
        <h3 className="text-base font-semibold m-0 whitespace-nowrap overflow-hidden text-ellipsis pr-[60px]">
          {title}
        </h3>
        <p className="text-xs opacity-90 mt-1">{section}</p>
        <p className="text-xs opacity-90 mt-0.5">{teacher}</p>
        
        <div className="absolute right-4 -bottom-6 w-[50px] h-[50px] rounded-full bg-[#517559] border-4 border-white flex items-center justify-center text-2xl font-bold text-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] z-10">
          {letter}
        </div>
      </div>
      
      <div className="flex-1 bg-white"></div>
      
      <div className="px-4 py-3 flex justify-end gap-3 border-t border-[#f0f0f0] bg-white relative">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick();
          }}
          className="bg-transparent border-none cursor-pointer text-[#8c8c8c] flex items-center justify-center p-1 rounded transition-colors hover:bg-[#f5f5f5] hover:text-[#517559]">
          <ExternalLink size={18} />
        </button>
        <div ref={menuRef} className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="bg-transparent border-none cursor-pointer text-[#8c8c8c] flex items-center justify-center p-1 rounded transition-colors hover:bg-[#f5f5f5] hover:text-[#517559]">
            <MoreVertical size={18} />
          </button>
          
          {showMenu && (
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.15)] overflow-hidden z-20 border border-[#f0f0f0]">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  if(onShare) onShare();
                }}
                className="w-full text-left px-4 py-3 bg-transparent border-none cursor-pointer hover:bg-[#f0f5f1] transition-colors flex items-center gap-3 text-[#2d3a2e] text-sm font-medium"
              >
                <Share2 size={16} className="text-[#517559]" /> Share Classroom
              </button>
              
              {!isOwner && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    if(onLeave) onLeave();
                  }}
                  className="w-full text-left px-4 py-3 bg-transparent border-none cursor-pointer hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600 text-sm font-medium border-t border-[#f0f0f0]"
                >
                  <LogOut size={16} /> Leave Classroom
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
