import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Plus, FileText, ExternalLink, MoreVertical, ArrowUp, Bot, Sparkles,
  PenLine, Users, ChevronRight, Clock, Play, Brain, ScrollText, Layers,
  MessageCircle, ChevronDown, BookOpen, Cpu, X, Settings, Lock, Unlock,
  Hash, Calendar, User, ClipboardList, UploadCloud, Circle, CheckSquare,
  Trash2, Share2, Copy, Check, Loader2, PanelRightOpen, PanelRightClose, Zap
} from 'lucide-react';
import { getClassroomByCode, generateInviteLink } from '../../api/classroom.api';
import useThemeStore from '../../store/theme.store';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── mock data ─── */
const MOCK_MATERIALS = [
  'Introduction to Programming PPT',
  'Data Structures Slides',
  'Algorithm Analysis PDF',
  'OOP Concepts Guide',
  'Database Design Notes',
  'Introduction to Programming PPT',
  'Data Structures Slides',
  'Algorithm Analysis PDF',
  'OOP Concepts Guide',
  'Database Design Notes',
];

const MOCK_CLASSWORKS = [
  { id: 1, title: 'Activity number 1', description: 'Complete the given programming exercises. Focus on using loops and conditional statements to solve problems effectively.', deadline: 'June 9, 2027', thumbnail: null },
  { id: 2, title: 'Activity number 2', description: 'Create a simple data structure implementation using arrays and linked lists.', deadline: 'June 12, 2027', thumbnail: null },
  { id: 3, title: 'Performance Task', description: 'Build a small console application that demonstrates OOP principles.', deadline: 'June 15, 2027', thumbnail: null },
  { id: 4, title: 'Activity number 4', description: 'Analyze the time complexity of different sorting algorithms.', deadline: 'June 18, 2027', thumbnail: null },
  { id: 5, title: 'Activity number 5', description: 'Design and implement a simple database schema for a library system.', deadline: 'June 20, 2027', thumbnail: null },
  { id: 6, title: 'Quiz 1', description: 'Online quiz covering modules 1-3. Time limit is 30 minutes.', deadline: 'June 22, 2027', thumbnail: null },
];

const AI_RESPONSES = [
  "I've analyzed the selected material. This covers core programming concepts including variables, loops, and functions. Would you like me to summarize any specific section?",
  "Great question! Based on the learning material, the key takeaway here is understanding how event-driven programming differs from procedural programming.",
  "Here's a quick breakdown:\n\n1. Events are triggered by user actions\n2. Handlers respond to those events\n3. The event loop keeps the app responsive\n\nWant me to elaborate on any of these?",
  "I can help you understand this concept better. Let me generate a simple example based on the selected material...",
  "Based on the material, the most important concepts to focus on are abstraction, encapsulation, inheritance, and polymorphism. These are the four pillars of OOP.",
];

const STUDIO_OUTPUTS = {
  quiz: `Quiz: Introduction to Programming\n\n1. What is a variable?\n   a) A fixed value  b) A named storage location ✓\n   c) A function  d) A loop\n\n2. Which loop runs at least once?\n   a) for  b) while  c) do-while ✓  d) foreach\n\n3. What does OOP stand for?\n   a) Object Oriented Programming ✓\n   b) Online Open Platform\n   c) Output Optimization Protocol\n   d) None of the above`,
  summary: `Summary: Introduction to Programming PPT\n\nThis material covers the foundational concepts of programming. Key topics include:\n\n• Variables and data types\n• Control structures (if/else, loops)\n• Functions and modular programming\n• Introduction to Object-Oriented Programming\n\nThe lecture emphasizes writing clean, readable code and following best practices for software development.`,
  overview: `Overview: Introduction to Programming\n\nThis course module introduces students to the world of programming. Beginning with core logic and problem-solving, students will progress through:\n\nModule 1 – Basics (Week 1-2)\nModule 2 – Control Flow (Week 3-4)\nModule 3 – Functions (Week 5-6)\nModule 4 – OOP Fundamentals (Week 7-8)\n\nBy the end, students should be able to write functional programs independently.`,
};

/* ════════════════════════════════════════════════════════════ */
const ClassroomDetail = () => {
  const { code } = useParams();
  const { theme } = useThemeStore();
  const [classroom, setClassroom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('materials');
  const [activeChat, setActiveChat] = useState('chatbox');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hello! Select a learning material and ask me anything. I'm here to help you understand the content.", typing: false },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedWork, setSelectedWork] = useState(MOCK_CLASSWORKS[0]);
  const [studioOutput, setStudioOutput] = useState(null);
  const [studioLoading, setStudioLoading] = useState(false);
  const [studioAction, setStudioAction] = useState(null);
  const [chatOpen, setChatOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState('Gemini Flash');
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showMaterialPicker, setShowMaterialPicker] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCreateChoiceModal, setShowCreateChoiceModal] = useState(false);
  const [showCreateMaterialModal, setShowCreateMaterialModal] = useState(false);
  const [showCreateActivityModal, setShowCreateActivityModal] = useState(false);
  const [activityQuestions, setActivityQuestions] = useState([{ id: 1, type: 'multiple_choice', question: '', options: ['Option 1'] }]);
  const [materialFilePreview, setMaterialFilePreview] = useState(null);
  const [updateData, setUpdateData] = useState({ name: '', description: '', private: false, roomPassword: '', oldPassword: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [copied, setCopied] = useState(false);

  const messagesEndRef = useRef(null);
  const msgIdRef = useRef(10);
  const textareaRef = useRef(null);

  const AI_MODELS = ['Gemini Flash', 'Gemini Pro', 'Gemini Ultra'];

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        setIsLoading(true);
        const data = await getClassroomByCode(code);
        setClassroom(Array.isArray(data) && data.length > 0 ? data[0] : data);
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    };
    if (code) fetchClassroom();
  }, [code]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    const handler = () => { setShowModelPicker(false); setShowMaterialPicker(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleUpdateClassroom = async () => {
    try {
      setIsUpdating(true);
      setUpdateError('');
      const payload = { name: updateData.name, description: updateData.description, private: updateData.private };
      if (updateData.private && updateData.roomPassword) {
        payload.roomPassword = updateData.roomPassword;
        if (classroom.private) payload.oldPassword = updateData.oldPassword;
      }
      const updated = await import('../../api/classroom.api').then(m => m.updateClassroom(classroom.id, payload));
      setClassroom(updated);
      setShowUpdateModal(false);
    } catch (err) {
      setUpdateError(err.response?.data?.message || err.message || 'Failed to update classroom');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleShareClick = async () => {
    setShowInviteModal(true);
    setIsGeneratingLink(true);
    try {
      const { token } = await generateInviteLink(classroom.id);
      setInviteLink(`${window.location.origin}/join/${token}`);
    } catch (err) {
      console.error('Error generating link', err);
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isAiTyping) return;
    const uid = ++msgIdRef.current;
    setMessages(prev => [...prev, { id: uid, sender: 'user', text, typing: false }]);
    setInputValue('');
    setIsAiTyping(true);
    const tid = ++msgIdRef.current;
    setMessages(prev => [...prev, { id: tid, sender: 'ai', text: '', typing: true }]);
    setTimeout(() => {
      const reply = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      setMessages(prev => prev.filter(m => m.id !== tid).concat({ id: ++msgIdRef.current, sender: 'ai', text: reply, typing: false }));
      setIsAiTyping(false);
    }, 1800 + Math.random() * 700);
  };

  const handleStudio = (type) => {
    setStudioAction(type);
    setStudioOutput(null);
    setStudioLoading(true);
    setTimeout(() => { setStudioOutput(STUDIO_OUTPUTS[type]); setStudioLoading(false); }, 1500);
  };

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center bg-[#FAFCFA] dark:bg-[#121612] h-full transition-colors duration-200">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-[3px] border-[#d6e0d3] border-t-[#5D7C59] rounded-full animate-spin" />
        <span className="text-[#5D7C59] font-semibold text-sm">Loading Classroom...</span>
      </div>
    </div>
  );

  if (!classroom) return (
    <div className="flex-1 flex items-center justify-center bg-[#FAFCFA] dark:bg-[#121612] h-full transition-colors duration-200">
      <span className="text-[#5D7C59] dark:text-[#7A9A7B] font-semibold">Classroom not found.</span>
    </div>
  );

  /* ── Shared Modal wrapper ── */
  const ModalBackdrop = ({ onClose, children }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 md:p-6"
    >
      <div onClick={e => e.stopPropagation()} className="w-full max-w-lg">
        {children}
      </div>
    </motion.div>
  );

  const ModalCard = ({ children, className = '' }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
      className={`bg-white dark:bg-[#1A211A] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 transition-colors duration-200 ${className}`}
    >
      {children}
    </motion.div>
  );

  const ModalHeader = ({ title, subtitle, onClose, gradientHeader = false }) => (
    gradientHeader ? (
      <div className="bg-gradient-to-br from-[#5D7C59] to-[#4A6447] px-6 pt-5 pb-7 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[#7A9A7B]/40 pointer-events-none" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            {subtitle && <p className="text-white/65 text-xs mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/15 transition-colors border-none bg-transparent cursor-pointer">
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    ) : (
      <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex items-start justify-between transition-colors duration-200">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          {subtitle && <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{subtitle}</p>}
        </div>
        <button onClick={onClose} className="p-1.5 rounded-full text-[#5D7C59] bg-[#5D7C59]/10 hover:bg-[#5D7C59]/20 transition-colors border-none cursor-pointer">
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>
    )
  );

  const FormInput = ({ label, value, onChange, placeholder, type = 'text' }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-[#5D7C59] dark:text-[#7A9A7B] uppercase tracking-widest">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-[#FAFCFA] dark:bg-[#232B23] border-2 border-gray-200 dark:border-white/10 rounded-xl text-gray-800 dark:text-gray-200 text-sm font-medium outline-none focus:border-[#5D7C59] dark:focus:border-[#7A9A7B] focus:ring-2 focus:ring-[#5D7C59]/15 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-normal"
      />
    </div>
  );

  /* ══ RIGHT PANEL ══ */
  const renderRightPanel = () => {

    /* ── Materials tab: AI Chat panel ── */
    if (activeTab === 'materials') {
      return (
        <div className="flex shrink-0 items-stretch gap-2 relative chat-panel-container">

          {/* Always-visible toggle tab */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <button
              onClick={() => setChatOpen(p => !p)}
              title={chatOpen ? 'Hide AI Chat' : 'Show AI Chat'}
              className={`flex flex-col items-center gap-2 py-5 px-2.5 rounded-xl transition-all cursor-pointer font-sans
                ${chatOpen
                  ? 'bg-gradient-to-b from-[#5D7C59] to-[#4A6447] text-white shadow-lg border-0'
                  : 'bg-white dark:bg-[#1A211A] text-[#5D7C59] border border-gray-200 dark:border-white/10 hover:bg-[#5D7C59]/8 shadow-sm transition-colors duration-200'
                }`}
            >
              {chatOpen ? <PanelRightClose size={16} strokeWidth={2.5} /> : <PanelRightOpen size={16} strokeWidth={2.5} />}
              <span className="text-[9px] font-bold uppercase" style={{ writingMode: 'vertical-rl', letterSpacing: '0.12em' }}>AI Chat</span>
              <Zap size={13} strokeWidth={2} className={chatOpen ? 'text-[#FFC700]' : 'text-[#5D7C59]/40'} />
            </button>
          </div>

          {/* Sliding chat panel */}
          <div
            className={`shrink-0 overflow-hidden right-panel-wrapper ${chatOpen ? 'is-open' : 'is-closed'}`}
            style={{ width: chatOpen ? 370 : 0, transition: 'width 0.38s cubic-bezier(0.4,0,0.2,1)' }}
          >
            <div className="w-[370px] h-full flex flex-col bg-white dark:bg-[#1A211A] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-white/10 right-panel-inner transition-colors duration-200">

              {/* Green gradient header */}
              <div className="shrink-0 bg-gradient-to-br from-[#5D7C59] to-[#4A6447] px-4 pt-4 pb-0 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#7A9A7B]/40 pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-14 h-14 rounded-full bg-[#FFC700]/8 pointer-events-none" />

                {/* Logo row */}
                <div className="relative z-10 flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-tight">Likhâ AI</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[10px] text-white/65 font-medium">{selectedModel}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setChatOpen(false)}
                    className="p-1.5 rounded-xl text-white/80 hover:bg-white/20 hover:text-white transition-all cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    <PanelRightClose size={14} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Tab switcher */}
                <div className="relative z-10 flex gap-1">
                  {[['chatbox', MessageCircle, 'Chat'], ['studio', Sparkles, 'AI Studio']].map(([key, Icon, label]) => (
                    <button
                      key={key}
                      onClick={() => setActiveChat(key)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-bold rounded-t-xl transition-all cursor-pointer
                        ${activeChat === key ? 'bg-white dark:bg-[#232B23] text-[#4A6447] dark:text-[#7A9A7B]' : 'text-white/65 hover:text-white'}`}
                      style={{ background: activeChat === key ? 'inherit' : 'rgba(255,255,255,0.1)', border: 'none' }}
                    >
                      <Icon size={12} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ══ CHAT ══ */}
              {activeChat === 'chatbox' && (
                <div className="flex-1 flex flex-col overflow-hidden bg-[#FAFCFA] dark:bg-[#121612] transition-colors duration-200">

                  {/* Material + model status bar */}
                  <div className="shrink-0 px-3 py-2 border-b border-gray-100 dark:border-white/10 bg-white dark:bg-[#1A211A] flex items-center gap-2 transition-colors duration-200">
                    {selectedMaterial !== null ? (
                      <div className="flex items-center gap-2 bg-[#5D7C59]/8 border border-[#5D7C59]/20 rounded-full px-3 py-1 min-w-0 flex-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FFC700] shrink-0" />
                        <span className="text-[11px] font-semibold text-[#4A6447] truncate flex-1">{MOCK_MATERIALS[selectedMaterial]}</span>
                        <button onClick={() => setSelectedMaterial(null)} className="text-[#5D7C59]/50 hover:text-[#5D7C59] text-xs bg-transparent border-none cursor-pointer shrink-0">✕</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-gray-400 flex-1">
                        <BookOpen size={12} />
                        <span className="text-[11px]">No material selected</span>
                      </div>
                    )}
                    {/* Model picker */}
                    <div className="relative shrink-0">
                      <button
                        onClick={e => { e.stopPropagation(); setShowModelPicker(p => !p); setShowMaterialPicker(false); }}
                        className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full px-2.5 py-1 cursor-pointer border-none transition-colors"
                      >
                        <Cpu size={10} className="text-gray-500" />
                        <span className="text-[10px] text-gray-600 font-semibold">{selectedModel}</span>
                        <ChevronDown size={9} className="text-gray-400" style={{ transform: showModelPicker ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      </button>
                      {showModelPicker && (
                        <div onClick={e => e.stopPropagation()} className="absolute top-[110%] right-0 w-44 bg-white dark:bg-[#232B23] rounded-2xl shadow-xl overflow-hidden z-50 border border-gray-100 dark:border-white/10" style={{ animation: 'fadeSlideIn 0.18s ease-out' }}>
                          <div className="px-3 py-2 border-b border-gray-100 dark:border-white/10">
                            <p className="text-[10px] font-bold text-[#5D7C59] uppercase tracking-widest">AI Model</p>
                          </div>
                          {AI_MODELS.map(model => (
                            <button key={model} onClick={() => { setSelectedModel(model); setShowModelPicker(false); }}
                              className={`w-full text-left px-3.5 py-2.5 text-[12.5px] flex items-center gap-2.5 transition-colors cursor-pointer border-none font-sans
                                ${selectedModel === model ? 'bg-[#5D7C59]/8 dark:bg-[#5D7C59]/20 text-[#5D7C59] dark:text-[#7A9A7B] font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 font-normal'}`}>
                              <Sparkles size={12} className={selectedModel === model ? 'text-[#5D7C59] dark:text-[#7A9A7B]' : 'text-gray-400'} />
                              {model}
                              {selectedModel === model && <Check size={12} className="text-[#5D7C59] ml-auto shrink-0" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 messages-area">
                    {/* Welcome state */}
                    {messages.length === 1 && (
                      <div className="flex flex-col items-center pt-4 gap-4" style={{ animation: 'fadeSlideIn 0.5s ease-out' }}>
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5D7C59] to-[#4A6447] flex items-center justify-center shadow-lg">
                          <Bot size={26} className="text-white" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-gray-800 dark:text-white mb-1">Likhâ AI Assistant</p>
                          <p className="text-[12px] text-gray-400 dark:text-gray-500 leading-relaxed">Select a material on the left, then<br/>ask me anything about it.</p>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-2 mt-1">
                          {[
                            { icon: ScrollText, label: 'Summarize this' },
                            { icon: Brain, label: 'Key concepts?' },
                            { icon: Layers, label: 'Give me a quiz' },
                            { icon: BookOpen, label: 'Explain simply' },
                          ].map(({ icon: Icon, label }) => (
                            <button
                              key={label}
                              onClick={() => setInputValue(label)}
                              className="flex items-center gap-2 bg-white dark:bg-[#232B23] border border-gray-200 dark:border-white/10 hover:border-[#5D7C59]/40 hover:bg-[#5D7C59]/5 dark:hover:bg-white/5 rounded-xl px-3 py-2.5 text-[11.5px] text-gray-600 dark:text-gray-300 hover:text-[#4A6447] dark:hover:text-[#7A9A7B] font-medium transition-all cursor-pointer text-left"
                            >
                              <Icon size={13} className="text-[#5D7C59] shrink-0" />
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Messages */}
                    {messages.map((msg, idx) => {
                      const isAI = msg.sender === 'ai';
                      return (
                        <div
                          key={msg.id}
                          className={`flex gap-2.5 ${isAI ? 'items-end' : 'items-end flex-row-reverse'}`}
                          style={{ animation: idx === messages.length - 1 ? 'fadeSlideIn 0.3s ease-out' : 'none' }}
                        >
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-sm mb-0.5
                            ${isAI ? 'bg-gradient-to-br from-[#5D7C59] to-[#4A6447]' : 'bg-[#FFC700]'}`}>
                            {isAI ? <Bot size={14} className="text-white" /> : <User size={14} className="text-gray-800" />}
                          </div>
                          <div className={`flex flex-col gap-1 max-w-[78%] ${isAI ? 'items-start' : 'items-end'}`}>
                            <span className={`text-[10px] font-bold px-1 ${isAI ? 'text-[#5D7C59]' : 'text-gray-400'}`}>
                              {isAI ? 'Likhâ AI' : 'You'}
                            </span>
                            <div className={`text-[13px] leading-relaxed whitespace-pre-line break-words px-4 py-2.5 shadow-sm
                              ${isAI
                                ? 'bg-white dark:bg-[#232B23] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 rounded-tl rounded-tr-2xl rounded-br-2xl rounded-bl-2xl transition-colors duration-200'
                                : 'bg-gradient-to-br from-[#5D7C59] to-[#4A6447] text-white rounded-2xl rounded-tr rounded-bl-2xl'
                              }`}>
                              {msg.typing ? (
                                <div className="flex gap-1.5 items-center py-0.5">
                                  {[0, 1, 2].map(i => (
                                    <div key={i} className="w-2 h-2 rounded-full bg-gray-400"
                                      style={{ animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                                  ))}
                                </div>
                              ) : msg.text}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="shrink-0 p-3 bg-white dark:bg-[#1A211A] border-t border-gray-100 dark:border-white/10 transition-colors duration-200">
                    {/* Material picker button */}
                    <div className="relative mb-2">
                      <button
                        onClick={e => { e.stopPropagation(); setShowMaterialPicker(p => !p); setShowModelPicker(false); }}
                        className="w-full flex items-center gap-2 bg-[#FAFCFA] dark:bg-[#1A211A] border border-gray-200 dark:border-white/10 hover:border-[#5D7C59]/50 dark:hover:border-[#7A9A7B]/50 rounded-xl px-3 py-2 cursor-pointer transition-all text-left"
                      >
                        <BookOpen size={13} className="text-[#5D7C59] dark:text-[#7A9A7B] shrink-0" />
                        <span className="text-[11.5px] text-gray-400 dark:text-gray-500 font-medium flex-1 truncate">
                          {selectedMaterial !== null ? MOCK_MATERIALS[selectedMaterial] : 'Attach a material for context...'}
                        </span>
                        <ChevronDown size={12} className="text-gray-400 dark:text-gray-500 shrink-0" style={{ transform: showMaterialPicker ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      </button>
                      {showMaterialPicker && (
                        <div onClick={e => e.stopPropagation()} className="absolute bottom-[110%] left-0 right-0 bg-white dark:bg-[#232B23] rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-100 dark:border-white/10 mb-1" style={{ animation: 'fadeSlideIn 0.18s ease-out' }}>
                          <div className="px-4 py-2.5 border-b border-gray-100 dark:border-white/10 flex items-center gap-2">
                            <BookOpen size={13} className="text-[#5D7C59] dark:text-[#7A9A7B]" />
                            <p className="text-[10px] font-bold text-[#5D7C59] dark:text-[#7A9A7B] uppercase tracking-widest">Select Material</p>
                          </div>
                          <div className="max-h-52 overflow-y-auto">
                            {MOCK_MATERIALS.filter((m, i, arr) => arr.indexOf(m) === i).map((mat, i) => (
                              <button key={i} onClick={() => { setSelectedMaterial(i); setShowMaterialPicker(false); }}
                                className={`w-full text-left px-4 py-2.5 text-[12.5px] flex items-center gap-3 transition-colors cursor-pointer border-none font-sans
                                  ${selectedMaterial === i ? 'bg-[#5D7C59]/8 dark:bg-[#5D7C59]/20 text-[#5D7C59] dark:text-[#7A9A7B] font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 font-normal'}`}>
                                <FileText size={13} className={selectedMaterial === i ? 'text-[#5D7C59] dark:text-[#7A9A7B]' : 'text-gray-400 dark:text-gray-500'} />
                                <span className="truncate flex-1">{mat}</span>
                                {selectedMaterial === i && <Check size={12} className="text-[#5D7C59] dark:text-[#7A9A7B] shrink-0" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Textarea */}
                    <div className="flex items-end gap-2 bg-[#FAFCFA] dark:bg-[#1A211A] border-2 border-gray-200 dark:border-white/10 rounded-xl px-3.5 pt-3 pb-2.5 focus-within:border-[#5D7C59] dark:focus-within:border-[#7A9A7B] focus-within:bg-white dark:focus-within:bg-[#232B23] transition-all duration-200">
                      <textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder={isAiTyping ? '✦ Likhâ AI is thinking...' : 'Ask anything about the material...'}
                        rows={1}
                        disabled={isAiTyping}
                        className="flex-1 border-none bg-transparent resize-none text-[13px] text-gray-800 dark:text-gray-200 outline-none font-sans leading-relaxed placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        style={{ maxHeight: 110, overflowY: 'auto', caretColor: '#5D7C59' }}
                      />
                      <button
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isAiTyping}
                        className={`w-9 h-9 rounded-xl border-none flex items-center justify-center shrink-0 transition-all
                          ${inputValue.trim() && !isAiTyping
                            ? 'bg-gradient-to-br from-[#5D7C59] to-[#4A6447] hover:scale-105 cursor-pointer shadow-md'
                            : 'bg-gray-100 cursor-default'
                          }`}
                      >
                        <ArrowUp size={16} className={inputValue.trim() && !isAiTyping ? 'text-white' : 'text-gray-400'} strokeWidth={2.5} />
                      </button>
                    </div>
                    <p className="text-center text-[9.5px] text-gray-300 mt-1.5 tracking-wide">Enter to send · Shift+Enter for new line</p>
                  </div>
                </div>
              )}

              {/* ══ STUDIO ══ */}
              {activeChat === 'studio' && (
                <div className="flex-1 flex flex-col overflow-hidden bg-[#FAFCFA] dark:bg-[#121612] transition-colors duration-200">
                  <div className="px-4 py-3 shrink-0 border-b border-gray-100 dark:border-white/10 bg-white dark:bg-[#1A211A] transition-colors duration-200">
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Generation Tools</p>
                    <p className="text-[12px] text-gray-600 dark:text-gray-400 font-medium mt-0.5">Select a material, then generate AI content</p>
                  </div>
                  <div className="px-3 pt-3 flex flex-col gap-2 shrink-0">
                    {[
                      { key: 'quiz', label: 'Create reviewer quiz', desc: 'Generate Q&A from material', icon: Brain, grad: 'from-purple-500 to-purple-700' },
                      { key: 'summary', label: 'Create a summary', desc: 'Condense key points', icon: ScrollText, grad: 'from-[#5D7C59] to-[#4A6447]' },
                      { key: 'overview', label: 'Create an overview', desc: 'High-level topic outline', icon: Layers, grad: 'from-blue-500 to-blue-700' },
                    ].map(({ key, label, desc, icon: Icon, grad }) => (
                      <button
                        key={key}
                        onClick={() => handleStudio(key)}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3.5 cursor-pointer transition-all text-left border font-sans w-full
                          ${studioAction === key ? 'bg-white dark:bg-[#232B23] border-[#5D7C59]/40 shadow-md' : 'bg-white dark:bg-[#1A211A] border-gray-200 dark:border-white/10 hover:border-[#5D7C59]/30 dark:hover:border-white/20 hover:shadow-sm'}`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${grad} shadow-sm`}>
                          <Icon size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-[13px] font-semibold ${studioAction === key ? 'text-[#4A6447] dark:text-[#7A9A7B]' : 'text-gray-800 dark:text-gray-200'}`}>{label}</div>
                          <div className="text-[11px] text-gray-400 dark:text-gray-500">{desc}</div>
                        </div>
                        <ChevronRight size={14} className={studioAction === key ? 'text-[#5D7C59]' : 'text-gray-300'} />
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 messages-area mt-2">
                    {studioLoading ? (
                      <div className="flex flex-col items-center justify-center gap-3 h-full pb-8">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5D7C59] to-[#4A6447] flex items-center justify-center shadow-lg" style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
                          <Sparkles size={20} className="text-[#FFC700]" />
                        </div>
                        <p className="text-[13px] text-gray-500 font-semibold">Generating with AI...</p>
                        <p className="text-[11px] text-gray-400">This may take a moment</p>
                      </div>
                    ) : studioOutput ? (
                      <div className="bg-white dark:bg-[#232B23] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm transition-colors duration-200" style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
                        <div className="px-4 py-3 bg-gradient-to-r from-[#5D7C59] to-[#4A6447] flex items-center gap-2">
                          <Sparkles size={13} className="text-[#FFC700]" />
                          <span className="text-[12px] font-bold text-white">
                            {studioAction === 'quiz' ? 'Reviewer Quiz' : studioAction === 'summary' ? 'Summary' : 'Overview'}
                          </span>
                        </div>
                        <pre className="p-4 text-[12.5px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">{studioOutput}</pre>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-3 pb-8">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                          <Sparkles size={20} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <p className="text-[12.5px] text-gray-400 dark:text-gray-500 text-center font-medium">Pick a tool above to<br/>generate AI content</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

      if (activeTab === 'works') {
      return (
        <div className="fixed-right-panel w-[360px] shrink-0 bg-white dark:bg-[#1A211A] rounded-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-white/10 shadow-md transition-colors duration-200">
          {selectedWork ? (
            <>
              <div className="h-[140px] bg-gradient-to-br from-[#5D7C59] to-[#4A6447] shrink-0 rounded-t-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
                <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-full bg-black/5" />
                <div className="absolute top-3 right-3 bg-[#FFC700] text-gray-900 text-[11px] font-bold px-3 py-1 rounded-full shadow-md">100 Points</div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center shadow-lg" style={{ animation: 'fadeSlideIn 0.5s ease-out' }}>
                  <PenLine size={26} className="text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{selectedWork.title}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg bg-[#5D7C59]/10 text-[#5D7C59] dark:text-[#7A9A7B] shrink-0">Active</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{selectedWork.description}</p>
                <div className="flex flex-wrap gap-2">
                  {['Programming', 'Logic'].map(tag => (
                    <span key={tag} className="text-[10.5px] text-[#5D7C59] bg-[#5D7C59]/10 px-2.5 py-1 rounded-full font-semibold">{tag}</span>
                  ))}
                </div>
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/10 flex flex-col gap-3">
                  <div className="flex items-center gap-3 bg-[#FAFCFA] dark:bg-[#232B23] px-4 py-3 rounded-xl border border-gray-100 dark:border-white/5 transition-colors duration-200">
                    <div className="w-8 h-8 rounded-full bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20 flex items-center justify-center shrink-0">
                      <Clock size={14} className="text-[#5D7C59] dark:text-[#7A9A7B]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Due Date</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{selectedWork.deadline}</p>
                    </div>
                  </div>
                  <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#5D7C59] to-[#4A6447] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all border-none cursor-pointer">
                    <Play size={15} fill="white" /> Start Activity
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col gap-4 items-center justify-center text-gray-400">
              <div className="w-16 h-16 rounded-2xl bg-[#5D7C59]/10 flex items-center justify-center">
                <PenLine size={28} className="text-[#5D7C59]/50" />
              </div>
              <p className="text-sm font-medium">Select an activity to view details</p>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'members') {
      return (
        <div className="fixed-right-panel w-[360px] shrink-0 bg-white dark:bg-[#1A211A] rounded-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-white/10 shadow-md p-5 gap-3 transition-colors duration-200">
          <div className="flex items-center justify-between mb-1 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20 flex items-center justify-center">
                <Users size={16} className="text-[#5D7C59] dark:text-[#7A9A7B]" />
              </div>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-widest">People</span>
            </div>
            <span className="text-[11px] font-bold bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20 text-[#5D7C59] dark:text-[#7A9A7B] px-3 py-1 rounded-full">
              {(classroom?.classroomUsers || []).length} Total
            </span>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-2 messages-area">
            {(classroom?.classroomUsers || []).map(member => (
              <div key={member.userId} className="flex items-center gap-3 p-3.5 bg-[#FAFCFA] dark:bg-[#232B23] border border-gray-100 dark:border-white/5 rounded-xl hover:border-[#5D7C59]/30 dark:hover:border-[#7A9A7B]/40 hover:-translate-y-0.5 hover:shadow-sm dark:hover:shadow-none transition-all cursor-pointer">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5D7C59] to-[#4A6447] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {member.User?.profile?.firstName?.charAt(0)}{member.User?.profile?.lastName?.charAt(0)}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-white dark:border-[#232B23]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{member.User?.profile?.firstName} {member.User?.profile?.lastName}</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">{member.role === 'OWNER' ? 'Teacher · Owner' : 'Student'}</p>
                </div>
                {member.role === 'OWNER' && (
                  <span className="text-[10px] font-bold bg-[#FFC700]/15 dark:bg-[#FFC700]/25 text-[#4A6447] dark:text-[#FFC700] px-2.5 py-1 rounded-full shrink-0">Owner</span>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  /* ── Left panel ── */
  const renderLeftPanel = () => {
    if (activeTab === 'materials') return (
      <div className="left-panel-wrapper left-list flex-1 overflow-y-auto flex flex-col gap-2 min-w-0 pr-1">
        {MOCK_MATERIALS.map((title, i) => (
          <div
            key={i}
            onClick={() => setSelectedMaterial(i === selectedMaterial ? null : i)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all group
              ${selectedMaterial === i
                ? 'bg-gradient-to-r from-[#4A6447] to-[#5D7C59] shadow-md shadow-[0_4px_16px_rgba(74,100,71,0.25)]'
                : 'bg-white/50 dark:bg-white/[0.02] backdrop-blur-md border border-gray-100 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/[0.04] hover:border-[#5D7C59]/30 dark:hover:border-[#7A9A7B]/40 hover:shadow-sm dark:hover:shadow-none'
              }`}
            style={{ borderLeft: selectedMaterial === i ? '3px solid #FFC700' : '3px solid transparent' }}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${selectedMaterial === i ? 'bg-white/20' : 'bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20'}`}>
              <FileText size={17} className={selectedMaterial === i ? 'text-white' : 'text-[#5D7C59] dark:text-[#7A9A7B]'} strokeWidth={2} />
            </div>
            <span className={`flex-1 text-[13.5px] font-medium truncate ${selectedMaterial === i ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>{title}</span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={e => e.stopPropagation()} className={`p-1.5 rounded-lg border-none cursor-pointer bg-transparent transition-colors ${selectedMaterial === i ? 'text-white/65 hover:bg-white/15' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#5D7C59] dark:hover:text-[#7A9A7B]'}`}><ExternalLink size={14} strokeWidth={2} /></button>
              <button onClick={e => e.stopPropagation()} className={`p-1.5 rounded-lg border-none cursor-pointer bg-transparent transition-colors ${selectedMaterial === i ? 'text-white/65 hover:bg-white/15' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#5D7C59] dark:hover:text-[#7A9A7B]'}`}><MoreVertical size={14} strokeWidth={2} /></button>
            </div>
          </div>
        ))}
      </div>
    );

    if (activeTab === 'works') return (
      <div className="left-panel-wrapper left-list flex-1 overflow-y-auto flex flex-col gap-2 min-w-0 pr-1">
        {MOCK_CLASSWORKS.map(work => (
          <div
            key={work.id}
            onClick={() => setSelectedWork(work)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all group
              ${selectedWork?.id === work.id
                ? 'bg-gradient-to-r from-[#4A6447] to-[#5D7C59] shadow-md shadow-[0_4px_16px_rgba(74,100,71,0.25)]'
                : 'bg-white/50 dark:bg-white/[0.02] backdrop-blur-md border border-gray-100 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/[0.04] hover:border-[#5D7C59]/30 dark:hover:border-[#7A9A7B]/40 hover:shadow-sm dark:hover:shadow-none'
              }`}
            style={{ borderLeft: selectedWork?.id === work.id ? '3px solid #FFC700' : '3px solid transparent' }}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${selectedWork?.id === work.id ? 'bg-white/20' : 'bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20'}`}>
              <PenLine size={17} className={selectedWork?.id === work.id ? 'text-white' : 'text-[#5D7C59] dark:text-[#7A9A7B]'} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[13.5px] font-semibold truncate tracking-tight ${selectedWork?.id === work.id ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>{work.title}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock size={10} className={selectedWork?.id === work.id ? 'text-[#FFC700]' : 'text-gray-400 dark:text-gray-500'} />
                <span className={`text-[10.5px] font-medium ${selectedWork?.id === work.id ? 'text-[#FFC700]' : 'text-gray-400 dark:text-gray-500'}`}>Due {work.deadline}</span>
              </div>
            </div>
            <button onClick={e => e.stopPropagation()} className={`p-1.5 rounded-lg border-none cursor-pointer bg-transparent opacity-0 group-hover:opacity-100 transition-all ${selectedWork?.id === work.id ? 'text-white/65 hover:bg-white/15' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#5D7C59] dark:hover:text-[#7A9A7B]'}`}><ExternalLink size={14} strokeWidth={2.5} /></button>
          </div>
        ))}
      </div>
    );

    if (activeTab === 'members') return (
      <div className="left-panel-wrapper left-list flex-1 overflow-y-auto flex flex-col gap-2 min-w-0 pr-1">
        {(classroom?.classroomUsers || []).map(member => (
          <div key={member.userId} className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/[0.02] backdrop-blur-md border border-gray-100 dark:border-white/10 rounded-xl hover:bg-white/80 dark:hover:bg-white/[0.04] hover:border-[#5D7C59]/30 dark:hover:border-[#7A9A7B]/40 hover:shadow-sm dark:hover:shadow-none transition-all cursor-pointer">
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5D7C59] to-[#4A6447] flex items-center justify-center text-white font-bold text-sm">
                {member.User?.profile?.firstName?.charAt(0)}{member.User?.profile?.lastName?.charAt(0)}
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white dark:border-[#1A211A]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{member.User?.profile?.firstName} {member.User?.profile?.lastName}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">{member.role === 'OWNER' ? 'Teacher · Owner' : 'Student'}</p>
            </div>
            {member.role === 'OWNER' && (
              <span className="text-[10px] font-bold bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20 text-[#5D7C59] dark:text-[#7A9A7B] px-2.5 py-1 rounded-full">Teacher</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const TABS = [
    ['materials', 'Learning Materials', BookOpen],
    ['works', 'Class Works', PenLine],
    ['members', 'Members', Users],
  ];

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes typingBounce { 0%,60%,100%{transform:translateY(0);opacity:0.5;}30%{transform:translateY(-5px);opacity:1;} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 12px rgba(93,124,89,0.3);}50%{box-shadow:0 0 28px rgba(93,124,89,0.5);} }
        .messages-area::-webkit-scrollbar { width: 3px; }
        .messages-area::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
        .left-list::-webkit-scrollbar { width: 4px; }
        .left-list::-webkit-scrollbar-thumb { background: rgba(93,124,89,0.2); border-radius: 4px; }
        @media (max-width: 768px) {
          .split-container { position: relative; padding: 12px !important; }
          .split-container.tab-works, .split-container.tab-members { flex-direction: column !important; overflow-y: auto !important; }
          .split-container.tab-works .left-panel-wrapper, .split-container.tab-members .left-panel-wrapper { height: 320px !important; flex: none !important; }
          .split-container.tab-works .fixed-right-panel, .split-container.tab-members .fixed-right-panel { width: 100% !important; max-width: 100% !important; height: 480px !important; flex: none !important; }
          .split-container.tab-materials { flex-direction: row !important; overflow: hidden !important; }
          .split-container.tab-materials .left-panel-wrapper { width: 100% !important; flex: 1 !important; height: 100% !important; }
          .chat-panel-container { position: absolute !important; right: 12px; top: 12px; bottom: 12px; z-index: 50; pointer-events: none; }
          .chat-panel-container > * { pointer-events: auto; }
          .right-panel-wrapper.is-open { width: calc(100vw - 76px) !important; }
          .right-panel-wrapper.is-closed { width: 0px !important; }
          .right-panel-inner { width: calc(100vw - 76px) !important; max-width: 100% !important; }
        }
      `}</style>

      <div className="relative flex-1 flex flex-col h-full overflow-hidden bg-[#FAFCFA] dark:bg-[#121612] font-sans transition-colors duration-200" style={{ padding: '20px' }}>

        {/* Enhanced Classroom Header Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#5D7C59] to-[#4A6447] rounded-2xl p-5 mb-5 shadow-lg border border-white/10 shrink-0 animate-fadeSlideIn">
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#7A9A7B]/40 blur-xl pointer-events-none" />
          <div className="absolute -bottom-8 right-1/4 w-24 h-24 rounded-full bg-[#FFC700]/10 blur-lg pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FFC700] text-gray-900 px-2.5 py-1 rounded-full shadow-sm">
                  Classroom
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/15 text-white px-2.5 py-1 rounded-full border border-white/10">
                  Code: {classroom?.roomCode}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight truncate leading-tight">
                {classroom?.name}
              </h1>
              {classroom?.description && (
                <p className="text-white/80 text-xs md:text-sm font-medium mt-1 truncate">
                  {classroom.description}
                </p>
              )}
            </div>

            {/* Actions & Teacher Info */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex flex-col items-end text-right hidden sm:flex">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Teacher</p>
                <p className="text-xs font-bold text-white mt-0.5">
                  {classroom?.User?.profile ? `${classroom.User.profile.firstName} ${classroom.User.profile.lastName}` : 'Unknown Teacher'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareClick}
                  className="flex items-center gap-2 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/25 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                >
                  <Share2 size={14} strokeWidth={2.5} />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => setShowCreateChoiceModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#FFC700] hover:bg-[#FFD633] text-gray-900 font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all border-none cursor-pointer"
                >
                  <Plus size={14} strokeWidth={3} />
                  <span>Create</span>
                </button>
                <div
                  onClick={() => setShowDetailsModal(true)}
                  className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white font-extrabold text-sm cursor-pointer overflow-hidden hover:ring-2 hover:ring-white/50 transition-all shadow-md shrink-0"
                >
                  {classroom?.User?.profile?.profilePicture ? (
                    <img src={classroom.User.profile.profilePicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (classroom?.name || 'C').charAt(0).toUpperCase()
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main card */}
        <div className="flex-1 bg-white dark:bg-[#1A211A] rounded-2xl overflow-hidden flex flex-col min-h-0 shadow-sm border border-gray-100 dark:border-white/10 transition-colors duration-200">
          {/* Tabs */}
          <div className="flex px-5 pt-1 border-b border-gray-100 dark:border-white/10 shrink-0 gap-1 transition-colors duration-200">
            {TABS.map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 pb-4 pt-4 px-3 text-sm font-semibold transition-all border-none cursor-pointer bg-transparent relative
                  ${activeTab === key ? 'text-[#4A6447] dark:text-[#7A9A7B]' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <Icon size={15} strokeWidth={2} />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(' ')[0]}</span>
                {activeTab === key && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#4A6447] dark:bg-[#7A9A7B]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Split content */}
          <div className={`split-container tab-${activeTab} flex-1 flex gap-4 overflow-hidden p-4 min-h-0 relative`}>
            {renderLeftPanel()}
            {renderRightPanel()}
          </div>
        </div>

        {/* ══ MODALS ══ */}

        {/* ══ MODALS ══ */}
        <AnimatePresence>
          {/* Invite Modal */}
          {showInviteModal && (
            <ModalBackdrop onClose={() => setShowInviteModal(false)}>
              <ModalCard>
                <ModalHeader title="Share Classroom" subtitle="Invite students to join your classroom." onClose={() => setShowInviteModal(false)} gradientHeader />
                <div className="px-6 py-5 flex flex-col gap-4">
                  {isGeneratingLink ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                      <Loader2 size={28} className="text-[#5D7C59] dark:text-[#7A9A7B] animate-spin" />
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Generating invite link...</span>
                    </div>
                  ) : inviteLink ? (
                    <div className="flex flex-col gap-3">
                      <label className="text-[11px] font-bold text-[#5D7C59] dark:text-[#7A9A7B] uppercase tracking-widest">Invite Link</label>
                      <div className="flex gap-2">
                        <input type="text" readOnly value={inviteLink} className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-250 text-sm bg-[#FAFCFA] dark:bg-[#232B23] outline-none font-medium" />
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
                      <p className="text-[12px] text-gray-400 dark:text-gray-550 text-center">Anyone with this link {classroom?.private ? 'and the classroom password ' : ''}can join.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-8">
                      <span className="text-sm text-red-500 dark:text-red-400 font-medium">Only the owner can generate an invite link.</span>
                    </div>
                  )}
                </div>
              </ModalCard>
            </ModalBackdrop>
          )}

          {/* Details Modal */}
          {showDetailsModal && classroom && (
            <ModalBackdrop onClose={() => setShowDetailsModal(false)}>
              <ModalCard>
                <ModalHeader title="Classroom Details" subtitle="View information about this learning space." onClose={() => setShowDetailsModal(false)} gradientHeader />
                <div className="px-6 py-5 flex flex-col gap-5">
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Classroom Name</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{classroom.name}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Description</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{classroom.description || 'No description provided.'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Hash, label: 'Room Code', value: classroom.roomCode },
                      { icon: classroom.private ? Lock : Unlock, label: 'Privacy', value: classroom.private ? 'Private' : 'Public' },
                      { icon: Calendar, label: 'Created On', value: new Date(classroom.createdAt).toLocaleDateString() },
                      { icon: User, label: 'Owner', value: `${classroom.User?.profile?.firstName} ${classroom.User?.profile?.lastName}` },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-2.5 bg-[#FAFCFA] dark:bg-[#232B23] px-3.5 py-3 rounded-xl border border-gray-100 dark:border-white/5 transition-colors duration-200">
                        <Icon size={16} className="text-[#5D7C59] dark:text-[#7A9A7B] shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</p>
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-250">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-6 py-4 bg-[#FAFCFA] dark:bg-[#121612] border-t border-gray-100 dark:border-white/10 flex justify-end transition-colors duration-200">
                  <button
                    onClick={() => { setShowDetailsModal(false); setUpdateData({ name: classroom.name || '', description: classroom.description || '', private: classroom.private || false, roomPassword: '', oldPassword: '' }); setUpdateError(''); setShowUpdateModal(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#5D7C59] to-[#4A6447] text-white rounded-xl text-sm font-bold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all border-none cursor-pointer"
                  >
                    <Settings size={15} strokeWidth={2.5} /> Update Room
                  </button>
                </div>
              </ModalCard>
            </ModalBackdrop>
          )}

          {/* Update Modal */}
          {showUpdateModal && classroom && (
            <ModalBackdrop onClose={() => setShowUpdateModal(false)}>
              <ModalCard>
                <ModalHeader title="Update Classroom" subtitle="Modify your classroom's information." onClose={() => setShowUpdateModal(false)} gradientHeader />
                <div className="px-6 py-5 flex flex-col gap-4">
                  {updateError && (
                    <div className="px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
                      <X size={15} className="shrink-0 text-red-550 dark:text-red-400" /> {updateError}
                    </div>
                  )}
                  <FormInput label="Classroom Name" value={updateData.name} onChange={e => setUpdateData({ ...updateData, name: e.target.value })} placeholder="Classroom name" />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#5D7C59] dark:text-[#7A9A7B] uppercase tracking-widest">Description</label>
                    <textarea value={updateData.description} onChange={e => setUpdateData({ ...updateData, description: e.target.value })} rows={3}
                      className="w-full px-4 py-3 bg-[#FAFCFA] dark:bg-[#232B23] border-2 border-gray-200 dark:border-white/10 rounded-xl text-gray-800 dark:text-gray-200 text-sm font-medium outline-none focus:border-[#5D7C59] dark:focus:border-[#7A9A7B] focus:ring-2 focus:ring-[#5D7C59]/15 transition-all resize-none font-sans" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#5D7C59] dark:text-[#7A9A7B] uppercase tracking-widest">Privacy</label>
                    <select value={updateData.private ? 'private' : 'public'} onChange={e => setUpdateData({ ...updateData, private: e.target.value === 'private' })}
                      className="w-full px-4 py-3 bg-[#FAFCFA] dark:bg-[#232B23] border-2 border-gray-200 dark:border-white/10 rounded-xl text-gray-805 dark:text-gray-200 text-sm font-medium outline-none focus:border-[#5D7C59] dark:focus:border-[#7A9A7B] transition-all cursor-pointer">
                      <option value="public">Public — Anyone can join</option>
                      <option value="private">Private — Invite only</option>
                    </select>
                  </div>
                  {updateData.private && (
                    <div className="flex flex-col gap-3 p-4 bg-[#FAFCFA] dark:bg-[#232B23] rounded-xl border border-gray-100 dark:border-white/5 transition-colors">
                      <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">{classroom.private ? 'To change the password, enter the old one below.' : 'Set a new password for your private classroom.'}</p>
                      {classroom.private && <FormInput label="Previous Password" type="password" value={updateData.oldPassword} onChange={e => setUpdateData({ ...updateData, oldPassword: e.target.value })} placeholder="Leave blank to keep current" />}
                      <FormInput label={classroom.private ? 'New Password' : 'Password'} type="password" value={updateData.roomPassword} onChange={e => setUpdateData({ ...updateData, roomPassword: e.target.value })} placeholder={classroom.private ? 'Leave blank to keep current' : 'Enter a secure password'} />
                    </div>
                  )}
                </div>
                <div className="px-6 py-4 bg-[#FAFCFA] dark:bg-[#1A211A] border-t border-gray-100 dark:border-white/10 flex justify-end gap-3 transition-colors duration-200">
                  <button onClick={() => setShowUpdateModal(false)} disabled={isUpdating} className="px-5 py-2.5 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors border-none bg-transparent cursor-pointer disabled:opacity-50">Cancel</button>
                  <button onClick={handleUpdateClassroom} disabled={isUpdating}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#5D7C59] to-[#4A6447] text-white rounded-xl text-sm font-bold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all border-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                    {isUpdating ? <Loader2 size={15} className="animate-spin" /> : null}
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </ModalCard>
            </ModalBackdrop>
          )}

          {/* Create Choice Modal */}
          {showCreateChoiceModal && (
            <ModalBackdrop onClose={() => setShowCreateChoiceModal(false)}>
              <ModalCard>
                <ModalHeader title="Create New" subtitle="What would you like to add?" onClose={() => setShowCreateChoiceModal(false)} gradientHeader />
                <div className="p-5 grid grid-cols-2 gap-4">
                  {[
                    { icon: ClipboardList, label: 'Activity', desc: 'Create a quiz, assignment, or interactive task.', action: () => { setShowCreateChoiceModal(false); setShowCreateActivityModal(true); } },
                    { icon: FileText, label: 'Material', desc: 'Upload a document, PDF, presentation, or notes.', action: () => { setShowCreateChoiceModal(false); setShowCreateMaterialModal(true); } },
                  ].map(({ icon: Icon, label, desc, action }) => (
                    <button key={label} onClick={action}
                      className="bg-[#FAFCFA] dark:bg-[#232B23] border border-gray-100 dark:border-white/10 rounded-2xl p-5 cursor-pointer flex flex-col items-center gap-3 hover:border-[#5D7C59]/40 dark:hover:border-[#7A9A7B]/40 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-none transition-all text-center group border-none font-sans">
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
          )}

          {/* Create Material Modal */}
          {showCreateMaterialModal && (
            <ModalBackdrop onClose={() => setShowCreateMaterialModal(false)}>
              <ModalCard>
                <ModalHeader title="Create Learning Material" subtitle="Upload files for your classroom." onClose={() => setShowCreateMaterialModal(false)} gradientHeader />
                <div className="px-6 py-5 flex flex-col gap-5">
                  <FormInput label="Material Title" value="" onChange={() => {}} placeholder="e.g. Week 1 Lecture Notes" />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#5D7C59] dark:text-[#7A9A7B] uppercase tracking-widest">Upload File</label>
                    <div className="w-full aspect-video bg-[#FAFCFA] dark:bg-[#232B23] rounded-2xl border-2 border-dashed border-[#5D7C59]/25 dark:border-white/10 hover:border-[#5D7C59] dark:hover:border-[#7A9A7B] hover:bg-[#5D7C59]/4 dark:hover:bg-[#5D7C59]/10 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden">
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => { if (e.target.files?.[0]) setMaterialFilePreview(e.target.files[0].name); }} />
                      {materialFilePreview ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#5D7C59] dark:bg-[#7A9A7B] flex items-center justify-center"><FileText size={24} className="text-white dark:text-[#1A211A]" /></div>
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{materialFilePreview}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Click to replace file</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2.5 p-6 text-center">
                          <div className="w-12 h-12 rounded-xl bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20 flex items-center justify-center mb-1"><UploadCloud size={24} className="text-[#5D7C59] dark:text-[#7A9A7B]" /></div>
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Drag and drop your file here</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">or click to browse from your computer</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-[#FAFCFA] dark:bg-[#1A211A] border-t border-gray-100 dark:border-white/10 flex justify-end gap-3 transition-colors duration-200">
                  <button onClick={() => setShowCreateMaterialModal(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors border-none bg-transparent cursor-pointer">Cancel</button>
                  <button className="px-6 py-2.5 bg-gradient-to-r from-[#5D7C59] to-[#4A6447] text-white rounded-xl text-sm font-bold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all border-none cursor-pointer">Upload Material</button>
                </div>
              </ModalCard>
            </ModalBackdrop>
          )}
        </AnimatePresence>

        {/* Create Activity (full-screen builder) */}
        {showCreateActivityModal && (
          <div className="absolute inset-0 bg-[#f0f4f8] dark:bg-[#121612] flex flex-col z-[1000] overflow-y-auto transition-colors duration-200" style={{ animation: 'fadeSlideIn 0.2s ease-out' }}>
            <div className="bg-white dark:bg-[#1A211A] px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between sticky top-0 z-10 shadow-sm shrink-0 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5D7C59] to-[#4A6447] flex items-center justify-center">
                  <ClipboardList size={18} className="text-white" />
                </div>
                <div>
                  <span className="text-base font-bold text-gray-900 dark:text-white">Activity Builder</span>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">Build your quiz or assignment</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowCreateActivityModal(false)} className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors border-none bg-transparent cursor-pointer">Cancel</button>
                <button onClick={() => setShowCreateActivityModal(false)} className="px-5 py-2.5 bg-gradient-to-r from-[#5D7C59] to-[#4A6447] text-white rounded-xl text-sm font-bold shadow-md hover:-translate-y-0.5 transition-all border-none cursor-pointer">Save Activity</button>
              </div>
            </div>
            <div className="max-w-2xl w-full mx-auto px-5 py-8 flex flex-col gap-4">
              <div className="bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-colors duration-200" style={{ borderTop: '6px solid #5D7C59' }}>
                <div className="px-6 py-6 flex flex-col gap-4">
                  <input type="text" placeholder="Activity Title"
                    className="w-full border-none text-2xl font-bold text-gray-900 dark:text-white py-2 outline-none bg-transparent"
                    style={{ borderBottom: '2px solid #e5e7eb' }}
                    onFocus={e => e.currentTarget.style.borderBottomColor = '#5D7C59'}
                    onBlur={e => e.currentTarget.style.borderBottomColor = '#e5e7eb'} />
                  <input type="text" placeholder="Activity description (optional)"
                    className="w-full border-none text-sm text-gray-500 dark:text-gray-400 py-1 outline-none bg-transparent"
                    style={{ borderBottom: '1px solid #e5e7eb' }}
                    onFocus={e => e.currentTarget.style.borderBottomColor = '#5D7C59'}
                    onBlur={e => e.currentTarget.style.borderBottomColor = '#e5e7eb'} />
                </div>
              </div>
              {activityQuestions.map((q, qIndex) => (
                <div key={q.id} className="bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden relative transition-colors duration-200">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#5D7C59] rounded-r" />
                  <div className="px-6 py-5">
                    <div className="flex gap-4 items-start mb-5">
                      <input type="text" placeholder="Question text" value={q.question}
                        onChange={e => { const newQs = [...activityQuestions]; newQs[qIndex].question = e.target.value; setActivityQuestions(newQs); }}
                        className="flex-1 bg-[#FAFCFA] dark:bg-[#232B23] rounded-t-xl px-4 py-4 text-[15px] font-medium text-gray-800 dark:text-gray-200 outline-none border-b-2 border-gray-200 dark:border-white/10 focus:border-[#5D7C59] dark:focus:border-[#7A9A7B] transition-colors" />
                      <select value={q.type} onChange={e => { const newQs = [...activityQuestions]; newQs[qIndex].type = e.target.value; setActivityQuestions(newQs); }}
                        className="w-52 px-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm outline-none bg-white dark:bg-[#232B23] cursor-pointer focus:border-[#5D7C59] dark:focus:border-[#7A9A7B] transition-colors">
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="checkboxes">Checkboxes</option>
                        <option value="short_answer">Short Answer</option>
                      </select>
                    </div>
                    {q.type !== 'short_answer' ? (
                      <div className="flex flex-col gap-3 pl-2">
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-3">
                            {q.type === 'multiple_choice' ? <Circle size={18} className="text-[#5D7C59]/40 dark:text-[#7A9A7B]/40 shrink-0" /> : <CheckSquare size={18} className="text-[#5D7C59]/40 dark:text-[#7A9A7B]/40 shrink-0" />}
                            <input type="text" value={opt}
                              onChange={e => { const newQs = [...activityQuestions]; newQs[qIndex].options[oIndex] = e.target.value; setActivityQuestions(newQs); }}
                              className="flex-1 border-none text-sm text-gray-700 dark:text-gray-300 py-1 outline-none bg-transparent"
                              style={{ borderBottom: '1px solid transparent' }}
                              onFocus={e => e.currentTarget.style.borderBottomColor = '#5D7C59'}
                              onBlur={e => e.currentTarget.style.borderBottomColor = 'transparent'} />
                            {q.options.length > 1 && (
                              <button onClick={() => { const newQs = [...activityQuestions]; newQs[qIndex].options.splice(oIndex, 1); setActivityQuestions(newQs); }}
                                className="text-gray-300 dark:text-gray-500 hover:text-red-400 dark:hover:text-red-450 transition-colors border-none bg-transparent cursor-pointer p-1"><X size={15} /></button>
                            )}
                          </div>
                        ))}
                        <div className="flex items-center gap-3 mt-1">
                          {q.type === 'multiple_choice' ? <Circle size={18} className="text-gray-200 dark:text-white/10 shrink-0" /> : <CheckSquare size={18} className="text-gray-200 dark:text-white/10 shrink-0" />}
                          <button onClick={() => { const newQs = [...activityQuestions]; newQs[qIndex].options.push(`Option ${newQs[qIndex].options.length + 1}`); setActivityQuestions(newQs); }}
                            className="text-sm text-gray-400 dark:text-gray-500 hover:text-[#5D7C59] dark:hover:text-[#7A9A7B] font-medium transition-colors border-none bg-transparent cursor-pointer py-1">Add option</button>
                        </div>
                      </div>
                    ) : (
                      <div className="pl-2 mt-2">
                        <div className="text-sm text-gray-400 dark:text-gray-500 pb-2 w-2/3" style={{ borderBottom: '1px dashed #d1d5db' }}>Short answer text</div>
                      </div>
                    )}
                    <div className="flex justify-end mt-5 pt-4 border-t border-gray-100 dark:border-white/10">
                      <button onClick={() => { const newQs = activityQuestions.filter((_, i) => i !== qIndex); setActivityQuestions(newQs.length ? newQs : [{ id: Date.now(), type: 'multiple_choice', question: '', options: ['Option 1'] }]); }}
                        className="p-2 rounded-full text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all border-none bg-transparent cursor-pointer"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setActivityQuestions([...activityQuestions, { id: Date.now(), type: 'multiple_choice', question: '', options: ['Option 1'] }])}
                className="bg-white dark:bg-[#1A211A] border border-gray-200 dark:border-white/10 rounded-2xl py-4 flex items-center justify-center gap-2 text-[#5D7C59] dark:text-[#7A9A7B] text-sm font-bold hover:bg-[#FAFCFA] dark:hover:bg-[#232B23] hover:border-[#5D7C59]/40 transition-all shadow-sm cursor-pointer">
                <Plus size={17} strokeWidth={2.5} /> Add Question
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClassroomDetail;
