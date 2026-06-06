import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, LineChart, Users, CheckSquare, Settings, ChevronUp, ChevronDown, ClipboardList, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ onClose, onLogout, dashboardData }) => {
  const navigate = useNavigate();
  const enrolledClasses = dashboardData?.classrooms?.filter(c => c.userId !== dashboardData.id) || [];
  const teachingClasses = dashboardData?.classrooms?.filter(c => c.userId === dashboardData.id) || [];
  const [openGroups, setOpenGroups] = useState({
    classes: true,
    teaching: true,
    todo: true,
  });

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const navItemClass = "flex items-center px-4 py-3 rounded-[20px] cursor-pointer transition-colors text-white no-underline gap-3 text-base font-semibold hover:bg-white/10";
  const activeNavItemClass = "bg-[#89a88c]";

  return (
    <div className="w-[260px] bg-[#517559] text-white h-screen flex flex-col py-8 px-5 box-border font-sans shrink-0 overflow-hidden relative">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="text-[28px] font-extrabold tracking-[4px] text-center w-full drop-shadow-md">
          LIKHÂ
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-1 absolute right-4 top-6 text-white hover:bg-white/10 rounded-md"
          >
            <X size={24} />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2">
        <NavLink 
          to="/dashboard" 
          end
          className={({ isActive }) => `${navItemClass} ${isActive ? activeNavItemClass : ''}`}
        >
          <Home size={22} strokeWidth={2.5} />
          Home
        </NavLink>

        <div className="mb-2">
          <div 
            className="flex items-center justify-between px-4 py-2 cursor-pointer text-white text-base font-bold rounded-lg transition-colors hover:bg-white/10"
            onClick={() => toggleGroup('classes')}
          >
            <div className="flex items-center gap-3">
              <LineChart size={22} strokeWidth={2} />
              Classes
            </div>
            <motion.div
              initial={false}
              animate={{ rotate: openGroups.classes ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={18} strokeWidth={2.5} />
            </motion.div>
          </div>
          <AnimatePresence initial={false}>
            {openGroups.classes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col pl-9 mt-2 gap-3 pb-2">
                  {enrolledClasses.length > 0 ? enrolledClasses.map(cls => (
                    <div 
                      key={cls.id} 
                      onClick={() => { navigate(`/dashboard/classroom/${cls.roomCode}`); if (onClose) onClose(); }}
                      className="flex items-start gap-3 text-[13px] leading-snug text-white/90 cursor-pointer py-1 pr-2 rounded-md transition-colors hover:text-white"
                    >
                      <div className="w-[22px] h-[22px] rounded-full bg-white text-[#517559] flex items-center justify-center font-extrabold text-[11px] shrink-0 mt-[2px] shadow-sm uppercase">
                        {cls.name.charAt(0)}
                      </div>
                      <span className="truncate">{cls.name}</span>
                    </div>
                  )) : (
                    <div className="text-white/50 text-xs italic px-2">No classes yet</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mb-2">
          <div 
            className="flex items-center justify-between px-4 py-2 cursor-pointer text-white text-base font-bold rounded-lg transition-colors hover:bg-white/10"
            onClick={() => toggleGroup('teaching')}
          >
            <div className="flex items-center gap-3">
              <Users size={22} strokeWidth={2} />
              Teaching
            </div>
            <motion.div
              initial={false}
              animate={{ rotate: openGroups.teaching ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={18} strokeWidth={2.5} />
            </motion.div>
          </div>
          <AnimatePresence initial={false}>
            {openGroups.teaching && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col pl-9 mt-2 gap-3 pb-2">
                  {teachingClasses.length > 0 ? teachingClasses.map(cls => (
                    <div 
                      key={cls.id} 
                      onClick={() => { navigate(`/dashboard/classroom/${cls.roomCode}`); if (onClose) onClose(); }}
                      className="flex items-start gap-3 text-[13px] leading-snug text-white/90 cursor-pointer py-1 pr-2 rounded-md transition-colors hover:text-white"
                    >
                      <div className="w-[22px] h-[22px] rounded-full bg-white text-[#517559] flex items-center justify-center font-extrabold text-[11px] shrink-0 mt-[2px] shadow-sm uppercase">
                        {cls.name.charAt(0)}
                      </div>
                      <span className="truncate">{cls.name}</span>
                    </div>
                  )) : (
                    <div className="text-white/50 text-xs italic px-2">Not teaching any classes</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mb-2">
          <div 
            className="flex items-center justify-between px-4 py-2 cursor-pointer text-white text-base font-bold rounded-lg transition-colors hover:bg-white/10"
            onClick={() => toggleGroup('todo')}
          >
            <div className="flex items-center gap-3">
              <CheckSquare size={22} strokeWidth={2} />
              To-do
            </div>
            <motion.div
              initial={false}
              animate={{ rotate: openGroups.todo ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={18} strokeWidth={2.5} />
            </motion.div>
          </div>
          <AnimatePresence initial={false}>
            {openGroups.todo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col pl-9 mt-2 gap-4 pb-2">
                  <div className="flex items-start gap-3 text-[13px] cursor-pointer py-1 pr-2 rounded-md transition-colors hover:text-white">
                    <div className="w-[22px] h-[22px] rounded-full border-[1.5px] border-white text-white flex items-center justify-center bg-transparent mt-[2px] shrink-0">
                      <ClipboardList size={12} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="font-bold text-white text-[13px]">Performance Task</span>
                      <span className="text-[11px] text-white/80 mt-[2px]">BSIT 3G - IT ELEC<br/>Deadline - June 9 2027</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-[13px] cursor-pointer py-1 pr-2 rounded-md transition-colors hover:text-white">
                    <div className="w-[22px] h-[22px] rounded-full border-[1.5px] border-white text-white flex items-center justify-center bg-transparent mt-[2px] shrink-0">
                      <ClipboardList size={12} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="font-bold text-white text-[13px]">Performance Task</span>
                      <span className="text-[11px] text-white/80 mt-[2px]">BSIT 3G - IT ELEC<br/>Deadline - June 9 2027</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 pt-4 flex flex-col gap-2 shrink-0 border-t border-white/10 relative z-10 bg-[#517559]">
        <NavLink 
          to="/dashboard/settings" 
          className={({ isActive }) => `${navItemClass} ${isActive ? activeNavItemClass : ''}`}
        >
          <Settings size={22} strokeWidth={2.5} />
          Settings
        </NavLink>
        
        {onLogout && (
          <button 
            onClick={onLogout}
            className={`${navItemClass} bg-transparent border-none text-left w-full hover:bg-white/10 hover:text-red-100 transition-colors mt-2`}
          >
            <LogOut size={22} strokeWidth={2.5} />
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
