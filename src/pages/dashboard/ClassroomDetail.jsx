import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import {
  Plus, FileText, ExternalLink, MoreVertical, ArrowUp, Bot, Sparkles,
  PenLine, Users, ChevronRight, Clock, Play, Brain, ScrollText, Layers,
  MessageCircle, ChevronDown, BookOpen, Cpu, User, Check,
  Share2, PanelRightOpen, PanelRightClose, Zap, Trash2, Pencil, Download,
  AlertTriangle, Loader2, Award, X
} from 'lucide-react';
import { getClassroomByCode } from '../../api/classroom.api';
import { getLearningMaterials, deleteLearningMaterial } from '../../api/learningMaterials.api';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/auth.store';
import useAIStore from '../../store/ai.store';
import InviteClassroomModal from '../../components/classroom/InviteClassroomModal';
import ClassroomDetailsModal from '../../components/classroom/ClassroomDetailsModal';
import UpdateClassroomModal from '../../components/classroom/UpdateClassroomModal';
import CreateChoiceModal from '../../components/classroom/CreateChoiceModal';
import CreateLearningMaterialModal from '../../components/classroom/CreateLearningMaterialModal';
import UpdateLearningMaterialModal from '../../components/classroom/UpdateLearningMaterialModal';
import MaterialPreviewModal from '../../components/classroom/MaterialPreviewModal';
import CreateActivityModal from '../../components/classroom/CreateActivityModal';
import { listActivities, deleteActivity, publishActivity, closeActivity } from '../../api/activity.api';
import ClassroomGradebook from '../../components/classroom/ClassroomGradebook';
import MyGrades from '../../components/classroom/MyGrades';
import ClassroomIdeaSpark from '../../components/classroom/ClassroomIdeaSpark';
import { toast } from 'sonner';

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
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { dashboardData } = useOutletContext();
  const { virtualTokens, isTokensExhausted, setVirtualTokens, setNextResetAt } = useAIStore();
  
  const [classroom, setClassroom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('materials');
  const [activeChat, setActiveChat] = useState('chatbox');
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(`chat_${code}`);
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return [
      { id: 1, sender: 'ai', text: "Hello! Select a learning material and ask me anything. I'm here to help you understand the content.", typing: false },
    ];
  });

  useEffect(() => {
    localStorage.setItem(`chat_${code}`, JSON.stringify(messages));
  }, [messages, code]);
  const [inputValue, setInputValue] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Learning Materials
  const [materials, setMaterials] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showUpdateMaterialModal, setShowUpdateMaterialModal] = useState(false);
  const [materialToUpdate, setMaterialToUpdate] = useState(null);
  const [deletingMaterialId, setDeletingMaterialId] = useState(null);
  const [deleteConfirmMaterial, setDeleteConfirmMaterial] = useState(null);
  const [previewMaterial, setPreviewMaterial] = useState(null);

  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  
  const [studioOutput, setStudioOutput] = useState(null);
  const [studioLoading, setStudioLoading] = useState(false);
  const [studioAction, setStudioAction] = useState(null);
  const [chatOpen, setChatOpen] = useState(true);
  const [showMaterialPicker, setShowMaterialPicker] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateChoiceModal, setShowCreateChoiceModal] = useState(false);
  const [showCreateMaterialModal, setShowCreateMaterialModal] = useState(false);
  const [showCreateActivityModal, setShowCreateActivityModal] = useState(false);
  const [deletingActivityId, setDeletingActivityId] = useState(null);
  const [deleteConfirmActivity, setDeleteConfirmActivity] = useState(null);
  const [togglingActivityId, setTogglingActivityId] = useState(null);

  const currentUserId = dashboardData?.id || user?.id;
  const isTeacher = classroom?.userId === currentUserId || classroom?.classroomUsers?.find(u => u.userId === currentUserId)?.role === 'OWNER';

  const TABS = [
    ['materials', 'Learning Materials', BookOpen],
    ['works', 'Class Works', PenLine],
    ['members', 'Members', Users],
    ...(isTeacher ? [['gradebook', 'Gradebook', Award], ['ai-spark', 'AI Spark', Sparkles]] : [['grades', 'My Grades', Award]])
  ];
  const messagesEndRef = useRef(null);
  const msgIdRef = useRef(10);
  const textareaRef = useRef(null);
  const fetchMaterials = useCallback(async (classroomId) => {
    if (!classroomId) return;
    setMaterialsLoading(true);
    try {
      const data = await getLearningMaterials(classroomId);
      setMaterials(Array.isArray(data.learningMaterial) ? data.learningMaterial : []);
    } catch (e) {
      console.error('Failed to fetch materials', e);
    } finally {
      setMaterialsLoading(false);
    }
  }, []);

  const fetchActivities = useCallback(async (classroomId) => {
    if (!classroomId) return;
    setActivitiesLoading(true);
    try {
      const data = await listActivities(classroomId);
      const activityList = Array.isArray(data) ? data : (data.activities || []);
      setActivities(activityList);
      if (activityList.length > 0) {
        setSelectedWork(prev => prev || activityList[0]);
      }
    } catch (e) {
      console.error('Failed to fetch activities', e);
    } finally {
      setActivitiesLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        setIsLoading(true);
        const data = await getClassroomByCode(code);
        const room = Array.isArray(data) && data.length > 0 ? data[0] : data;
        setClassroom(room);
        if (room?.id) {
          window.__CLASSROOM_ID = room.id;
          fetchMaterials(room.id);
          fetchActivities(room.id);
        }
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    };
    if (code) fetchClassroom();
  }, [code, fetchMaterials, fetchActivities]);

  const handleDeleteMaterial = async (material) => {
    setDeletingMaterialId(material.id);
    try {
      await deleteLearningMaterial(classroom.id, material.id);
      setMaterials(prev => prev.filter(m => m.id !== material.id));
      if (selectedMaterial?.id === material.id) setSelectedMaterial(null);
    } catch (e) {
      console.error('Failed to delete material', e);
    } finally {
      setDeletingMaterialId(null);
      setDeleteConfirmMaterial(null);
    }
  };

  const handleDeleteActivity = async (activity) => {
    setDeletingActivityId(activity.id);
    try {
      await deleteActivity(activity.id);
      setActivities(prev => prev.filter(a => a.id !== activity.id));
      if (selectedWork?.id === activity.id) setSelectedWork(activities.find(a => a.id !== activity.id) || null);
    } catch (e) {
      console.error('Failed to delete activity', e);
    } finally {
      setDeletingActivityId(null);
      setDeleteConfirmActivity(null);
    }
  };

  const handleToggleActivityStatus = async (activity) => {
    setTogglingActivityId(activity.id);
    try {
      const isPublished = activity.status === 'published';
      const updated = isPublished ? await closeActivity(activity.id) : await publishActivity(activity.id);
      setActivities(prev => prev.map(a => a.id === activity.id ? { ...a, status: updated.status || (isPublished ? 'closed' : 'published') } : a));
      if (selectedWork?.id === activity.id) setSelectedWork(prev => ({ ...prev, status: updated.status || (isPublished ? 'closed' : 'published') }));
      toast.success(`Activity ${isPublished ? 'closed' : 'published'} successfully!`);
    } catch (e) {
      console.error('Failed to toggle activity status', e);
      toast.error(e?.response?.data?.message || e?.message || 'Failed to update activity status');
    } finally {
      setTogglingActivityId(null);
    }
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    const handler = () => { setShowMaterialPicker(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isAiTyping) return;
    
    if (!selectedMaterial) {
      toast.warning('Please select a material first so I know what to look at!');
      return;
    }

    const uid = ++msgIdRef.current;
    setMessages(prev => [...prev, { id: uid, sender: 'user', text, typing: false }]);
    setInputValue('');
    setIsAiTyping(true);
    const tid = ++msgIdRef.current;
    setMessages(prev => [...prev, { id: tid, sender: 'ai', text: '', typing: true }]);
    
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      
      const res = await fetch(`${baseUrl}/ai/chat-document`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: text, materialId: selectedMaterial.id })
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 429) {
           setVirtualTokens(0);
           if (data.nextResetAt) setNextResetAt(data.nextResetAt);
           setMessages(prev => prev.filter(m => m.id !== tid).concat({ id: ++msgIdRef.current, sender: 'ai', text: data.message, typing: false }));
           return;
        }
        throw new Error(data.error || 'Failed to chat');
      }
      
      setMessages(prev => prev.filter(m => m.id !== tid).concat({ id: ++msgIdRef.current, sender: 'ai', text: data.reply, typing: false }));
      if (data.remainingTokens !== undefined) {
        window.dispatchEvent(new CustomEvent('aiTokensUpdate', { detail: data.remainingTokens }));
      }
    } catch (err) {
      setMessages(prev => prev.filter(m => m.id !== tid).concat({ id: ++msgIdRef.current, sender: 'ai', text: `Error: ${err.message}`, typing: false }));
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleStudio = async (type) => {
    if (!selectedMaterial) {
      toast.warning('Please select a material first.');
      return;
    }
    setStudioAction(type);
    setStudioOutput(null);
    setStudioLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiType = type === 'quiz' ? 'quiz' : 'notes';
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      const res = await fetch(`${baseUrl}/ai/generate-study-material`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ materialId: selectedMaterial.id, type: apiType })
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 429) {
           setVirtualTokens(0);
           if (data.nextResetAt) setNextResetAt(data.nextResetAt);
           setStudioOutput(`Error: ${data.message || 'Daily AI token limit reached.'}`);
           return;
        }
        throw new Error(data.error || 'Failed to generate');
      }
      
      setStudioOutput(data.content);
      if (data.remainingTokens !== undefined) {
        window.dispatchEvent(new CustomEvent('aiTokensUpdate', { detail: data.remainingTokens }));
      }
    } catch (err) {
      setStudioOutput(`Error: ${err.message}`);
    } finally {
      setStudioLoading(false);
    }
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

  /* ══ RIGHT PANEL ══ */
  const renderRightPanel = () => {

    /* ── Materials tab: AI Studio CTA ── */
    if (activeTab === 'materials') {
      return (
        <div className="hidden md:flex fixed-right-panel w-[360px] shrink-0 bg-gradient-to-br from-[#5D7C59] to-[#4A6447] rounded-2xl flex-col items-center justify-center p-8 text-center text-white shadow-xl">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6">
            <Sparkles size={32} className="text-[#FFC700]" />
          </div>
          <h3 className="text-xl font-bold mb-2">Likhâ AI Studio</h3>
          <p className="text-sm text-white/80 mb-8 leading-relaxed">
            Your personal AI tutor and study companion. Generate reviewers, summaries, and chat with your materials.
          </p>
          <div className="w-full bg-white/10 rounded-xl p-4 border border-white/20">
            <p className="text-xs font-semibold mb-1">How to use:</p>
            <p className="text-[11px] text-white/70">Click "Open AI Studio" on any learning material in the list to start studying!</p>
          </div>
        </div>
      );
    }

      if (activeTab === 'works') {
      return (
        <>
        {/* Mobile Overlay Background */}
        {selectedWork && (
          <div 
            className="md:hidden fixed inset-0 bg-black/40 z-[90] backdrop-blur-sm"
            onClick={() => setSelectedWork(null)}
          />
        )}
        <div className={`fixed-right-panel w-[360px] shrink-0 bg-white dark:bg-[#1A211A] rounded-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-white/10 shadow-md transition-colors duration-200 relative
          ${!selectedWork ? 'max-md:hidden' : 'max-md:fixed max-md:inset-x-4 max-md:bottom-4 max-md:top-24 max-md:z-[100] max-md:shadow-2xl max-md:w-auto'}
        `}>
          {selectedWork ? (
            <>
              {/* Close Button for Mobile */}
              <button
                onClick={() => setSelectedWork(null)}
                className="md:hidden absolute top-3 right-3 p-1.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full text-gray-600 dark:text-gray-300 z-10 transition-colors"
              >
                <X size={18} />
              </button>
              <div className="h-[140px] bg-gradient-to-br from-[#5D7C59] to-[#4A6447] shrink-0 rounded-t-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
                <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-full bg-black/5" />
                <div className="absolute top-3 max-md:left-3 md:right-3 bg-[#FFC700] text-gray-900 text-[11px] font-bold px-3 py-1 rounded-full shadow-md">100 Points</div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center shadow-lg" style={{ animation: 'fadeSlideIn 0.5s ease-out' }}>
                  <PenLine size={26} className="text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{selectedWork.title}</h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg shrink-0 ${
                    selectedWork.status === 'published' ? 'bg-[#5D7C59]/10 text-[#5D7C59] dark:text-[#7A9A7B]'
                    : selectedWork.status === 'closed' ? 'bg-red-500/10 text-red-500'
                    : 'bg-gray-100 dark:bg-white/10 text-gray-400'
                  }`}>{selectedWork.status || 'draft'}</span>
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
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                        {selectedWork.deadline ? new Date(selectedWork.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'No deadline'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/dashboard/activity/${selectedWork.id}`)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#5D7C59] to-[#4A6447] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all border-none cursor-pointer"
                  >
                    <Play size={15} fill="white" /> {isTeacher ? 'View Submissions' : 'Take Activity'}
                  </button>
                  {isTeacher && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActivityStatus(selectedWork)}
                        disabled={!!togglingActivityId}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                          selectedWork.status === 'published'
                            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                            : 'bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20 border-[#5D7C59]/20 text-[#5D7C59] dark:text-[#7A9A7B] hover:bg-[#5D7C59]/20 dark:hover:bg-[#5D7C59]/30'
                        }`}
                      >
                        {togglingActivityId === selectedWork.id
                          ? <Loader2 size={12} className="animate-spin" />
                          : selectedWork.status === 'published' ? '⏸ Close' : '▶ Publish'
                        }
                      </button>
                      <button
                        onClick={() => setDeleteConfirmActivity(selectedWork)}
                        className="py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all cursor-pointer"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  )}
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
        </>
      );
    }

    if (activeTab === 'members') {
      return (
        <div className="fixed-right-panel w-[360px] shrink-0 bg-white dark:bg-[#1A211A] rounded-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-white/10 shadow-md p-5 gap-3 transition-colors duration-200 max-md:hidden">
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

    if (activeTab === 'gradebook') {
      return <ClassroomGradebook classroomId={classroom.id} />;
    }

    if (activeTab === 'ai-spark') {
      return <ClassroomIdeaSpark classroomId={classroom.id} />;
    }

    if (activeTab === 'grades') {
      return <MyGrades classroomId={classroom.id} />;
    }

    return null;
  };

  /* ── Left panel ── */
  const renderLeftPanel = () => {
    if (activeTab === 'materials') return (
      <div className="left-panel-wrapper left-list flex-1 overflow-y-auto flex flex-col gap-2 min-w-0 pr-1">
        {materialsLoading ? (
          <div className="flex items-center justify-center py-10 gap-3">
            <Loader2 size={20} className="text-[#5D7C59] dark:text-[#7A9A7B] animate-spin" />
            <span className="text-sm text-gray-400 dark:text-gray-500">Loading materials...</span>
          </div>
        ) : materials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#5D7C59]/8 dark:bg-[#5D7C59]/15 flex items-center justify-center">
              <BookOpen size={24} className="text-[#5D7C59]/50 dark:text-[#7A9A7B]/50" />
            </div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No materials yet</p>
            {isTeacher && <p className="text-xs text-gray-400 dark:text-gray-500">Click + to upload the first one</p>}
          </div>
        ) : materials.map(mat => (
          <div
            key={mat.id}
            onClick={() => {
              setSelectedMaterial(selectedMaterial?.id === mat.id ? null : mat);
              if (mat.fileUrl) setPreviewMaterial(mat);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all group
              ${selectedMaterial?.id === mat.id
                ? 'bg-gradient-to-r from-[#4A6447] to-[#5D7C59] shadow-md shadow-[0_4px_16px_rgba(74,100,71,0.25)]'
                : 'bg-white/50 dark:bg-white/[0.02] backdrop-blur-md border border-gray-100 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/[0.04] hover:border-[#5D7C59]/30 dark:hover:border-[#7A9A7B]/40 hover:shadow-sm dark:hover:shadow-none'
              }`}
            style={{ borderLeft: selectedMaterial?.id === mat.id ? '3px solid #FFC700' : '3px solid transparent' }}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${selectedMaterial?.id === mat.id ? 'bg-white/20' : 'bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20'}`}>
              <FileText size={17} className={selectedMaterial?.id === mat.id ? 'text-white' : 'text-[#5D7C59] dark:text-[#7A9A7B]'} strokeWidth={2} />
            </div>
            <span className={`flex-1 text-[13.5px] font-medium line-clamp-2 break-words leading-snug ${selectedMaterial?.id === mat.id ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>{mat.title}</span>
            <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              {mat.fileUrl && (
                <button
                  onClick={e => { e.stopPropagation(); setPreviewMaterial(mat); }}
                  title="Preview file"
                  className={`p-1.5 rounded-lg border-none cursor-pointer bg-transparent transition-colors ${selectedMaterial?.id === mat.id ? 'text-white/65 hover:bg-white/15' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#5D7C59] dark:hover:text-[#7A9A7B]'}`}
                >
                  <ExternalLink size={14} strokeWidth={2} />
                </button>
              )}
              {isTeacher && (
                <>
                  <button
                    onClick={e => { e.stopPropagation(); setMaterialToUpdate(mat); setShowUpdateMaterialModal(true); }}
                    className={`p-1.5 rounded-lg border-none cursor-pointer bg-transparent transition-colors ${selectedMaterial?.id === mat.id ? 'text-white/65 hover:bg-white/15' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#5D7C59] dark:hover:text-[#7A9A7B]'}`}
                  >
                    <Pencil size={13} strokeWidth={2} />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setDeleteConfirmMaterial(mat); }}
                    disabled={deletingMaterialId === mat.id}
                    className={`p-1.5 rounded-lg border-none cursor-pointer bg-transparent transition-colors ${selectedMaterial?.id === mat.id ? 'text-white/65 hover:bg-white/15' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-red-500 dark:hover:text-red-400'}`}
                  >
                    {deletingMaterialId === mat.id
                      ? <Loader2 size={13} className="animate-spin" />
                      : <Trash2 size={13} strokeWidth={2} />}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    );

    if (activeTab === 'works') return (
      <div className="left-panel-wrapper left-list flex-1 overflow-y-auto flex flex-col gap-2 min-w-0 pr-1">
        {activitiesLoading && activities.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 text-center">Loading activities...</div>
        ) : activities.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 text-center">No activities found.</div>
        ) : activities.map(work => (
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
                <span className={`text-[10.5px] font-medium ${selectedWork?.id === work.id ? 'text-[#FFC700]' : 'text-gray-400 dark:text-gray-500'}`}>
                  {work.deadline ? `Due ${new Date(work.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}` : 'No deadline'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
              {isTeacher ? (
                <>
                  <button
                    onClick={e => { e.stopPropagation(); setDeleteConfirmActivity(work); }}
                    disabled={deletingActivityId === work.id}
                    title="Delete activity"
                    className={`p-1.5 rounded-lg border-none cursor-pointer bg-transparent transition-colors ${
                      selectedWork?.id === work.id
                        ? 'text-white/65 hover:bg-white/15 hover:text-red-300'
                        : 'text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400'
                    }`}
                  >
                    {deletingActivityId === work.id
                      ? <Loader2 size={13} className="animate-spin" />
                      : <Trash2 size={13} strokeWidth={2} />}
                  </button>
                </>
              ) : (
                <button onClick={e => e.stopPropagation()} className={`p-1.5 rounded-lg border-none cursor-pointer bg-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all ${selectedWork?.id === work.id ? 'text-white/65 hover:bg-white/15' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#5D7C59] dark:hover:text-[#7A9A7B]'}`}><ExternalLink size={14} strokeWidth={2.5} /></button>
              )}
            </div>
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
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(93,124,89,0.2); border-radius: 4px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(93,124,89,0.4); }
        @media (max-width: 768px) {
          .split-container { position: relative; padding: 12px !important; }
          .split-container.tab-works, .split-container.tab-members { flex-direction: column !important; overflow-y: auto !important; }
          .split-container.tab-works .left-panel-wrapper, .split-container.tab-members .left-panel-wrapper { height: auto !important; flex: 1 !important; }
          .split-container.tab-members .fixed-right-panel { width: 100% !important; max-width: 100% !important; height: auto !important; flex: none !important; }
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
                  onClick={() => navigate(`/dashboard/classroom/${code}/studio`)}
                  className="flex items-center justify-center gap-2 w-10 h-10 sm:w-auto sm:px-3.5 sm:py-2.5 bg-[#FFC700] hover:bg-[#FFC700]/90 text-gray-900 border-none rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer shrink-0"
                >
                  <Sparkles size={16} strokeWidth={2.5} />
                  <span className="hidden sm:inline">Likhâ AI Studio</span>
                </button>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center justify-center gap-2 w-10 h-10 sm:w-auto sm:px-3.5 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/25 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer shrink-0"
                >
                  <Share2 size={16} strokeWidth={2.5} />
                  <span className="hidden sm:inline">Share</span>
                </button>
                {isTeacher && (
                  <button
                    onClick={() => setShowCreateChoiceModal(true)}
                    className="flex items-center justify-center gap-2 w-10 h-10 sm:w-auto sm:px-4 sm:py-2.5 bg-[#FFC700] hover:bg-[#FFD633] text-gray-900 font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all border-none cursor-pointer shrink-0"
                  >
                    <Plus size={16} strokeWidth={3} />
                    <span className="hidden sm:inline">Create</span>
                  </button>
                )}
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
          <div className="flex px-5 pt-1 border-b border-gray-100 dark:border-white/10 shrink-0 gap-1 overflow-x-auto whitespace-nowrap scrollbar-hide transition-colors duration-200">
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

        <AnimatePresence>
          {showInviteModal && (
            <InviteClassroomModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} classroom={classroom} />
          )}
          {showDetailsModal && (
            <ClassroomDetailsModal
              isOpen={showDetailsModal}
              onClose={() => setShowDetailsModal(false)}
              classroom={classroom}
              onUpdateClick={() => { setShowDetailsModal(false); setShowUpdateModal(true); }}
            />
          )}
          {showUpdateModal && (
            <UpdateClassroomModal
              isOpen={showUpdateModal}
              onClose={() => setShowUpdateModal(false)}
              classroom={classroom}
              onSuccess={setClassroom}
            />
          )}
          {showCreateChoiceModal && (
            <CreateChoiceModal
              isOpen={showCreateChoiceModal}
              onClose={() => setShowCreateChoiceModal(false)}
              onSelectActivity={() => { setShowCreateChoiceModal(false); setShowCreateActivityModal(true); }}
              onSelectMaterial={() => { setShowCreateChoiceModal(false); setShowCreateMaterialModal(true); }}
            />
          )}
          {showCreateMaterialModal && (
            <CreateLearningMaterialModal
              isOpen={showCreateMaterialModal}
              onClose={() => setShowCreateMaterialModal(false)}
              classroom={classroom}
              onSuccess={() => {
                setShowCreateMaterialModal(false);
                fetchMaterials(classroom.id);
              }}
            />
          )}
          {showUpdateMaterialModal && materialToUpdate && (
            <UpdateLearningMaterialModal
              isOpen={showUpdateMaterialModal}
              onClose={() => { setShowUpdateMaterialModal(false); setMaterialToUpdate(null); }}
              classroom={classroom}
              material={materialToUpdate}
              onSuccess={(updated) => {
                setMaterials(prev => prev.map(m => m.id === updated.id ? updated : m));
                if (selectedMaterial?.id === updated.id) setSelectedMaterial(updated);
              }}
            />
          )}
        </AnimatePresence>

        {/* Delete Confirmation Dialog */}
        {deleteConfirmMaterial && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
            <div className="bg-white dark:bg-[#1A211A] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 p-6 max-w-sm w-full flex flex-col gap-4" style={{ animation: 'fadeSlideIn 0.2s ease-out' }}>
              <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/15 flex items-center justify-center mx-auto">
                <AlertTriangle size={28} className="text-red-500" />
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Delete Material?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">"{deleteConfirmMaterial.title}"</span> will be permanently deleted from S3 storage and cannot be recovered.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmMaterial(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-semibold bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteMaterial(deleteConfirmMaterial)}
                  disabled={deletingMaterialId === deleteConfirmMaterial.id}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold cursor-pointer transition-colors flex items-center justify-center gap-2 border-none"
                >
                  {deletingMaterialId === deleteConfirmMaterial.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Activity Delete Confirmation Dialog */}
        {deleteConfirmActivity && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
            <div className="bg-white dark:bg-[#1A211A] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 p-6 max-w-sm w-full flex flex-col gap-4" style={{ animation: 'fadeSlideIn 0.2s ease-out' }}>
              <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/15 flex items-center justify-center mx-auto">
                <AlertTriangle size={28} className="text-red-500" />
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Delete Activity?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">"{deleteConfirmActivity.title}"</span> and all its submissions will be permanently deleted and cannot be recovered.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmActivity(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-semibold bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteActivity(deleteConfirmActivity)}
                  disabled={deletingActivityId === deleteConfirmActivity.id}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold cursor-pointer transition-colors flex items-center justify-center gap-2 border-none"
                >
                  {deletingActivityId === deleteConfirmActivity.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <CreateActivityModal
          isOpen={showCreateActivityModal}
          classroomId={classroom?.id}
          onClose={() => setShowCreateActivityModal(false)}
          onSuccess={() => {
            setShowCreateActivityModal(false);
            setActiveTab('works');
            if (classroom?.id) fetchActivities(classroom.id);
          }}
        />

        {/* Material Preview */}
        <MaterialPreviewModal
          isOpen={!!previewMaterial}
          onClose={() => setPreviewMaterial(null)}
          material={previewMaterial}
        />
      </div>
    </>
  );
};

export default ClassroomDetail;
