import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Users, CheckSquare, Settings, ChevronDown,
  ClipboardList, X, LogOut, BookOpen, GraduationCap, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TokenWidget from '../common/TokenWidget';

// Auto-assign a color from the landing page palette based on class name
const CLASS_COLORS = [
  { bg: 'bg-[#5D7C59]', text: 'text-white' },
  { bg: 'bg-[#4A6447]', text: 'text-white' },
  { bg: 'bg-[#7A9A7B]', text: 'text-white' },
  { bg: 'bg-[#FFC700]', text: 'text-gray-900' },
  { bg: 'bg-[#2d6a4f]', text: 'text-white' },
  { bg: 'bg-[#52796f]', text: 'text-white' },
];

const getClassColor = (name = '') => {
  const idx = name.charCodeAt(0) % CLASS_COLORS.length;
  return CLASS_COLORS[idx];
};

const Sidebar = ({ onClose, onLogout, dashboardData }) => {
  const navigate = useNavigate();
  const enrolledClasses = dashboardData?.classrooms?.filter(c => c.userId !== dashboardData.id) || [];
  const teachingClasses = dashboardData?.classrooms?.filter(c => c.userId === dashboardData.id) || [];
  
  const now = new Date();
  
  const todoItems = enrolledClasses.flatMap(cls => 
    (cls.activities || [])
      .filter(act => {
        if (act.submissions && act.submissions.length > 0) return false;
        if (act.deadline && new Date(act.deadline) < now) return false;
        return true;
      })
      .map(act => {
        const dateStr = act.deadline 
          ? new Date(act.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'No due date';
        return {
          title: act.title,
          sub: cls.name,
          dateText: act.deadline ? `Due ${dateStr}` : dateStr,
          id: act.id,
          roomCode: cls.roomCode
        };
      })
  );
  
  const [tokens, setTokens] = useState(dashboardData?.virtualTokens || 10000);

  useEffect(() => {
    if (dashboardData?.virtualTokens !== undefined) {
      setTokens(dashboardData.virtualTokens);
    }
  }, [dashboardData]);

  useEffect(() => {
    const handleTokensUpdate = (e) => {
      if (e.detail !== undefined) {
        setTokens(e.detail);
      }
    };
    window.addEventListener('aiTokensUpdate', handleTokensUpdate);
    return () => window.removeEventListener('aiTokensUpdate', handleTokensUpdate);
  }, []);

  const [openGroups, setOpenGroups] = useState({
    classes: true,
    teaching: true,
    todo: false,
  });

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const NavItem = ({ to, end, icon: Icon, children }) => (
    <NavLink
      to={to}
      end={end}
      onClick={() => onClose && onClose()}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 no-underline relative
        ${isActive
          ? 'bg-[#4A6447]/10 dark:bg-[#5D7C59]/20 text-[#4A6447] dark:text-[#7A9A7B] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-1 before:bg-[#4A6447] dark:before:bg-[#7A9A7B] before:rounded-r-full'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#4A6447] dark:hover:text-[#7A9A7B]'
        }`
      }
    >
      <Icon size={19} strokeWidth={2} />
      {children}
    </NavLink>
  );

  const SectionHeader = ({ label, icon: Icon, groupKey }) => (
    <button
      onClick={() => toggleGroup(groupKey)}
      className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-[#4A6447] dark:hover:text-[#7A9A7B] transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-white/5"
    >
      <span className="flex items-center gap-2">
        <Icon size={14} strokeWidth={2.5} />
        {label}
      </span>
      <motion.div
        animate={{ rotate: openGroups[groupKey] ? 180 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <ChevronDown size={13} strokeWidth={2.5} />
      </motion.div>
    </button>
  );

  return (
    <div className="w-[260px] bg-white dark:bg-[#1A211A] h-[100dvh] flex flex-col border-r border-gray-100 dark:border-white/10 shadow-sm shrink-0 overflow-hidden relative transition-colors duration-200">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 shrink-0 border-b border-gray-50 dark:border-white/5">
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => { navigate('/dashboard'); onClose && onClose(); }}
        >
          <img
            src="/image/logo.svg"
            alt="Likhā Logo"
            className="w-8 h-8"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span className="text-xl font-black text-[#4A6447] dark:text-[#7A9A7B] tracking-[0.18em]">LIKHÂ</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav content — scrollable */}
      <div className="flex flex-col flex-1 overflow-y-auto py-4 px-3 gap-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* Home */}
        <NavItem to="/dashboard" end icon={Home}>Home</NavItem>

        {/* Divider */}
        <div className="my-2" />

        {/* Enrolled Classes */}
        <SectionHeader label="Enrolled" icon={BookOpen} groupKey="classes" />
        <AnimatePresence initial={false}>
          {openGroups.classes && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-0.5 mt-1 mb-2 max-h-[200px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-[#2A342A] [&::-webkit-scrollbar-track]:transparent pr-1">
                {enrolledClasses.length > 0 ? enrolledClasses.map(cls => {
                  const color = getClassColor(cls.name);
                  return (
                    <button
                      key={cls.id}
                      onClick={() => { navigate(`/dashboard/classroom/${cls.roomCode}`); onClose && onClose(); }}
                      className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#4A6447] dark:hover:text-[#7A9A7B] transition-all text-left w-full group"
                    >
                      <div className={`w-6 h-6 rounded-lg ${color.bg} ${color.text} flex items-center justify-center font-bold text-[10px] uppercase shrink-0 shadow-sm`}>
                        {cls.name.charAt(0)}
                      </div>
                      <span className="truncate font-medium">{cls.name}</span>
                    </button>
                  );
                }) : (
                  <p className="text-xs text-gray-400 italic px-4 py-1.5">No enrolled classes yet</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Teaching Classes */}
        <SectionHeader label="Teaching" icon={GraduationCap} groupKey="teaching" />
        <AnimatePresence initial={false}>
          {openGroups.teaching && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-0.5 mt-1 mb-2 max-h-[200px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-[#2A342A] [&::-webkit-scrollbar-track]:transparent pr-1">
                {teachingClasses.length > 0 ? teachingClasses.map(cls => {
                  const color = getClassColor(cls.name);
                  return (
                    <button
                      key={cls.id}
                      onClick={() => { navigate(`/dashboard/classroom/${cls.roomCode}`); onClose && onClose(); }}
                      className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#4A6447] dark:hover:text-[#7A9A7B] transition-all text-left w-full"
                    >
                      <div className={`w-6 h-6 rounded-lg ${color.bg} ${color.text} flex items-center justify-center font-bold text-[10px] uppercase shrink-0 shadow-sm`}>
                        {cls.name.charAt(0)}
                      </div>
                      <span className="truncate font-medium">{cls.name}</span>
                    </button>
                  );
                }) : (
                  <p className="text-xs text-gray-400 italic px-4 py-1.5">Not teaching any classes</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* To-Do */}
        <SectionHeader label="To-Do" icon={CheckSquare} groupKey="todo" />
        <AnimatePresence initial={false}>
          {openGroups.todo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-1 mt-1 mb-2 px-4 max-h-[280px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-[#2A342A] [&::-webkit-scrollbar-track]:transparent pr-1">
                {todoItems.length > 0 ? todoItems.map((todo, i) => (
                  <div 
                    key={i} 
                    onClick={() => { navigate(`/dashboard/activity/${todo.id}`); onClose && onClose(); }}
                    className="flex items-start gap-3 py-2 cursor-pointer group"
                  >
                    <div className="w-5 h-5 rounded-md border-2 border-[#5D7C59] dark:border-[#7A9A7B] shrink-0 mt-0.5 flex items-center justify-center group-hover:bg-[#5D7C59]/10 dark:group-hover:bg-[#7A9A7B]/20 transition-colors">
                      <ClipboardList size={10} className="text-[#5D7C59] dark:text-[#7A9A7B]" strokeWidth={2.5} />
                    </div>
                    <div className="leading-tight flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{todo.title}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">{todo.sub}</p>
                      <p className="text-[10px] text-[#FFC700] font-semibold mt-0.5 truncate">{todo.dateText}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-gray-400 italic py-1.5">No pending tasks</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Controls */}
      <div className="px-3 py-3 border-t border-gray-100 dark:border-white/10 shrink-0 bg-gradient-to-tr from-[#5D7C59]/5 to-transparent">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">AI Assistant</span>
          <TokenWidget compact={true} />
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-100 dark:border-white/10 shrink-0 flex flex-col gap-1 bg-white dark:bg-[#1A211A] transition-colors duration-200">
        <NavItem to="/dashboard/settings" icon={Settings}>Settings</NavItem>
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 w-full text-left"
          >
            <LogOut size={19} strokeWidth={2} />
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
