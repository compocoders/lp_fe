import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, FileText, ExternalLink, MoreVertical, ArrowUp, Bot, Sparkles, PenLine, Users, ChevronRight, Clock, Play, Brain, ScrollText, Layers, PanelRightClose, PanelRightOpen, MessageCircle, ChevronDown, BookOpen, Cpu, X, Settings, Lock, Unlock, Hash, Calendar, User, ClipboardList, UploadCloud, Circle, CheckSquare, Trash2, Share2, Copy, Check, Loader2 } from 'lucide-react';
import { getClassroomByCode, generateInviteLink } from '../../api/classroom.api';

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

const MOCK_MEMBERS = [
  { id: 1, name: 'Kent Clarence', role: 'OWNER', initials: 'KC', color: '#517559' },
  { id: 2, name: 'Maria Santos', role: 'STUDENT', initials: 'MS', color: '#6d8b74' },
  { id: 3, name: 'Juan Dela Cruz', role: 'STUDENT', initials: 'JD', color: '#7a9e7e' },
  { id: 4, name: 'Ana Reyes', role: 'STUDENT', initials: 'AR', color: '#8aab8e' },
  { id: 5, name: 'Carlo Mendoza', role: 'STUDENT', initials: 'CM', color: '#517559' },
  { id: 6, name: 'Sofia Garcia', role: 'STUDENT', initials: 'SG', color: '#6d8b74' },
  { id: 7, name: 'Miguel Torres', role: 'STUDENT', initials: 'MT', color: '#7a9e7e' },
  { id: 8, name: 'Liza Flores', role: 'STUDENT', initials: 'LF', color: '#8aab8e' },
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

/* ─── Typing dots ─── */
const TypingDots = () => (
  <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '2px 0' }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
    ))}
  </div>
);

/* ─── Chat bubble ─── */
const ChatBubble = ({ msg }) => {
  const isAI = msg.sender === 'ai';
  return (
    <div style={{ display: 'flex', justifyContent: isAI ? 'flex-start' : 'flex-end', animation: 'fadeSlideIn 0.3s ease-out' }}>
      {isAI && (
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#2d4433', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: 7, alignSelf: 'flex-end' }}>
          <Bot size={13} color="rgba(255,255,255,0.85)" />
        </div>
      )}
      <div style={{
        maxWidth: '80%', background: isAI ? '#2d4433' : '#fff',
        color: isAI ? '#e8f0ea' : '#2d3a2e',
        borderRadius: isAI ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
        padding: '10px 14px', fontSize: 12.5, lineHeight: 1.55,
        whiteSpace: 'pre-line', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', wordBreak: 'break-word',
      }}>
        {msg.typing ? <TypingDots /> : msg.text}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════ */
const ClassroomDetail = () => {
  const { code } = useParams();
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

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = () => { setShowModelPicker(false); setShowMaterialPicker(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Auto-resize textarea
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
      
      const payload = {
        name: updateData.name,
        description: updateData.description,
        private: updateData.private,
      };
      
      if (updateData.private && updateData.roomPassword) {
        payload.roomPassword = updateData.roomPassword;
        if (classroom.private) {
          payload.oldPassword = updateData.oldPassword;
        }
      }
      
      // Import updateClassroom from api (need to make sure it's imported)
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
        const link = `${window.location.origin}/join/${token}`;
        setInviteLink(link);
    } catch (err) {
        console.error("Error generating link", err);
    } finally {
        setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = () => {
    if(!inviteLink) return;
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
    setTimeout(() => {
      setStudioOutput(STUDIO_OUTPUTS[type]);
      setStudioLoading(false);
    }, 1500);
  };

  if (isLoading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 38, height: 38, border: '3px solid #d6e0d3', borderTopColor: '#517559', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ color: '#517559', fontWeight: 600, fontSize: 14 }}>Loading Classroom...</span>
      </div>
    </div>
  );

  if (!classroom) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <span style={{ color: '#517559' }}>Classroom not found.</span>
    </div>
  );

  /* ── right panel switcher ── */
  const renderRightPanel = () => {
    if (activeTab === 'materials') {
      return (
        <div className="chat-panel-container" style={{ display: 'flex', gap: 0, flexShrink: 0, alignItems: 'stretch', position: 'relative' }}>

          {/* ── Chat panel ── */}
          <div className={`right-panel-wrapper ${chatOpen ? 'chat-open' : 'chat-closed'}`} style={{
            width: chatOpen ? 380 : 0,
            flexShrink: 0,
            overflow: 'hidden',
            transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1), height 0.4s cubic-bezier(0.4,0,0.2,1)',
          }}>
            <div className="right-panel-inner" style={{ width: 380, background: '#517559', borderRadius: 18, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 18px rgba(0,0,0,0.15)', height: '100%', position: 'relative' }}>

          {/* ── TABS ── */}
          <div style={{ display: 'flex', background: '#517559', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
            {[['chatbox', 'Chat box'], ['studio', 'Learning Studio']].map(([key, label]) => (
              <button key={key} onClick={() => setActiveChat(key)} style={{
                flex: 1, background: 'none', border: 'none', cursor: 'pointer',
                padding: '13px 0', fontSize: 12.5, fontWeight: 600,
                color: activeChat === key ? '#fff' : 'rgba(255,255,255,0.5)',
                borderBottom: activeChat === key ? '2.5px solid #fff' : '2.5px solid transparent',
                transition: 'all 0.18s', letterSpacing: '0.2px',
              }}>{label}</button>
            ))}
          </div>

          {/* ══ CHAT BOX ══ */}
          {activeChat === 'chatbox' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#517559' }}>

              {/* Context bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 14px', background: 'rgba(0,0,0,0.12)', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: selectedMaterial !== null ? '#d6e0d3' : 'rgba(255,255,255,0.25)', flexShrink: 0, boxShadow: selectedMaterial !== null ? '0 0 6px rgba(214,224,211,0.8)' : 'none', transition: 'all 0.3s' }} />
                  <span style={{ fontSize: 10.5, color: selectedMaterial !== null ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.2px', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedMaterial !== null ? MOCK_MATERIALS[selectedMaterial] : 'No material selected'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Sparkles size={10} color="rgba(255,255,255,0.7)" />
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Likhâ AI</span>
                  <button className="mobile-chat-close-btn" onClick={() => setChatOpen(false)} style={{ background: 'rgba(255, 255, 255, 0.25)', border: '1px solid rgba(255, 255, 255, 0.4)', borderRadius: '50%', color: '#fff', cursor: 'pointer', padding: 6, marginLeft: 12, alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                    <X size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Messages area */}
              <div className="messages-area" style={{ flex: 1, overflowY: 'auto', padding: '18px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Welcome state */}
                {messages.length === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10, gap: 12, animation: 'fadeSlideIn 0.4s ease-out' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bot size={24} color="#fff" />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ margin: '0 0 5px', fontSize: 14, fontWeight: 700, color: '#fff' }}>Likhâ AI Assistant</p>
                      <p style={{ margin: 0, fontSize: 11.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 }}>
                        Select a material and ask me anything.<br />I'll help you learn and understand it.
                      </p>
                    </div>
                    {/* Quick prompts */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 2 }}>
                      {['Summarize this', 'Key concepts?', 'Give me a quiz', 'Explain simply'].map(s => (
                        <button key={s} onClick={() => setInputValue(s)}
                          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '5px 12px', fontSize: 11, color: 'rgba(255,255,255,0.85)', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message bubbles */}
                {messages.map((msg, idx) => {
                  const isAI = msg.sender === 'ai';
                  return (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isAI ? 'flex-start' : 'flex-end', gap: 3, animation: idx === messages.length - 1 ? 'fadeSlideIn 0.3s ease-out' : 'none' }}>
                      {/* AI label row */}
                      {isAI && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
                          <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Bot size={11} color="#fff" />
                          </div>
                          <span style={{ fontSize: 10.5, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Likhâ AI</span>
                        </div>
                      )}

                      {/* Bubble */}
                      <div style={{
                        maxWidth: '85%',
                        background: isAI ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.95)',
                        color: isAI ? '#fff' : '#2d3a2e',
                        borderRadius: isAI ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                        padding: msg.typing ? '12px 16px' : '10px 14px',
                        fontSize: 13, lineHeight: 1.6,
                        whiteSpace: 'pre-line',
                        border: isAI ? '1px solid rgba(255,255,255,0.15)' : 'none',
                        boxShadow: isAI ? '0 2px 10px rgba(0,0,0,0.08)' : '0 2px 10px rgba(0,0,0,0.1)',
                        wordBreak: 'break-word',
                      }}>
                        {msg.typing ? (
                          <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '2px 0' }}>
                            {[0,1,2].map(i => (
                              <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', animation: `typingBounce 1.2s ease-in-out ${i*0.2}s infinite` }} />
                            ))}
                          </div>
                        ) : msg.text}
                      </div>

                      {/* "You" label */}
                      {!msg.typing && !isAI && (
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', paddingRight: 4 }}>You</span>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* ── Input area ── */}
              <div style={{ flexShrink: 0, padding: '10px 12px 12px', background: 'rgba(0,0,0,0.14)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>

                {/* Selected material chip */}
                {selectedMaterial !== null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 20, padding: '4px 10px 4px 8px' }}>
                      <BookOpen size={11} color="rgba(255,255,255,0.8)" />
                      <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.85)', fontWeight: 500, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{MOCK_MATERIALS[selectedMaterial]}</span>
                      <button onClick={() => setSelectedMaterial(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', display: 'flex', padding: 0, marginLeft: 2 }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                      >✕</button>
                    </div>
                  </div>
                )}

                {/* Text input box */}
                <div
                  style={{ display: 'flex', alignItems: 'flex-end', gap: 8, background: '#fff', borderRadius: 14, padding: '10px 10px 10px 14px', border: '2px solid transparent', transition: 'border-color 0.2s', boxShadow: '0 2px 10px rgba(0,0,0,0.12)' }}
                  onFocusCapture={e => e.currentTarget.style.borderColor = '#89a88c'}
                  onBlurCapture={e => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={isAiTyping ? '✦ Likhâ AI is thinking...' : 'Ask anything about the material...'}
                    rows={1}
                    disabled={isAiTyping}
                    style={{
                      flex: 1, border: 'none', background: 'none', resize: 'none',
                      fontSize: 13, color: '#2d3a2e', lineHeight: 1.5,
                      outline: 'none', fontFamily: 'inherit',
                      maxHeight: 100, overflowY: 'auto',
                      caretColor: '#517559',
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isAiTyping}
                    style={{
                      width: 34, height: 34, borderRadius: 10, border: 'none', flexShrink: 0,
                      background: inputValue.trim() && !isAiTyping ? '#517559' : '#e8f0ea',
                      cursor: inputValue.trim() && !isAiTyping ? 'pointer' : 'default',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { if (inputValue.trim() && !isAiTyping) { e.currentTarget.style.background = '#3d5e43'; e.currentTarget.style.transform = 'scale(1.06)'; } }}
                    onMouseLeave={e => { e.currentTarget.style.background = inputValue.trim() && !isAiTyping ? '#517559' : '#e8f0ea'; e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    <ArrowUp size={16} color={inputValue.trim() && !isAiTyping ? '#fff' : '#b0c4b4'} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Toolbar: Material picker + Model picker */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, position: 'relative' }}>

                  {/* Material picker button */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={e => { e.stopPropagation(); setShowMaterialPicker(p => !p); setShowModelPicker(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 10px', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                    >
                      <BookOpen size={11} color="rgba(255,255,255,0.8)" />
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Material</span>
                      <ChevronDown size={10} color="rgba(255,255,255,0.6)" style={{ transform: showMaterialPicker ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                    </button>

                    {/* Material dropdown */}
                    {showMaterialPicker && (
                      <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', bottom: '110%', left: 0, width: 230, background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', overflow: 'hidden', zIndex: 100, border: '1px solid rgba(81,117,89,0.15)', animation: 'fadeSlideIn 0.18s ease-out' }}>
                        <div style={{ padding: '10px 12px 6px', borderBottom: '1px solid rgba(81,117,89,0.1)' }}>
                          <p style={{ margin: 0, fontSize: 10.5, fontWeight: 700, color: '#89a88c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Select Material</p>
                        </div>
                        <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                          {MOCK_MATERIALS.filter((m, i, arr) => arr.indexOf(m) === i).map((mat, i) => (
                            <button key={i} onClick={() => { setSelectedMaterial(i); setShowMaterialPicker(false); }}
                              style={{ width: '100%', textAlign: 'left', background: selectedMaterial === i ? '#f0f5f1' : 'none', border: 'none', padding: '9px 14px', fontSize: 12.5, color: selectedMaterial === i ? '#517559' : '#2d3a2e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit', transition: 'background 0.12s', fontWeight: selectedMaterial === i ? 600 : 400 }}
                              onMouseEnter={e => { if (selectedMaterial !== i) e.currentTarget.style.background = '#f8faf8'; }}
                              onMouseLeave={e => { if (selectedMaterial !== i) e.currentTarget.style.background = 'none'; }}
                            >
                              <FileText size={13} color={selectedMaterial === i ? '#517559' : '#89a88c'} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mat}</span>
                              {selectedMaterial === i && <span style={{ marginLeft: 'auto', fontSize: 12, color: '#517559' }}>✓</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Center hint */}
                  <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2px' }}>Enter · Shift+Enter</span>

                  {/* Model picker button */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={e => { e.stopPropagation(); setShowModelPicker(p => !p); setShowMaterialPicker(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 10px', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                    >
                      <Cpu size={11} color="rgba(255,255,255,0.8)" />
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{selectedModel}</span>
                      <ChevronDown size={10} color="rgba(255,255,255,0.6)" style={{ transform: showModelPicker ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                    </button>

                    {/* Model dropdown */}
                    {showModelPicker && (
                      <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', bottom: '110%', right: 0, width: 175, background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', overflow: 'hidden', zIndex: 100, border: '1px solid rgba(81,117,89,0.15)', animation: 'fadeSlideIn 0.18s ease-out' }}>
                        <div style={{ padding: '10px 12px 6px', borderBottom: '1px solid rgba(81,117,89,0.1)' }}>
                          <p style={{ margin: 0, fontSize: 10.5, fontWeight: 700, color: '#89a88c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Model</p>
                        </div>
                        {AI_MODELS.map(model => (
                          <button key={model} onClick={() => { setSelectedModel(model); setShowModelPicker(false); }}
                            style={{ width: '100%', textAlign: 'left', background: selectedModel === model ? '#f0f5f1' : 'none', border: 'none', padding: '9px 14px', fontSize: 12.5, color: selectedModel === model ? '#517559' : '#2d3a2e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit', transition: 'background 0.12s', fontWeight: selectedModel === model ? 600 : 400 }}
                            onMouseEnter={e => { if (selectedModel !== model) e.currentTarget.style.background = '#f8faf8'; }}
                            onMouseLeave={e => { if (selectedModel !== model) e.currentTarget.style.background = 'none'; }}
                          >
                            <Sparkles size={12} color={selectedModel === model ? '#517559' : '#89a88c'} />
                            {model}
                            {selectedModel === model && <span style={{ marginLeft: 'auto', fontSize: 12, color: '#517559' }}>✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ══ LEARNING STUDIO ══ */}
          {activeChat === 'studio' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#517559' }}>
              <div style={{ padding: '12px 14px 8px', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                <p style={{ margin: 0, fontSize: 10.5, color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>AI Generation Tools</p>
              </div>

              {/* Tool buttons */}
              <div style={{ padding: '10px 12px 0', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                {[
                  { key: 'quiz', label: 'Create reviewer quiz', desc: 'Generate Q&A from material', icon: Brain },
                  { key: 'summary', label: 'Create a summary', desc: 'Condense key points', icon: ScrollText },
                  { key: 'overview', label: 'Create an overview', desc: 'High-level topic outline', icon: Layers },
                ].map(({ key, label, desc, icon: Icon }) => (
                  <button key={key} onClick={() => handleStudio(key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      background: studioAction === key ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                      border: studioAction === key ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 12, padding: '10px 14px', cursor: 'pointer', transition: 'all 0.18s', textAlign: 'left', fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => { if (studioAction !== key) e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; }}
                    onMouseLeave={e => { if (studioAction !== key) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                  >
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: studioAction === key ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} color="#fff" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)' }}>{desc}</div>
                    </div>
                    <ChevronRight size={14} color={studioAction === key ? '#fff' : 'rgba(255,255,255,0.4)'} />
                  </button>
                ))}
              </div>

              {/* Output */}
              <div className="messages-area" style={{ flex: 1, overflowY: 'auto', padding: '10px 12px 12px', marginTop: 4 }}>
                {studioLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, height: '100%', paddingBottom: 20 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 1.5s ease-in-out infinite' }}>
                      <Sparkles size={18} color="#fff" />
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Generating with AI...</p>
                  </div>
                ) : studioOutput ? (
                  <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, overflow: 'hidden', animation: 'fadeSlideIn 0.4s ease-out' }}>
                    <div style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Sparkles size={12} color="#fff" />
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: '#fff' }}>
                        {studioAction === 'quiz' ? 'Reviewer Quiz' : studioAction === 'summary' ? 'Summary' : 'Overview'}
                      </span>
                    </div>
                    <pre style={{ margin: 0, padding: '14px', fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 1.65, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                      {studioOutput}
                    </pre>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8, paddingBottom: 20 }}>
                    <Sparkles size={22} color="rgba(255,255,255,0.2)" />
                    <p style={{ margin: 0, fontSize: 11.5, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>Select a tool above to generate AI content</p>
                  </div>
                )}\n              </div>
            </div>
          )}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'works') {
      return (
        <div className="fixed-right-panel" style={{ width: 380, flexShrink: 0, background: '#f8faf8', borderRadius: 18, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid rgba(81,117,89,0.15)', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
          {selectedWork ? (
            <>
              {/* Thumbnail Banner */}
              <div style={{ height: 160, background: '#b8c9bb', flexShrink: 0, borderRadius: '18px 18px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                {/* Decorative background shapes */}
                <div style={{ position: 'absolute', top: -30, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ position: 'absolute', bottom: -40, left: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(0,0,0,0.05)' }} />
                
                {/* Points Pill */}
                <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.9)', color: '#3d5e43', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                  100 Points
                </div>

                <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', animation: 'fadeSlideIn 0.5s cubic-bezier(0.4,0,0.2,1)' }}>
                  <PenLine size={28} color="#fff" strokeWidth={2.5} />
                </div>
              </div>

              {/* Details Body */}
              <div style={{ flex: 1, padding: '22px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                  <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: '#2d3a2e', letterSpacing: '-0.3px', lineHeight: 1.3 }}>{selectedWork.title}</h3>
                  <div style={{ background: '#e3ebd8', color: '#517559', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 8, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Active
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: 13, color: '#6b7c6e', lineHeight: 1.6 }}>{selectedWork.description}</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                  {['Programming', 'Logic'].map(tag => (
                    <span key={tag} style={{ fontSize: 10.5, color: '#517559', background: 'rgba(81,117,89,0.1)', padding: '4px 10px', borderRadius: 12, fontWeight: 600 }}>{tag}</span>
                  ))}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(81,117,89,0.12)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6b7c6e', fontSize: 12.5, marginBottom: 16, background: '#fff', padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(81,117,89,0.1)' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#e3ebd8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock size={14} color="#517559" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 10.5, color: '#89a88c', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Due Date</span>
                      <strong style={{ color: '#2d3a2e', fontSize: 13 }}>{selectedWork.deadline}</strong>
                    </div>
                  </div>

                  <button style={{
                    width: '100%', padding: '14px 0', borderRadius: 14, border: 'none',
                    background: '#517559', color: '#fff', fontWeight: 700, fontSize: 15,
                    cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                    boxShadow: '0 4px 14px rgba(81,117,89,0.3)',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#3d5e43'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(61,94,67,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#517559'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(81,117,89,0.3)'; }}
                    onMouseDown={e => { e.currentTarget.style.transform = 'translateY(1px)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(81,117,89,0.3)'; }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <Play size={16} fill="#fff" /> Start Activity
                    </span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', justifyContent: 'center', color: '#9aaf9c' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(81,117,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PenLine size={28} color="#89a88c" />
              </div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Select an activity to view details</div>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'members') {
      return (
        <div className="fixed-right-panel" style={{ width: 380, flexShrink: 0, background: '#f8faf8', borderRadius: 18, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', border: '1px solid rgba(81,117,89,0.15)', padding: '20px 16px', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexShrink: 0, padding: '0 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(81,117,89,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={16} color="#517559" />
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: '#2d3a2e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                People
              </span>
            </div>
            <div style={{ background: '#e3ebd8', color: '#517559', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
              {(classroom?.classroomUsers || []).length} Total
            </div>
          </div>
          
          <div className="messages-area" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(classroom?.classroomUsers || []).map(member => (
          <div key={member.userId} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: '#fff', border: '1px solid rgba(81,117,89,0.1)', borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(81,117,89,0.12)'; e.currentTarget.style.borderColor = 'rgba(81,117,89,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor = 'rgba(81,117,89,0.1)'; }}
              >
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#517559', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 10px rgba(81,117,89,0.2)' }}>
                    {member.User?.profile?.firstName?.charAt(0)}{member.User?.profile?.lastName?.charAt(0)}
                  </div>
                  {/* Online dot */}
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: '#7ed987', border: '2px solid #fff' }} />
                </div>

                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#2d3a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.User?.profile?.firstName} {member.User?.profile?.lastName}</div>
                  <div style={{ fontSize: 11.5, color: '#6b7c6e', fontWeight: 500 }}>{member.role === 'OWNER' ? 'Teacher' : 'Student'}</div>
                </div>

                {member.role === 'OWNER' && (
                  <span style={{ fontSize: 10, fontWeight: 700, background: '#e3ebd8', color: '#517559', padding: '4px 10px', borderRadius: 12, flexShrink: 0 }}>Owner</span>
                )}
                
                <button onClick={e => e.stopPropagation()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#89a88c', display: 'flex', padding: '6px', borderRadius: 8, transition: 'all 0.15s', marginLeft: member.role !== 'OWNER' ? 'auto' : 4 }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(81,117,89,0.1)'; e.currentTarget.style.color = '#517559'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#89a88c'; }}
                >
                  <MessageCircle size={18} strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  /* ── left panel ── */
  const renderLeftPanel = () => {
    if (activeTab === 'materials') return (
      <div className="left-panel-wrapper left-list" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0, paddingRight: 4 }}>
        {MOCK_MATERIALS.map((title, i) => (
          <div key={i} onClick={() => setSelectedMaterial(i === selectedMaterial ? null : i)}
            style={{ background: selectedMaterial === i ? '#3d5e43' : '#517559', borderRadius: 14, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer', transition: 'background 0.18s, transform 0.15s', borderLeft: selectedMaterial === i ? '3px solid #a8d5b0' : '3px solid transparent' }}
            onMouseEnter={e => { if (selectedMaterial !== i) e.currentTarget.style.background = '#3d5e43'; e.currentTarget.style.transform = 'translateX(3px)'; }}
            onMouseLeave={e => { if (selectedMaterial !== i) e.currentTarget.style.background = '#517559'; e.currentTarget.style.transform = 'translateX(0)'; }}
          >
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ flex: 1, color: '#fff', fontWeight: 500, fontSize: 13.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
            <button onClick={e => e.stopPropagation()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.65)', display: 'flex', padding: '4px 6px', borderRadius: 8, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            ><ExternalLink size={16} strokeWidth={2} /></button>
            <button onClick={e => e.stopPropagation()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.65)', display: 'flex', padding: '4px 6px', borderRadius: 8, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            ><MoreVertical size={16} strokeWidth={2.5} /></button>
          </div>
        ))}
      </div>
    );

    if (activeTab === 'works') return (
      <div className="left-panel-wrapper left-list" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0, paddingRight: 4 }}>
        {MOCK_CLASSWORKS.map(work => (
          <div key={work.id} onClick={() => setSelectedWork(work)}
            style={{
              background: selectedWork?.id === work.id ? '#3d5e43' : '#517559',
              borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 14,
              cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
              borderLeft: selectedWork?.id === work.id ? '4px solid #a8d5b0' : '4px solid transparent',
              boxShadow: selectedWork?.id === work.id ? '0 4px 12px rgba(61,94,67,0.3)' : '0 2px 5px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={e => {
              if (selectedWork?.id !== work.id) {
                e.currentTarget.style.background = '#48684f';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={e => {
              if (selectedWork?.id !== work.id) {
                e.currentTarget.style.background = '#517559';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
              }
            }}
          >
            <div style={{ width: 42, height: 42, borderRadius: '12px', background: selectedWork?.id === work.id ? 'rgba(168,213,176,0.2)' : 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>
              <PenLine size={18} color={selectedWork?.id === work.id ? '#a8d5b0' : '#fff'} strokeWidth={2.5} />
            </div>
            
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: 13.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '0.2px' }}>{work.title}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={10} color={selectedWork?.id === work.id ? '#a8d5b0' : 'rgba(255,255,255,0.6)'} />
                <span style={{ color: selectedWork?.id === work.id ? '#a8d5b0' : 'rgba(255,255,255,0.6)', fontSize: 10.5, fontWeight: 500 }}>Due {work.deadline}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button onClick={e => e.stopPropagation()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.65)', display: 'flex', padding: '6px', borderRadius: 8, transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
              ><ExternalLink size={16} strokeWidth={2.5} /></button>
            </div>
          </div>
        ))}
      </div>
    );

    if (activeTab === 'members') return (
      <div className="left-panel-wrapper left-list" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0, paddingRight: 4 }}>
        {(classroom?.classroomUsers || []).map(member => (
          <div key={member.userId} style={{ background: '#517559', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#48684f'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#517559'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)'; }}
          >
            <div style={{ position: 'relative' }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', fontWeight: 700, fontSize: 14 }}>
                {member.User?.profile?.firstName?.charAt(0)}{member.User?.profile?.lastName?.charAt(0)}
              </div>
              <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#a8d5b0', border: '2px solid #517559', transition: 'border-color 0.2s' }} className="status-dot" />
            </div>
            
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 13.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '0.2px' }}>{member.User?.profile?.firstName} {member.User?.profile?.lastName}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, fontWeight: 500 }}>{member.role === 'OWNER' ? 'Teacher · Owner' : 'Student'}</div>
            </div>
            
            {member.role === 'OWNER' && (
              <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(255,255,255,0.15)', color: '#a8d5b0', padding: '4px 10px', borderRadius: 12 }}>Teacher</span>
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
        @keyframes spin { to { transform:rotate(360deg); } }
        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
        .left-list::-webkit-scrollbar { width: 5px; }
        .left-list::-webkit-scrollbar-thumb { background: rgba(81,117,89,0.25); border-radius: 4px; }
        @keyframes pulse { 0%,100%{box-shadow:0 0 12px rgba(81,117,89,0.3);}50%{box-shadow:0 0 28px rgba(126,217,135,0.5);} }
        textarea::placeholder { color: #9ca3af; }

        .mobile-chat-fab {
          display: flex;
          position: absolute;
          bottom: 24px;
          right: 24px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #46674e;
          border: 3px solid #fff;
          box-shadow: 0 6px 24px rgba(0,0,0,0.4);
          align-items: center;
          justify-content: center;
          z-index: 100;
          cursor: pointer;
          animation: fadeSlideIn 0.3s ease-out;
        }

        @media (max-width: 768px) {
          .split-container {
             position: relative;
             padding: 12px !important;
          }
          /* For works and members, stack them */
          .split-container.tab-works, .split-container.tab-members {
            flex-direction: column !important;
            overflow-y: auto !important;
          }
          .split-container.tab-works .left-panel-wrapper,
          .split-container.tab-members .left-panel-wrapper {
            height: 350px !important;
            flex: none !important;
          }
          .split-container.tab-works .fixed-right-panel,
          .split-container.tab-members .fixed-right-panel {
            width: 100% !important;
            max-width: 100% !important;
            height: 500px !important;
            flex: none !important;
          }
          
          /* For materials, use overlay */
          .split-container.tab-materials {
            flex-direction: row !important;
            overflow: hidden !important;
          }
          .split-container.tab-materials .left-panel-wrapper {
            width: 100% !important;
            flex: 1 !important;
            height: 100% !important;
          }
          .split-container.tab-materials .chat-panel-container {
            position: absolute !important;
            right: 12px;
            top: 12px;
            bottom: 12px;
            z-index: 50;
            width: auto !important;
          }
          .split-container.tab-materials .right-panel-wrapper.chat-open {
            width: calc(100vw - 64px) !important; 
            max-width: 400px !important;
            height: 100% !important;
            box-shadow: -4px 0 24px rgba(0,0,0,0.2) !important;
          }
          .split-container.tab-materials .right-panel-wrapper.chat-closed {
            width: 0 !important;
            height: 100% !important;
          }
          .right-panel-inner {
            width: 100% !important;
          }
        }
      `}</style>

      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#fff', padding: 24, boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, flexShrink: 0 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#517559', letterSpacing: '-0.4px' }}>{classroom.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={handleShareClick} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8aab8e', display: 'flex', padding: 6, borderRadius: 8, transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#517559'}
              onMouseLeave={e => e.currentTarget.style.color = '#8aab8e'}
            ><Share2 size={26} strokeWidth={2.5} /></button>
            <button onClick={() => setShowCreateChoiceModal(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8aab8e', display: 'flex', padding: 6, borderRadius: 8, transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#517559'}
              onMouseLeave={e => e.currentTarget.style.color = '#8aab8e'}
            ><Plus size={26} strokeWidth={2.5} /></button>
            <div onClick={() => setShowDetailsModal(true)} style={{ width: 38, height: 38, borderRadius: '50%', background: '#89a88c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', overflow: 'hidden', border: '2px solid #d6e0d3', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#517559'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#d6e0d3'}
            >
              {classroom.User?.profile?.profilePicture
                ? <img src={classroom.User.profile.profilePicture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : classroom.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* MAIN CARD */}
        <div style={{ flex: 1, background: '#d6e0d3', borderRadius: 22, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', padding: '14px 22px 0', borderBottom: '1px solid rgba(81,117,89,0.15)', flexShrink: 0 }}>
            {[['materials', 'Learning Materials'], ['works', 'Class Works'], ['members', 'Members']].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 12px', marginRight: 36,
                fontSize: 13.5, fontWeight: 600,
                color: activeTab === key ? '#517559' : 'rgba(81,117,89,0.55)',
                borderBottom: activeTab === key ? '2.5px solid #517559' : '2.5px solid transparent',
                transition: 'color 0.15s, border-color 0.15s',
              }}>{label}</button>
            ))}
          </div>

          {/* SPLIT */}
          <div className={`split-container tab-${activeTab}`} style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: 16, gap: 16, minHeight: 0, position: 'relative' }}>
            {renderLeftPanel()}
            {renderRightPanel()}
            {activeTab === 'materials' && !chatOpen && (
              <button className="mobile-chat-fab" onClick={() => setChatOpen(true)}>
                <MessageCircle size={24} color="#fff" />
              </button>
            )}
          </div>
        </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeSlideIn 0.2s ease-out', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 440, background: '#fff', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid rgba(81,117,89,0.1)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#2d3a2e', letterSpacing: '-0.3px' }}>Share Classroom</h2>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7c6e' }}>Invite students to join your classroom.</p>
              </div>
              <button onClick={() => setShowInviteModal(false)} style={{ background: '#f0f5f1', border: 'none', cursor: 'pointer', padding: 8, borderRadius: '50%', color: '#517559', display: 'flex', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e3ebd8'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f0f5f1'; }}
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {isGeneratingLink ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 0', gap: 12 }}>
                  <Loader2 size={28} className="animate-spin text-[#517559]" />
                  <span style={{ fontSize: 14, color: '#6b7c6e', fontWeight: 500 }}>Generating invite link...</span>
                </div>
              ) : inviteLink ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#517559', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Invite Link</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="text" readOnly value={inviteLink} style={{ flex: 1, padding: '12px 14px', borderRadius: 10, border: '2px solid rgba(81,117,89,0.2)', color: '#2d3a2e', fontSize: 14, outline: 'none', background: '#f8faf8' }} />
                    <button onClick={handleCopyLink} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, background: copied ? '#a8d5b0' : '#517559', color: copied ? '#2d3a2e' : '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}>
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: '#89a88c', textAlign: 'center', marginTop: 8 }}>
                    Anyone with this link {classroom.private ? 'and the classroom password ' : ''}can join.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 0', gap: 12 }}>
                  <span style={{ fontSize: 14, color: '#e74c3c', fontWeight: 500 }}>Only the owner can generate an invite link.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && classroom && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeSlideIn 0.2s ease-out', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 480, background: '#fff', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid rgba(81,117,89,0.1)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#2d3a2e', letterSpacing: '-0.3px' }}>Classroom Details</h2>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7c6e' }}>View information about this learning space.</p>
              </div>
              <button onClick={() => setShowDetailsModal(false)} style={{ background: '#f0f5f1', border: 'none', cursor: 'pointer', padding: 8, borderRadius: '50%', color: '#517559', display: 'flex', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e3ebd8'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f0f5f1'; }}
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#89a88c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Classroom Name</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: '#2d3a2e' }}>{classroom.name}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#89a88c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</span>
                <span style={{ fontSize: 14, color: '#4a5c4d', lineHeight: 1.5 }}>{classroom.description || 'No description provided.'}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8faf8', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(81,117,89,0.1)' }}>
                  <Hash size={18} color="#517559" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: '#89a88c' }}>ROOM CODE</span>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: '#2d3a2e', letterSpacing: '1px' }}>{classroom.roomCode}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8faf8', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(81,117,89,0.1)' }}>
                  {classroom.private ? <Lock size={18} color="#517559" /> : <Unlock size={18} color="#517559" />}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: '#89a88c' }}>PRIVACY</span>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: '#2d3a2e' }}>{classroom.private ? 'Private' : 'Public'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8faf8', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(81,117,89,0.1)' }}>
                  <Calendar size={18} color="#517559" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: '#89a88c' }}>CREATED ON</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#2d3a2e' }}>{new Date(classroom.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8faf8', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(81,117,89,0.1)' }}>
                  <User size={18} color="#517559" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: '#89a88c' }}>OWNER</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#2d3a2e' }}>{classroom.User?.profile?.firstName} {classroom.User?.profile?.lastName}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 24px', background: '#f8faf8', borderTop: '1px solid rgba(81,117,89,0.1)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => { 
                  setShowDetailsModal(false); 
                  setUpdateData({
                    name: classroom.name || '',
                    description: classroom.description || '',
                    private: classroom.private || false,
                    roomPassword: '',
                    oldPassword: ''
                  });
                  setUpdateError('');
                  setShowUpdateModal(true); 
                }} 
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#517559', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', boxShadow: '0 2px 8px rgba(81,117,89,0.2)' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#3d5e43'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#517559'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <Settings size={16} strokeWidth={2.5} /> Update Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && classroom && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeSlideIn 0.2s ease-out', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 480, background: '#fff', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid rgba(81,117,89,0.1)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#2d3a2e', letterSpacing: '-0.3px' }}>Update Classroom</h2>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7c6e' }}>Modify your classroom's information.</p>
              </div>
              <button onClick={() => setShowUpdateModal(false)} style={{ background: '#f0f5f1', border: 'none', cursor: 'pointer', padding: 8, borderRadius: '50%', color: '#517559', display: 'flex', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e3ebd8'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f0f5f1'; }}
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {updateError && (
                <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#ef4444', borderRadius: 8, fontSize: 13, fontWeight: 500, border: '1px solid #fca5a5' }}>
                  {updateError}
                </div>
              )}
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#517559', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Classroom Name</label>
                <input type="text" value={updateData.name} onChange={e => setUpdateData({...updateData, name: e.target.value})} style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 10, border: '2px solid rgba(81,117,89,0.2)', color: '#2d3a2e', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.currentTarget.style.borderColor = '#517559'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(81,117,89,0.2)'} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#517559', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</label>
                <textarea value={updateData.description} onChange={e => setUpdateData({...updateData, description: e.target.value})} rows={3} style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 10, border: '2px solid rgba(81,117,89,0.2)', color: '#2d3a2e', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', resize: 'none', fontFamily: 'inherit' }} onFocus={e => e.currentTarget.style.borderColor = '#517559'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(81,117,89,0.2)'} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#517559', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Privacy Settings</label>
                <select value={updateData.private ? 'private' : 'public'} onChange={e => setUpdateData({...updateData, private: e.target.value === 'private'})} style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 10, border: '2px solid rgba(81,117,89,0.2)', color: '#2d3a2e', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', backgroundColor: '#fff', cursor: 'pointer' }} onFocus={e => e.currentTarget.style.borderColor = '#517559'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(81,117,89,0.2)'}>
                  <option value="public">Public - Anyone can join</option>
                  <option value="private">Private - Invite only</option>
                </select>
              </div>

              {updateData.private && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4, padding: 16, background: '#f8faf8', borderRadius: 12, border: '1px solid rgba(81,117,89,0.1)' }}>
                  <p style={{ margin: 0, fontSize: 12, color: '#6b7c6e', fontWeight: 500 }}>
                    {classroom.private ? "To change the password, enter the old one below." : "Set a new password for your private classroom."}
                  </p>
                  
                  {classroom.private && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 11, fontWeight: 700, color: '#517559', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Previous Password</label>
                      <input type="password" placeholder="Leave blank to keep current password" value={updateData.oldPassword} onChange={e => setUpdateData({...updateData, oldPassword: e.target.value})} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '2px solid rgba(81,117,89,0.15)', color: '#2d3a2e', fontSize: 13, outline: 'none' }} onFocus={e => e.currentTarget.style.borderColor = '#517559'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(81,117,89,0.15)'} />
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#517559', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{classroom.private ? "New Password" : "Password"}</label>
                    <input type="password" placeholder={classroom.private ? "Leave blank to keep current password" : "Enter a secure password"} value={updateData.roomPassword} onChange={e => setUpdateData({...updateData, roomPassword: e.target.value})} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '2px solid rgba(81,117,89,0.15)', color: '#2d3a2e', fontSize: 13, outline: 'none' }} onFocus={e => e.currentTarget.style.borderColor = '#517559'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(81,117,89,0.15)'} />
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '16px 24px', background: '#f8faf8', borderTop: '1px solid rgba(81,117,89,0.1)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setShowUpdateModal(false)} disabled={isUpdating} style={{ padding: '10px 18px', background: 'none', border: 'none', color: '#6b7c6e', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#2d3a2e'}
                onMouseLeave={e => e.currentTarget.style.color = '#6b7c6e'}
              >
                Cancel
              </button>
              <button onClick={handleUpdateClassroom} disabled={isUpdating} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#517559', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: isUpdating ? 'not-allowed' : 'pointer', transition: 'all 0.15s', opacity: isUpdating ? 0.7 : 1, boxShadow: '0 2px 8px rgba(81,117,89,0.2)' }}
                onMouseEnter={e => { if(!isUpdating) { e.currentTarget.style.background = '#3d5e43'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                onMouseLeave={e => { if(!isUpdating) { e.currentTarget.style.background = '#517559'; e.currentTarget.style.transform = 'translateY(0)'; } }}
              >
                {isUpdating ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Choice Modal */}
      {showCreateChoiceModal && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeSlideIn 0.2s ease-out', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 500, background: '#fff', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid rgba(81,117,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#2d3a2e' }}>Create New</h2>
              <button onClick={() => setShowCreateChoiceModal(false)} style={{ background: '#f0f5f1', border: 'none', cursor: 'pointer', padding: 8, borderRadius: '50%', color: '#517559', display: 'flex' }}><X size={20} /></button>
            </div>
            <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div onClick={() => { setShowCreateChoiceModal(false); setShowCreateActivityModal(true); }} style={{ background: '#f8faf8', border: '1px solid rgba(81,117,89,0.15)', borderRadius: 16, padding: 20, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#517559'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(81,117,89,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(81,117,89,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(81,117,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ClipboardList size={28} color="#517559" /></div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#2d3a2e', marginBottom: 4 }}>Activity</div>
                  <div style={{ fontSize: 12, color: '#6b7c6e', lineHeight: 1.4 }}>Create a quiz, assignment, or interactive task.</div>
                </div>
              </div>
              <div onClick={() => { setShowCreateChoiceModal(false); setShowCreateMaterialModal(true); }} style={{ background: '#f8faf8', border: '1px solid rgba(81,117,89,0.15)', borderRadius: 16, padding: 20, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#517559'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(81,117,89,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(81,117,89,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(81,117,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={28} color="#517559" /></div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#2d3a2e', marginBottom: 4 }}>Material</div>
                  <div style={{ fontSize: 12, color: '#6b7c6e', lineHeight: 1.4 }}>Upload a document, PDF, presentation, or notes.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Material Modal */}
      {showCreateMaterialModal && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeSlideIn 0.2s ease-out', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 480, background: '#fff', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid rgba(81,117,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#2d3a2e' }}>Create Learning Material</h2>
              <button onClick={() => setShowCreateMaterialModal(false)} style={{ background: '#f0f5f1', border: 'none', cursor: 'pointer', padding: 8, borderRadius: '50%', color: '#517559', display: 'flex' }}><X size={20} /></button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#517559', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Material Title</label>
                <input type="text" placeholder="e.g. Week 1 Lecture Notes" style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 10, border: '2px solid rgba(81,117,89,0.2)', color: '#2d3a2e', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.currentTarget.style.borderColor = '#517559'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(81,117,89,0.2)'} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#517559', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Upload File</label>
                <div style={{ width: '100%', aspectRatio: '16/9', background: '#f8faf8', borderRadius: 16, border: '2px dashed rgba(81,117,89,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#517559'; e.currentTarget.style.background = '#f0f5f1'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(81,117,89,0.3)'; e.currentTarget.style.background = '#f8faf8'; }}
                >
                  <input type="file" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 10 }} onChange={e => { if (e.target.files && e.target.files[0]) setMaterialFilePreview(e.target.files[0].name); }} />
                  {materialFilePreview ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: '#517559', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={24} color="#fff" /></div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#2d3a2e' }}>{materialFilePreview}</span>
                      <span style={{ fontSize: 12, color: '#6b7c6e' }}>Click to replace file</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 20, textAlign: 'center' }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(81,117,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}><UploadCloud size={24} color="#517559" /></div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#2d3a2e' }}>Drag and drop your file here</span>
                      <span style={{ fontSize: 12, color: '#6b7c6e' }}>or click to browse from your computer</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 24px', background: '#f8faf8', borderTop: '1px solid rgba(81,117,89,0.1)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setShowCreateMaterialModal(false)} style={{ padding: '10px 18px', background: 'none', border: 'none', color: '#6b7c6e', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = '#2d3a2e'} onMouseLeave={e => e.currentTarget.style.color = '#6b7c6e'}>Cancel</button>
              <button style={{ background: '#517559', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Upload Material</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Activity Modal (Form Builder) */}
      {showCreateActivityModal && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: '#f0f5f1', display: 'flex', flexDirection: 'column', zIndex: 1000, animation: 'fadeSlideIn 0.2s ease-out', overflowY: 'auto' }}>
          
          {/* Header */}
          <div style={{ background: '#fff', padding: '16px 24px', borderBottom: '1px solid rgba(81,117,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#517559', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ClipboardList size={18} color="#fff" /></div>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#2d3a2e' }}>Activity Builder</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => setShowCreateActivityModal(false)} style={{ padding: '8px 16px', background: 'none', border: 'none', color: '#6b7c6e', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => setShowCreateActivityModal(false)} style={{ background: '#517559', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Save Activity</button>
            </div>
          </div>

          <div style={{ maxWidth: 760, width: '100%', margin: '0 auto', padding: '32px 20px 60px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Title Card */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 0, border: '1px solid rgba(81,117,89,0.15)', borderTop: '8px solid #517559', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <div style={{ padding: '32px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <input type="text" placeholder="Activity Title" style={{ width: '100%', border: 'none', borderBottom: '1px solid rgba(81,117,89,0.2)', fontSize: 28, fontWeight: 700, color: '#2d3a2e', padding: '8px 0', outline: 'none' }} onFocus={e => e.currentTarget.style.borderColor = '#517559'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(81,117,89,0.2)'} />
                <input type="text" placeholder="Activity description (optional)" style={{ width: '100%', border: 'none', borderBottom: '1px solid rgba(81,117,89,0.2)', fontSize: 14, color: '#4a5c4d', padding: '8px 0', outline: 'none' }} onFocus={e => e.currentTarget.style.borderColor = '#517559'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(81,117,89,0.2)'} />
              </div>
            </div>

            {/* Questions list */}
            {activityQuestions.map((q, qIndex) => (
              <div key={q.id} style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid rgba(81,117,89,0.15)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 4, background: '#517559', borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }} />
                
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
                  <input type="text" placeholder="Question text" value={q.question} onChange={e => {
                    const newQs = [...activityQuestions]; newQs[qIndex].question = e.target.value; setActivityQuestions(newQs);
                  }} style={{ flex: 1, background: '#f8faf8', border: 'none', borderBottom: '2px solid rgba(81,117,89,0.2)', fontSize: 15, fontWeight: 500, color: '#2d3a2e', padding: '16px', outline: 'none', borderRadius: '8px 8px 0 0' }} onFocus={e => e.currentTarget.style.borderColor = '#517559'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(81,117,89,0.2)'} />
                  
                  <select value={q.type} onChange={e => {
                    const newQs = [...activityQuestions]; newQs[qIndex].type = e.target.value; setActivityQuestions(newQs);
                  }} style={{ width: 220, padding: '14px', borderRadius: 8, border: '1px solid rgba(81,117,89,0.2)', color: '#2d3a2e', fontSize: 14, outline: 'none', background: '#fff', cursor: 'pointer' }}>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="checkboxes">Checkboxes</option>
                    <option value="short_answer">Short Answer</option>
                  </select>
                </div>

                {q.type !== 'short_answer' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 8 }}>
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {q.type === 'multiple_choice' ? <Circle size={18} color="#a8d5b0" /> : <CheckSquare size={18} color="#a8d5b0" />}
                        <input type="text" value={opt} onChange={e => {
                          const newQs = [...activityQuestions]; newQs[qIndex].options[oIndex] = e.target.value; setActivityQuestions(newQs);
                        }} style={{ flex: 1, border: 'none', borderBottom: '1px solid transparent', fontSize: 14, color: '#2d3a2e', padding: '4px 0', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.currentTarget.style.borderBottomColor = '#517559'} onBlur={e => e.currentTarget.style.borderBottomColor = 'transparent'} />
                        {q.options.length > 1 && (
                          <button onClick={() => {
                            const newQs = [...activityQuestions]; newQs[qIndex].options.splice(oIndex, 1); setActivityQuestions(newQs);
                          }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a8d5b0', padding: 4 }}><X size={16} /></button>
                        )}
                      </div>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                      {q.type === 'multiple_choice' ? <Circle size={18} color="#d6e0d3" /> : <CheckSquare size={18} color="#d6e0d3" />}
                      <button onClick={() => {
                        const newQs = [...activityQuestions]; newQs[qIndex].options.push(`Option ${newQs[qIndex].options.length + 1}`); setActivityQuestions(newQs);
                      }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7c6e', fontSize: 13, fontWeight: 500, padding: 0 }}>Add option</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ paddingLeft: 8, marginTop: 8 }}>
                    <div style={{ borderBottom: '1px dashed #b8c9bb', color: '#89a88c', fontSize: 13, paddingBottom: 8, width: '60%' }}>Short answer text</div>
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(81,117,89,0.1)' }}>
                  <button onClick={() => {
                    const newQs = activityQuestions.filter((_, i) => i !== qIndex); setActivityQuestions(newQs.length ? newQs : [{ id: Date.now(), type: 'multiple_choice', question: '', options: ['Option 1'] }]);
                  }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#89a88c', padding: 8, borderRadius: '50%', display: 'flex', transition: 'background 0.15s' }} onMouseEnter={e => { e.currentTarget.style.background = '#f8faf8'; e.currentTarget.style.color = '#ef4444'; }} onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#89a88c'; }}><Trash2 size={20} /></button>
                </div>
              </div>
            ))}

            <button onClick={() => {
              setActivityQuestions([...activityQuestions, { id: Date.now(), type: 'multiple_choice', question: '', options: ['Option 1'] }]);
            }} style={{ background: '#fff', border: '1px solid rgba(81,117,89,0.2)', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#517559', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f8faf8'; e.currentTarget.style.borderColor = '#517559'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(81,117,89,0.2)'; }}
            >
              <Plus size={18} strokeWidth={3} /> Add Question
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default ClassroomDetail;
