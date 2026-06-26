import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Bot, User, Sparkles, Plus, MessageCircle, FileText, 
  ArrowLeft, Brain, ScrollText, Layers, Send, BookOpen, ChevronDown, Check, Menu, PenTool, X, Bookmark, Trash2
} from 'lucide-react';
import { getClassroomByCode } from '../../api/classroom.api';
import { getLearningMaterials } from '../../api/learningMaterials.api';
import useAIStore from '../../store/ai.store';
import TokenWidget from '../../components/common/TokenWidget';

const AiStudioPage = () => {
  const { code, materialId: initialMaterialId } = useParams();
  const navigate = useNavigate();
  const { virtualTokens, isTokensExhausted, setVirtualTokens, setNextResetAt } = useAIStore();
  
  const [classroom, setClassroom] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [activeMaterialId, setActiveMaterialId] = useState(initialMaterialId || null);
  const [showMaterialPicker, setShowMaterialPicker] = useState(false);
  
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  const [conversations, setConversations] = useState([]);
  const [savedMaterials, setSavedMaterials] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [activeSavedId, setActiveSavedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [studioOutput, setStudioOutput] = useState(null);
  const [studioLoading, setStudioLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // 1. Fetch Classroom and Materials
  useEffect(() => {
    const initData = async () => {
      try {
        const clsData = await getClassroomByCode(code);
        const room = Array.isArray(clsData) ? clsData[0] : clsData;
        setClassroom(room);
        if (room?.id) {
          const matsData = await getLearningMaterials(room.id);
          const matsArray = matsData?.learningMaterial && Array.isArray(matsData.learningMaterial) ? matsData.learningMaterial : [];
          setMaterials(matsArray);
        }
      } catch (e) {
        console.error("Failed to load classroom", e);
      }
    };
    if (code) initData();
  }, [code]);

  // 2. Fetch History when activeMaterialId changes
  useEffect(() => {
    if (activeMaterialId) {
      fetchHistory();
      setActiveThreadId(null);
      setActiveSavedId(null);
      setStudioOutput(null);
      setMessages([]);
    } else {
      setConversations([]);
      setSavedMaterials([]);
    }
  }, [activeMaterialId]);

  // 3. Fetch Messages when activeThreadId changes
  useEffect(() => {
    if (activeThreadId) {
      fetchMessages(activeThreadId);
    }
  }, [activeThreadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, studioOutput]);

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');
    try {
      const [convRes, matRes] = await Promise.all([
        fetch(`http://localhost:3000/api/studio/conversations/material/${activeMaterialId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`http://localhost:3000/api/studio/study-materials/material/${activeMaterialId}`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const convs = await convRes.json();
      const mats = await matRes.json();
      setConversations(Array.isArray(convs) ? convs : []);
      setSavedMaterials(Array.isArray(mats) ? mats : []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMessages = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/api/studio/conversations/${id}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNewChat = async () => {
    if (!activeMaterialId) return alert("Please select a learning material first.");
    setActiveSavedId(null);
    setStudioOutput(null);
    setShowLeftSidebar(false);
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/api/studio/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ materialId: activeMaterialId, title: "New Conversation" })
      });
      const newConv = await res.json();
      setConversations(prev => [newConv, ...prev]);
      setActiveThreadId(newConv.id);
      setMessages([]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleSave = async (id, isSaved) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:3000/api/studio/conversations/${id}/save`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ isSaved })
      });
      setConversations(prev => prev.map(c => c.id === id ? { ...c, isSaved } : c));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteConv = async (id) => {
    if (!window.confirm("Delete this conversation?")) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:3000/api/studio/conversations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setConversations(prev => prev.filter(c => c.id !== id));
      if (activeThreadId === id) setActiveThreadId(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping || !activeThreadId) return;
    const text = input.trim();
    setInput('');
    
    const tempId = Date.now().toString();
    setMessages(prev => [...prev, { id: tempId, sender: 'user', content: text }]);
    setIsTyping(true);
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/api/studio/conversations/${activeThreadId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ text })
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
           setVirtualTokens(0);
           if (data.nextResetAt) setNextResetAt(data.nextResetAt);
           setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', content: data.message }]);
           return;
        }
        throw new Error(data.message || "Failed to send");
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', content: data.reply }]);
      if (data.title) {
        setConversations(prev => prev.map(c => c.id === activeThreadId ? { ...c, title: data.title } : c));
      }
      if (data.remainingTokens !== undefined) {
        window.dispatchEvent(new CustomEvent('aiTokensUpdate', { detail: data.remainingTokens }));
      }
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', content: e.message || "Error sending message" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerate = async (type) => {
    if (!activeMaterialId) return alert("Please select a learning material first.");
    setActiveThreadId(null);
    setActiveSavedId(null);
    setStudioOutput({ type, content: '', isLoading: true });
    setStudioLoading(true);
    setShowRightSidebar(false);

    const token = localStorage.getItem('token');
    const apiType = type === 'quiz' ? 'quiz' : type; 
    try {
      const res = await fetch('http://localhost:3000/api/ai/generate-study-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ materialId: activeMaterialId, type: apiType })
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
           setVirtualTokens(0);
           if (data.nextResetAt) setNextResetAt(data.nextResetAt);
           setStudioOutput({ type, content: data.message, isLoading: false });
           return;
        }
        throw new Error("Failed to generate");
      }

      setStudioOutput({ type, content: data.content, isLoading: false });
      
      const saveRes = await fetch(`http://localhost:3000/api/studio/study-materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ materialId: activeMaterialId, type, content: data.content })
      });
      const saved = await saveRes.json();
      setSavedMaterials(prev => [saved, ...prev]);
      setActiveSavedId(saved.id);
      
      if (data.remainingTokens !== undefined) {
        window.dispatchEvent(new CustomEvent('aiTokensUpdate', { detail: data.remainingTokens }));
      }
    } catch (e) {
      setStudioOutput({ type, content: "Error generating content.", isLoading: false });
    } finally {
      setStudioLoading(false);
    }
  };

  const selectedMatObj = materials.find(m => m.id === activeMaterialId);

  return (
    <div className="flex h-screen bg-[#F5F7F5] dark:bg-[#121612] relative overflow-hidden">
      
      {/* Mobile Overlays */}
      {showLeftSidebar && (
        <div className="md:hidden absolute inset-0 bg-black/50 z-30" onClick={() => setShowLeftSidebar(false)} />
      )}
      {showRightSidebar && (
        <div className="md:hidden absolute inset-0 bg-black/50 z-30" onClick={() => setShowRightSidebar(false)} />
      )}

      {/* LEFT SIDEBAR: History & Material Selection */}
      <div className={`absolute md:relative z-40 h-full transition-transform duration-300 w-[300px] bg-white dark:bg-[#1A211A] border-r border-gray-100 dark:border-white/10 flex flex-col shrink-0 overflow-hidden ${showLeftSidebar ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate(`/dashboard/classroom/${code}`)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-500 transition-colors">
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-gray-800 dark:text-gray-100 text-[15px] truncate">Likhâ AI Studio</h2>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest truncate">{classroom?.name || 'Loading...'}</p>
            </div>
          </div>
          <button onClick={() => setShowLeftSidebar(false)} className="md:hidden p-2 text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Material Selector */}
        <div className="p-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Selected Material</p>
          <div className="relative">
            <button
              onClick={() => setShowMaterialPicker(!showMaterialPicker)}
              className="w-full flex items-center gap-2 bg-white dark:bg-[#232B23] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 cursor-pointer text-left shadow-sm hover:border-[#5D7C59]/40 transition-colors"
            >
              <BookOpen size={14} className="text-[#5D7C59]" />
              <span className="text-[12.5px] font-semibold text-gray-700 dark:text-gray-200 truncate flex-1">
                {selectedMatObj ? selectedMatObj.title : 'Select a material...'}
              </span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>
            
            {showMaterialPicker && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#232B23] border border-gray-100 dark:border-white/10 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                {materials.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setActiveMaterialId(m.id); setShowMaterialPicker(false); navigate(`/dashboard/classroom/${code}/studio/${m.id}`, { replace: true }); }}
                    className={`w-full text-left px-3 py-2.5 text-[12px] flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-none cursor-pointer
                      ${activeMaterialId === m.id ? 'bg-[#5D7C59]/10 text-[#5D7C59] font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    <FileText size={13} className="text-gray-400" />
                    <span className="truncate flex-1">{m.title}</span>
                    {activeMaterialId === m.id && <Check size={12} className="text-[#5D7C59]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* History only shows if material is selected */}
        {activeMaterialId ? (
          <>
            <div className="p-4 shrink-0">
              <button onClick={handleNewChat} className="w-full flex items-center justify-center gap-2 bg-[#5D7C59] hover:bg-[#4A6447] text-white px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-colors shadow-sm cursor-pointer">
                <Plus size={16} /> New Chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-4 flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Recent Chats</p>
                {conversations.length === 0 ? (
                  <p className="text-xs text-gray-400 px-2 italic">No chats yet.</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {conversations.map(c => {
                      const daysLeft = Math.max(0, 30 - Math.floor((Date.now() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24)));
                      return (
                      <div key={c.id} className="relative group flex items-center w-full">
                        <button
                          onClick={() => { setActiveThreadId(c.id); setActiveSavedId(null); setStudioOutput(null); setShowLeftSidebar(false); }}
                          className={`flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-xl w-full text-left transition-colors border-none cursor-pointer pr-16
                            ${activeThreadId === c.id ? 'bg-[#5D7C59]/10 text-[#5D7C59] dark:bg-white/10 dark:text-white font-semibold' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'}`}
                        >
                          <div className="flex items-center gap-2.5 w-full">
                            <MessageCircle size={14} className="shrink-0" />
                            <span className="text-[12.5px] truncate flex-1">{c.title}</span>
                          </div>
                          <span className={`text-[9.5px] font-bold ml-[26px] ${c.isSaved ? 'text-[#FFC700]' : 'text-gray-400 opacity-70'}`}>
                            {c.isSaved ? 'Saved' : `Expires in ${daysLeft} days`}
                          </span>
                        </button>

                        <div className="absolute right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleToggleSave(c.id, !c.isSaved)} 
                            title={c.isSaved ? "Unsave" : "Save"}
                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-500 cursor-pointer border-none bg-transparent transition-colors"
                          >
                            {c.isSaved ? <Bookmark size={13} fill="currentColor" className="text-[#FFC700]" /> : <Bookmark size={13} />}
                          </button>
                          <button 
                            onClick={() => handleDeleteConv(c.id)} 
                            title="Delete"
                            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-500 rounded-lg text-gray-500 cursor-pointer border-none bg-transparent transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    )})}
                  </div>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Saved Materials</p>
                {savedMaterials.length === 0 ? (
                  <p className="text-xs text-gray-400 px-2 italic">No saved materials.</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {savedMaterials.map(m => (
                      <button
                        key={m.id}
                        onClick={() => { setActiveSavedId(m.id); setActiveThreadId(null); setStudioOutput(null); setShowLeftSidebar(false); }}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl w-full text-left transition-colors border-none cursor-pointer
                          ${activeSavedId === m.id ? 'bg-[#FFC700]/10 text-[#B88F00] dark:text-[#FFC700] font-semibold' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'}`}
                      >
                        <FileText size={14} />
                        <span className="text-[12.5px] truncate flex-1 capitalize">{m.type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-400">
            <BookOpen size={32} className="mb-3 text-gray-300" />
            <p className="text-sm font-medium">Please select a learning material to start.</p>
          </div>
        )}
      </div>

      {/* CENTER: Main View */}
      <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-3 bg-white dark:bg-[#1A211A] border-b border-gray-100 dark:border-white/10 shrink-0">
          <button onClick={() => setShowLeftSidebar(true)} className="p-2 -ml-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl">
            <Menu size={20} />
          </button>
          
          <div className="flex flex-col items-center justify-center min-w-0 px-2 flex-1">
            <span className="font-bold text-[14px] text-gray-800 dark:text-white truncate w-full text-center">Likhâ AI Studio</span>
            {selectedMatObj && (
              <span className="text-[10px] text-gray-500 font-medium truncate flex items-center justify-center gap-1 w-full mt-0.5">
                <BookOpen size={10} className="shrink-0" /> <span className="truncate">{selectedMatObj.title}</span>
              </span>
            )}
          </div>

          <button onClick={() => setShowRightSidebar(true)} className="p-2 -mr-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl">
            <PenTool size={20} />
          </button>
        </div>

        {activeThreadId ? (
          <>
            <div className="flex-1 overflow-y-auto flex flex-col">
              <div className="px-4 pt-4 md:px-10 md:pt-6 shrink-0 flex justify-center md:justify-start mb-2">
                 <div className="hidden md:block w-full"><TokenWidget /></div>
                 <div className="md:hidden"><TokenWidget compact /></div>
              </div>
              
              <div className="flex-1 px-4 pb-4 md:px-10 md:pb-10 flex flex-col gap-6">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 px-4">
                  <Bot size={48} className="mb-4 text-gray-300" />
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">How can I help you study?</h3>
                  <p className="text-sm">I have the material context ready. Ask me anything!</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 max-w-3xl w-full mx-auto ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-[#FFC700]' : 'bg-[#5D7C59] text-white'}`}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`text-[14px] leading-relaxed whitespace-pre-wrap break-words px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-[#5D7C59] text-white' : 'bg-white dark:bg-[#1A211A] text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-white/10'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 max-w-3xl w-full mx-auto">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#5D7C59] text-white"><Bot size={16} /></div>
                  <div className="bg-white px-4 py-3 rounded-2xl shadow-sm text-gray-500 text-sm border border-gray-100 dark:border-white/10">Thinking...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="p-3 md:p-4 bg-[#F5F7F5] dark:bg-[#121612] shrink-0 border-t border-gray-100 dark:border-white/5">
              <div className="max-w-3xl mx-auto flex items-end gap-2 bg-white dark:bg-[#1A211A] border border-gray-200 dark:border-white/10 rounded-2xl p-1.5 shadow-sm focus-within:border-[#5D7C59] transition-colors">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  placeholder={isTokensExhausted() ? "Out of tokens for today" : "Ask anything..."}
                  disabled={isTokensExhausted() || isTyping}
                  rows={1}
                  className="flex-1 bg-transparent resize-none outline-none py-2 px-3 text-[14px] text-gray-800 dark:text-gray-200 disabled:opacity-50"
                  style={{ maxHeight: '120px' }}
                />
                <button onClick={handleSendMessage} disabled={!input.trim() || isTyping || isTokensExhausted()} className="p-2.5 rounded-xl bg-[#5D7C59] text-white hover:bg-[#4A6447] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 m-0.5 cursor-pointer">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (activeSavedId || studioOutput) ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-10">
            <div className="max-w-4xl mx-auto bg-white dark:bg-[#1A211A] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10 bg-gradient-to-r from-[#5D7C59] to-[#4A6447] flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Sparkles size={18} className="text-[#FFC700]" />
                  <span className="font-bold text-[15px] capitalize">
                    {activeSavedId ? savedMaterials.find(m => m.id === activeSavedId)?.type : studioOutput?.type}
                  </span>
                </div>
              </div>
              <div className="p-5 md:p-8">
                {studioLoading ? (
                  <div className="flex flex-col items-center py-20 text-gray-400 px-4 text-center">
                    <Sparkles size={40} className="mb-4 animate-pulse text-[#FFC700]" />
                    <p>Generating your study material...</p>
                  </div>
                ) : (
                  <pre className="text-[13px] md:text-[14px] leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans">
                    {activeSavedId ? savedMaterials.find(m => m.id === activeSavedId)?.content : studioOutput?.content}
                  </pre>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#5D7C59] to-[#4A6447] rounded-3xl flex items-center justify-center shadow-2xl mb-6">
              <Sparkles size={32} className="text-[#FFC700]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">Welcome to Likhâ AI Studio</h1>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-md leading-relaxed mb-8">
              Generate instant study materials, summaries, and quizzes, or start a personalized chat to ask questions about the current document.
            </p>
            
            <div className="md:hidden flex flex-col gap-3 w-full max-w-xs animate-fade-in-up">
              <button 
                onClick={() => setShowRightSidebar(true)}
                className="w-full py-3.5 px-4 bg-[#5D7C59] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-[#4A6447] transition-colors border-none cursor-pointer"
              >
                <Sparkles size={16} className="text-[#FFC700]" /> Open Generation Tools
              </button>
              <button 
                onClick={() => setShowLeftSidebar(true)}
                className="w-full py-3.5 px-4 bg-white dark:bg-[#232B23] text-gray-700 dark:text-gray-200 font-bold text-sm rounded-xl flex items-center justify-center gap-2 border border-gray-200 dark:border-white/10 shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Menu size={16} /> View Chats & Materials
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR: Tools */}
      <div className={`absolute md:relative right-0 z-40 h-full transition-transform duration-300 w-[280px] bg-white dark:bg-[#1A211A] border-l border-gray-100 dark:border-white/10 shrink-0 p-5 flex flex-col ${showRightSidebar ? 'translate-x-0 shadow-2xl' : 'translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Generation Tools</h3>
          <button onClick={() => setShowRightSidebar(false)} className="md:hidden p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { key: 'summary', label: 'Create Summary', icon: ScrollText },
            { key: 'reviewer', label: 'Create Reviewer', icon: Brain },
            { key: 'overview', label: 'Create Overview', icon: Layers },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleGenerate(key)}
              disabled={isTokensExhausted()}
              className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A211A] hover:border-[#5D7C59]/40 hover:shadow-md transition-all text-left cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-[#5D7C59]/10 transition-colors">
                <Icon size={18} className="text-gray-500 group-hover:text-[#5D7C59]" />
              </div>
              <div className="flex-1 font-semibold text-[13.5px] text-gray-700 dark:text-gray-200 group-hover:text-[#5D7C59] transition-colors">
                {label}
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AiStudioPage;
