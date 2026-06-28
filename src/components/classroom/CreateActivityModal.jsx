import React, { useState, useEffect, useMemo } from 'react';
import { ClipboardList, Code, Grid, AlignLeft, FileText, UploadCloud, ChevronLeft, Calendar, LayoutTemplate, Loader2, Sparkles, AlertCircle, Zap, Info, Scale, BarChart2, Coins, Layout, BookOpen, Wallet, Package } from 'lucide-react';
import useAIStore from '../../store/ai.store';
import { toast } from 'sonner';
import QuizBuilder from './activities/QuizBuilder';
import CodingBuilder from './activities/CodingBuilder';
import SpreadsheetBuilder from './activities/SpreadsheetBuilder';
import CaseStudyBuilder from './activities/CaseStudyBuilder';
import GenericBuilder from './activities/GenericBuilder';
import FrontendBuilder from './activities/FrontendBuilder';
import { createActivity } from '../../api/activity.api';
import { useParams } from 'react-router-dom';

const ACTIVITY_TYPES = [
  { id: 'QUIZ', label: 'Quiz / Test', description: 'Multiple choice, checkboxes, short answers', icon: ClipboardList, color: 'from-blue-500 to-blue-600' },
  { id: 'CODING', label: 'Coding Challenge', description: 'Live code execution in Python or JS', icon: Code, color: 'from-green-500 to-green-600' },
  { id: 'FRONTEND', label: 'Frontend UI Task', description: 'Interactive HTML, CSS, & JS with live preview', icon: LayoutTemplate, color: 'from-teal-500 to-teal-600' },
  { id: 'SPREADSHEET', label: 'Spreadsheet Task', description: 'In-browser interactive spreadsheet', icon: Grid, color: 'from-emerald-500 to-emerald-600' },
  { id: 'ESSAY', label: 'Essay', description: 'Long-form written response', icon: AlignLeft, color: 'from-yellow-500 to-yellow-600' },
  { id: 'PROBLEM_SET', label: 'Problem Set', description: 'General problem solving', icon: FileText, color: 'from-purple-500 to-purple-600' },
  { id: 'PRESENTATION', label: 'File Submission', description: 'Upload PPT, PDF, or Doc', icon: UploadCloud, color: 'from-red-500 to-red-600' },
  { id: 'CASE_STUDY', label: 'Case Study', description: 'Scenario with reference files', icon: FileText, color: 'from-indigo-500 to-indigo-600' },
];

const CreateActivityModal = ({ isOpen, onClose, onSuccess, classroomId }) => {
  const [step, setStep] = useState(1);
  const [activityData, setActivityData] = useState({
    title: '',
    description: '',
    activityType: '',
    totalPoints: 100,
    deadline: '',
    allowLate: false,
    maxAttempts: 1,
    questions: [],
  });
  const [isSaving, setIsSaving] = useState(false);

  // AI State
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiForm, setAiForm] = useState({
    topic: '', gradeLevel: '', type: 'QUIZ', instructions: '',
    // CODING
    codingLanguage: 'javascript', difficulty: 'intermediate',
    // FRONTEND
    cssFramework: 'native',
    // QUIZ
    quizCount: 5, quizType: 'multiple_choice',
    // PROBLEM_SET
    problemCount: 3,
    // ESSAY
    wordCount: 300,
    // SPREADSHEET
    spreadsheetColumns: 4, spreadsheetTab: 'general',
  });
  const [aiError, setAiError] = useState('');
  
  const { isTokensExhausted, setVirtualTokens, setNextResetAt, virtualTokens, maxTokens } = useAIStore();

  // ── Token cost estimator ──────────────────────────────────────────────────
  // Rough per-token estimates based on average prompt + output sizes
  const estimatedTokenCost = useMemo(() => {
    const { type, quizCount, difficulty, problemCount, wordCount, cssFramework, codingLanguage } = aiForm;
    const base = 800; // system prompt + topic + grade level overhead
    if (type === 'QUIZ')        return base + (aiForm.quizCount || 5) * 120;
    if (type === 'PROBLEM_SET') return base + (aiForm.problemCount || 3) * 150;
    if (type === 'ESSAY')       return base + Math.round((aiForm.wordCount || 300) * 1.5);
    if (type === 'CODING')      return base + 600;
    if (type === 'FRONTEND')    return base + 800;
    if (type === 'SPREADSHEET') return base + 400;
    if (type === 'CASE_STUDY')  return base + 700;
    if (type === 'PRESENTATION')return base + 300;
    return base + 400;
  }, [aiForm.type, aiForm.quizCount, aiForm.problemCount, aiForm.wordCount]);

  const tokenPct   = maxTokens > 0 ? Math.min(100, (virtualTokens / maxTokens) * 100) : 0;
  const hasEnough  = virtualTokens >= estimatedTokenCost;
  const tokenColor = tokenPct > 50 ? '#5D7C59' : tokenPct > 20 ? '#d97706' : '#dc2626';

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setActivityData({ title: '', description: '', activityType: '', totalPoints: 100, deadline: '', allowLate: false, maxAttempts: 1, questions: [] });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTypeSelect = (typeId) => {
    setActivityData({ ...activityData, activityType: typeId, questions: [] });
    setStep(2);
  };

  const handleSave = async (classroomId) => {
    try {
      if (!activityData.title) {
        toast.warning('Please enter an activity title before saving.');
        return;
      }
      setIsSaving(true);
      
      const payload = { ...activityData, status: 'published' };
      if (!payload.deadline) {
        delete payload.deadline;
      } else {
        payload.deadline = new Date(payload.deadline).toISOString();
      }
      
      if (payload.questions.length > 0) {
        payload.questions.forEach(q => {
          if (!q.content?.trim()) {
            q.content = 'Please refer to the activity instructions or attachments provided above.';
          }
        });
      }
      
      await createActivity(classroomId, payload);
      toast.success('Activity created successfully!');
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create activity. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiForm.topic || !aiForm.gradeLevel) {
      toast.warning('Please enter a topic and grade level.');
      return;
    }
    setIsAIGenerating(true);
    setAiError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/ai/generate-activity', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topic: aiForm.topic,
          gradeLevel: aiForm.gradeLevel,
          type: aiForm.type,
          cssFramework: aiForm.cssFramework,
          codingLanguage: aiForm.codingLanguage,
          difficulty: aiForm.difficulty,
          quizCount: aiForm.quizCount,
          quizType: aiForm.quizType,
          problemCount: aiForm.problemCount,
          wordCount: aiForm.wordCount,
          spreadsheetColumns: aiForm.spreadsheetColumns,
          spreadsheetTask: aiForm.spreadsheetTask,
          additionalInstructions: aiForm.instructions
        })
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 429) {
           setVirtualTokens(0);
           if (data.nextResetAt) setNextResetAt(data.nextResetAt);
           toast.error(data.message || 'Daily AI token limit reached.');
           return;
        }
        throw new Error(data.error || data.message || 'Failed to generate');
      }
      
      let content = data.content;
      try {
        const jsonMatch = content.match(/```json\n([\s\S]*)\n```/);
        if (jsonMatch) content = JSON.parse(jsonMatch[1]);
        else content = JSON.parse(content);
      } catch(e) {
         // fallback string
      }

      if (typeof content === 'string') {
        const defaultQType = aiForm.type === 'ESSAY' || aiForm.type === 'CASE_STUDY' ? 'essay' : 
                             aiForm.type === 'PROBLEM_SET' ? 'short_answer' : 
                             aiForm.type === 'CODING' ? 'coding_problem' : 
                             aiForm.type === 'FRONTEND' ? 'frontend_problem' :
                             aiForm.type === 'SPREADSHEET' ? 'spreadsheet_problem' :
                             aiForm.type === 'PRESENTATION' ? 'file_upload' : 'essay';
        setActivityData({
          ...activityData,
          title: aiForm.topic,
          description: '',
          activityType: aiForm.type,
          questions: [{ id: Date.now().toString(), questionType: defaultQType, content: content, points: 100 }]
        });
      } else {
        const isNewFormat = content && !Array.isArray(content) && content.questions;
        const questionsArray = isNewFormat ? content.questions : content;
        const generatedTitle = isNewFormat && content.title ? content.title : aiForm.topic;

        setActivityData({
          ...activityData,
          title: generatedTitle,
          description: '',
          activityType: aiForm.type,
          questions: questionsArray
        });
      }
      
      if (data.remainingTokens !== undefined) {
        window.dispatchEvent(new CustomEvent('aiTokensUpdate', { detail: data.remainingTokens }));
      }
      toast.success('Activity generated!');
      setShowAIModal(false);
      setStep(2);
    } catch (err) {
      setAiError(err.message);
    } finally {
      setIsAIGenerating(false);
    }
  };

  const renderBuilder = () => {
    const props = {
      questions: activityData.questions,
      setQuestions: (qs) => setActivityData({ ...activityData, questions: qs })
    };

    switch (activityData.activityType) {
      case 'QUIZ': return <QuizBuilder {...props} />;
      case 'CODING': return <CodingBuilder {...props} />;
      case 'FRONTEND': return <FrontendBuilder {...props} />;
      case 'SPREADSHEET': return <SpreadsheetBuilder {...props} />;
      case 'CASE_STUDY': return <CaseStudyBuilder {...props} />;
      case 'ESSAY': return <GenericBuilder typeLabel="Essay Prompt" defaultQuestionType="essay" {...props} />;
      case 'PROBLEM_SET': return <GenericBuilder typeLabel="Problem Set" defaultQuestionType="short_answer" {...props} />;
      case 'PRESENTATION': return <GenericBuilder typeLabel="File Submission" defaultQuestionType="file_upload" {...props} />;
      default: return null;
    }
  };

  return (
    <div className="absolute inset-0 bg-[#f0f4f8] dark:bg-[#121612] flex flex-col z-[1000] overflow-y-auto transition-colors duration-200" style={{ animation: 'fadeSlideIn 0.2s ease-out' }}>
      <div className="bg-white dark:bg-[#1A211A] px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between sticky top-0 z-10 shadow-sm shrink-0 transition-colors duration-200 gap-2">
        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
          {step === 2 && (
            <button onClick={() => setStep(1)} className="p-1.5 md:p-2 bg-gray-100 dark:bg-white/5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border-none cursor-pointer shrink-0">
              <ChevronLeft size={18} className="text-gray-600 dark:text-gray-300" />
            </button>
          )}
          <div className="hidden sm:flex w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-[#5D7C59] to-[#4A6447] items-center justify-center shrink-0">
            <ClipboardList size={16} className="text-white md:w-[18px] md:h-[18px]" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-sm md:text-base font-bold text-gray-900 dark:text-white truncate block leading-tight">Activity Builder</span>
            <p className="text-[10px] md:text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5">{step === 1 ? 'Select Activity Type' : 'Configure Activity'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-3 shrink-0">
          <button onClick={onClose} className="px-2 md:px-4 py-2 text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors border-none bg-transparent cursor-pointer">Cancel</button>
          {step === 2 && (
            <button 
              onClick={() => handleSave(classroomId)} 
              disabled={isSaving}
              className="px-3 py-1.5 md:px-5 md:py-2 bg-gradient-to-r from-[#5D7C59] to-[#4A6447] text-white rounded-xl text-[11px] md:text-sm font-bold shadow-sm shadow-[#5D7C59]/20 hover:shadow-md hover:from-[#4A6447] hover:to-[#3A4E38] transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer flex items-center justify-center min-w-[60px] md:min-w-[120px]"
            >
              {isSaving ? (
                <><Loader2 size={12} className="animate-spin md:w-[14px] md:h-[14px] mr-1" /> <span className="hidden sm:inline">Saving...</span><span className="sm:hidden">Wait</span></>
              ) : <><span className="hidden sm:inline">Save Activity</span><span className="sm:hidden">Save</span></>}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl w-full mx-auto px-4 md:px-5 py-5 md:py-8 flex flex-col gap-5 md:gap-6">
        {step === 1 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">What kind of activity are you creating?</h2>
              <button 
                onClick={() => setShowAIModal(true)}
                disabled={isTokensExhausted()}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#5D7C59] to-[#4A6447] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer border-none disabled:opacity-50"
              >
                <Sparkles size={16} /> Auto-Generate with AI
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ACTIVITY_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <div 
                    key={type.id} 
                    onClick={() => handleTypeSelect(type.id)}
                    className="bg-white dark:bg-[#1A211A] p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer transition-all flex flex-col gap-3 group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center shadow-sm`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-gray-900 dark:text-white group-hover:text-[#5D7C59] transition-colors">{type.label}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{type.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-colors duration-200" style={{ borderTop: '6px solid #5D7C59' }}>
              <div className="px-4 md:px-6 py-5 md:py-6 flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Activity Title"
                  value={activityData.title}
                  onChange={e => setActivityData({ ...activityData, title: e.target.value })}
                  className="w-full border-none text-xl md:text-2xl font-bold text-gray-900 dark:text-white py-2 outline-none bg-transparent"
                  style={{ borderBottom: '2px solid #e5e7eb' }}
                  onFocus={e => { e.currentTarget.style.borderBottomColor = '#5D7C59'; }}
                  onBlur={e => { e.currentTarget.style.borderBottomColor = '#e5e7eb'; }}
                />
                <input
                  type="text"
                  placeholder="Instructions or description (optional)"
                  value={activityData.description}
                  onChange={e => setActivityData({ ...activityData, description: e.target.value })}
                  className="w-full border-none text-sm md:text-base text-gray-500 dark:text-gray-400 py-1 outline-none bg-transparent"
                  style={{ borderBottom: '1px solid #e5e7eb' }}
                  onFocus={e => { e.currentTarget.style.borderBottomColor = '#5D7C59'; }}
                  onBlur={e => { e.currentTarget.style.borderBottomColor = '#e5e7eb'; }}
                />
                
                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-1">Total Points</label>
                    <input 
                      type="number" 
                      value={activityData.totalPoints}
                      onChange={e => setActivityData({ ...activityData, totalPoints: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#FAFCFA] dark:bg-[#232B23] rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/10 outline-none" 
                    />
                  </div>
                  <div className="col-span-2 sm:flex-1">
                    <label className="text-xs text-gray-500 block mb-1">Deadline (Optional)</label>
                    <input 
                      type="datetime-local" 
                      value={activityData.deadline}
                      onChange={e => setActivityData({ ...activityData, deadline: e.target.value })}
                      className="w-full bg-[#FAFCFA] dark:bg-[#232B23] rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/10 outline-none" 
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-1">Max Attempts</label>
                    <input 
                      type="number" 
                      min="1"
                      value={activityData.maxAttempts}
                      onChange={e => setActivityData({ ...activityData, maxAttempts: parseInt(e.target.value) || 1 })}
                      className="w-full bg-[#FAFCFA] dark:bg-[#232B23] rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/10 outline-none" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {renderBuilder()}
          </>
        )}
      </div>

      {/* AI Generation Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/60 z-[1001] flex items-center justify-center backdrop-blur-sm px-4 py-6">
          <div className="bg-white dark:bg-[#1A211A] rounded-2xl w-full max-w-xl shadow-2xl relative border border-gray-100 dark:border-white/10 flex flex-col max-h-[90vh]" style={{ animation: 'slideUpIn 0.2s ease-out' }}>

            {/* Header */}
            <div className="px-6 pt-6 pb-4 shrink-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                <span className="text-[#5D7C59]"><Sparkles size={20} /></span> Generate Activity
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Configure and let AI build a ready-to-publish activity.</p>
            </div>

            {/* Token balance bar */}
            <div className="mx-6 mb-3 p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={11} /> Token Balance
                </span>
                <span className="text-[11px] font-bold tabular-nums" style={{ color: tokenColor }}>
                  {virtualTokens.toLocaleString()} / {maxTokens.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${tokenPct}%`, background: tokenColor }} />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[11px] text-gray-400">
                  Est. cost: <span className={`font-bold ${hasEnough ? 'text-[#5D7C59]' : 'text-red-500'}`}>~{estimatedTokenCost.toLocaleString()} tokens</span>
                </span>
                {!hasEnough && (
                  <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                    <AlertCircle size={10} /> Insufficient tokens
                  </span>
                )}
              </div>
            </div>

            {/* Scrollable form */}
            <div className="overflow-y-auto flex-1 px-6 pb-2">
              <div className="flex flex-col gap-4">

                {/* Topic */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Topic / Subject</label>
                  <input
                    type="text"
                    placeholder="e.g., Photosynthesis, Python For Loops"
                    value={aiForm.topic}
                    onChange={e => setAiForm({ ...aiForm, topic: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#5D7C59] transition-colors"
                  />
                </div>

                {/* Grade level */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Grade Level</label>
                  <input
                    type="text"
                    placeholder="e.g., 5th Grade, High School, College"
                    value={aiForm.gradeLevel}
                    onChange={e => setAiForm({ ...aiForm, gradeLevel: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#5D7C59] transition-colors"
                  />
                </div>

                {/* Activity Format */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Activity Format</label>
                  <select
                    value={aiForm.type}
                    onChange={e => setAiForm({ ...aiForm, type: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#5D7C59] transition-colors appearance-none"
                  >
                    <option value="QUIZ">Quiz / Multiple Choice</option>
                    <option value="PROBLEM_SET">Problem Set / Short Answer</option>
                    <option value="ESSAY">Essay Prompt</option>
                    <option value="CODING">Coding Challenge</option>
                    <option value="SPREADSHEET">Spreadsheet Task</option>
                    <option value="FRONTEND">Frontend UI Task</option>
                    <option value="CASE_STUDY">Case Study Scenario</option>
                    <option value="PRESENTATION">File Submission Prompt</option>
                  </select>
                </div>

                {/* ── QUIZ settings ─────────────────────────────────────── */}
                {aiForm.type === 'QUIZ' && (
                  <div className="flex flex-col gap-3 p-3.5 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/20 rounded-xl">
                    <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Quiz Settings</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">No. of Questions</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range" min="3" max="20" step="1"
                            value={aiForm.quizCount}
                            onChange={e => setAiForm({ ...aiForm, quizCount: +e.target.value })}
                            className="flex-1 accent-[#5D7C59]"
                          />
                          <span className="text-sm font-bold text-[#5D7C59] w-6 text-right tabular-nums">{aiForm.quizCount}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Difficulty</label>
                        <select
                          value={aiForm.difficulty}
                          onChange={e => setAiForm({ ...aiForm, difficulty: e.target.value })}
                          className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white outline-none focus:border-[#5D7C59] appearance-none"
                        >
                          <option value="easy">Easy</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="hard">Hard</option>
                          <option value="mixed">Mixed</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Question Type</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: 'multiple_choice', label: 'Multiple Choice' },
                          { id: 'true_false',      label: 'True / False' },
                          { id: 'mixed',           label: 'Mixed' },
                        ].map(qt => (
                          <button key={qt.id} type="button"
                            onClick={() => setAiForm({ ...aiForm, quizType: qt.id })}
                            className={`px-2 py-2 rounded-lg border text-[11px] font-semibold transition-all text-center ${
                              aiForm.quizType === qt.id
                                ? 'bg-[#5D7C59]/10 border-[#5D7C59] text-[#5D7C59]'
                                : 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#5D7C59]/40'
                            }`}
                          >{qt.label}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── PROBLEM_SET settings ───────────────────────────────── */}
                {aiForm.type === 'PROBLEM_SET' && (
                  <div className="flex flex-col gap-3 p-3.5 bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-500/20 rounded-xl">
                    <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Problem Set Settings</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">No. of Problems</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range" min="2" max="10" step="1"
                            value={aiForm.problemCount}
                            onChange={e => setAiForm({ ...aiForm, problemCount: +e.target.value })}
                            className="flex-1 accent-[#5D7C59]"
                          />
                          <span className="text-sm font-bold text-[#5D7C59] w-6 text-right tabular-nums">{aiForm.problemCount}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Difficulty</label>
                        <select
                          value={aiForm.difficulty}
                          onChange={e => setAiForm({ ...aiForm, difficulty: e.target.value })}
                          className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white outline-none focus:border-[#5D7C59] appearance-none"
                        >
                          <option value="easy">Easy</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── ESSAY settings ─────────────────────────────────────── */}
                {aiForm.type === 'ESSAY' && (
                  <div className="flex flex-col gap-3 p-3.5 bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-500/20 rounded-xl">
                    <p className="text-[11px] font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">Essay Settings</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Target Word Count</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range" min="100" max="1500" step="50"
                            value={aiForm.wordCount}
                            onChange={e => setAiForm({ ...aiForm, wordCount: +e.target.value })}
                            className="flex-1 accent-[#5D7C59]"
                          />
                          <span className="text-[11px] font-bold text-[#5D7C59] w-12 text-right tabular-nums">{aiForm.wordCount}w</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Difficulty</label>
                        <select
                          value={aiForm.difficulty}
                          onChange={e => setAiForm({ ...aiForm, difficulty: e.target.value })}
                          className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white outline-none focus:border-[#5D7C59] appearance-none"
                        >
                          <option value="easy">Introductory</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="hard">Advanced</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── CODING settings ────────────────────────────────────── */}
                {aiForm.type === 'CODING' && (
                  <div className="flex flex-col gap-3 p-3.5 bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-500/20 rounded-xl">
                    <p className="text-[11px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">Coding Settings</p>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Programming Language</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'javascript', label: 'JavaScript' },
                          { id: 'python',     label: 'Python' },
                          { id: 'java',       label: 'Java' },
                          { id: 'cpp',        label: 'C++' },
                        ].map(lang => (
                          <button key={lang.id} type="button"
                            onClick={() => setAiForm({ ...aiForm, codingLanguage: lang.id })}
                            className={`px-3 py-2 rounded-xl border text-sm font-semibold transition-all text-left ${
                              aiForm.codingLanguage === lang.id
                                ? 'bg-[#5D7C59]/10 border-[#5D7C59] text-[#5D7C59]'
                                : 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-[#5D7C59]/50'
                            }`}
                          >{lang.label}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Difficulty</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['easy', 'intermediate', 'hard'].map(d => (
                          <button key={d} type="button"
                            onClick={() => setAiForm({ ...aiForm, difficulty: d })}
                            className={`py-2 rounded-xl border text-[11px] font-bold capitalize transition-all ${
                              aiForm.difficulty === d
                                ? 'bg-[#5D7C59]/10 border-[#5D7C59] text-[#5D7C59]'
                                : 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#5D7C59]/40'
                            }`}
                          >{d}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── FRONTEND settings ──────────────────────────────────── */}
                {aiForm.type === 'FRONTEND' && (
                  <div className="flex flex-col gap-3 p-3.5 bg-teal-50/50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-500/20 rounded-xl">
                    <p className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Frontend Settings</p>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">CSS Framework</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'native',    label: 'Native CSS',  desc: 'Vanilla' },
                          { id: 'tailwind',  label: 'Tailwind',    desc: 'Utility-first' },
                          { id: 'bootstrap', label: 'Bootstrap 5', desc: 'Components' },
                        ].map(fw => (
                          <button key={fw.id} type="button"
                            onClick={() => setAiForm({ ...aiForm, cssFramework: fw.id })}
                            className={`flex flex-col items-center gap-0.5 px-2 py-2.5 rounded-xl border text-center transition-all ${
                              aiForm.cssFramework === fw.id
                                ? 'bg-[#5D7C59]/10 border-[#5D7C59] text-[#5D7C59]'
                                : 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-[#5D7C59]/50'
                            }`}
                          >
                            <span className="text-[11px] font-bold">{fw.label}</span>
                            <span className="text-[9px] opacity-60">{fw.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Difficulty</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['beginner', 'intermediate', 'advanced'].map(d => (
                          <button key={d} type="button"
                            onClick={() => setAiForm({ ...aiForm, difficulty: d })}
                            className={`py-2 rounded-xl border text-[11px] font-bold capitalize transition-all ${
                              aiForm.difficulty === d
                                ? 'bg-[#5D7C59]/10 border-[#5D7C59] text-[#5D7C59]'
                                : 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#5D7C59]/40'
                            }`}
                          >{d}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── SPREADSHEET settings ───────────────────────────────── */}
                {aiForm.type === 'SPREADSHEET' && (
                  <div className="flex flex-col gap-3 p-3.5 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl">
                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Spreadsheet Settings</p>

                    {/* Tab switcher */}
                    <div className="flex gap-1 bg-white dark:bg-black/20 p-1 rounded-xl border border-gray-200 dark:border-white/10">
                      {[{ id: 'general', label: 'General' }, { id: 'business', label: 'Business / Accounting' }].map(tab => (
                        <button key={tab.id} type="button"
                          onClick={() => setAiForm({ ...aiForm, spreadsheetTab: tab.id })}
                          className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                            aiForm.spreadsheetTab === tab.id
                              ? 'bg-[#5D7C59] text-white shadow-sm'
                              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                          }`}
                        >{tab.label}</button>
                      ))}
                    </div>

                    {aiForm.spreadsheetTab === 'general' && (
                      <>
                        <div>
                          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Number of Columns</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range" min="2" max="8" step="1"
                              value={aiForm.spreadsheetColumns}
                              onChange={e => setAiForm({ ...aiForm, spreadsheetColumns: +e.target.value })}
                              className="flex-1 accent-[#5D7C59]"
                            />
                            <span className="text-sm font-bold text-[#5D7C59] w-6 text-right tabular-nums">{aiForm.spreadsheetColumns}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Task Type</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'data_entry', label: 'Data Entry' },
                              { id: 'formulas',   label: 'Formulas' },
                              { id: 'charts',     label: 'Analysis / Charts' },
                              { id: 'mixed',      label: 'Mixed' },
                            ].map(t => (
                              <button key={t.id} type="button"
                                onClick={() => setAiForm({ ...aiForm, spreadsheetTask: t.id })}
                                className={`py-2 px-3 rounded-xl border text-[11px] font-semibold transition-all text-left ${
                                  aiForm.spreadsheetTask === t.id
                                    ? 'bg-[#5D7C59]/10 border-[#5D7C59] text-[#5D7C59]'
                                    : 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#5D7C59]/40'
                                }`}
                              >{t.label}</button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {aiForm.spreadsheetTab === 'business' && (
                      <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Document Type</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'balance_sheet',    label: 'Balance Sheet',       icon: <Scale size={14} /> },
                            { id: 'income_statement', label: 'Income Statement',    icon: <BarChart2 size={14} /> },
                            { id: 'cash_flow',        label: 'Cash Flow Statement', icon: <Coins size={14} /> },
                            { id: 't_account',        label: 'T-Account Ledger',    icon: <Layout size={14} /> },
                            { id: 'trial_balance',    label: 'Trial Balance',       icon: <ClipboardList size={14} /> },
                            { id: 'journal_entries',  label: 'General Journal',     icon: <BookOpen size={14} /> },
                            { id: 'budget',           label: 'Budget Plan',         icon: <Wallet size={14} /> },
                            { id: 'inventory',        label: 'Inventory Ledger',    icon: <Package size={14} /> },
                          ].map(t => (
                            <button key={t.id} type="button"
                              onClick={() => setAiForm({ ...aiForm, spreadsheetTask: t.id })}
                              className={`flex items-center gap-2 py-2 px-3 rounded-xl border text-[11px] font-semibold transition-all text-left ${
                                aiForm.spreadsheetTask === t.id
                                  ? 'bg-[#5D7C59]/10 border-[#5D7C59] text-[#5D7C59]'
                                  : 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#5D7C59]/40'
                              }`}
                            >
                              <span className="opacity-70">{t.icon}</span> {t.label}
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2">AI will generate a pre-structured accounting document with proper rows, labels, and formulas.</p>
                      </div>
                    )}
                  </div>
                )}


                {/* ── CASE_STUDY settings ────────────────────────────────── */}
                {aiForm.type === 'CASE_STUDY' && (
                  <div className="flex flex-col gap-2 p-3.5 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl">
                    <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Case Study Settings</p>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Complexity</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['simple', 'moderate', 'complex'].map(d => (
                          <button key={d} type="button"
                            onClick={() => setAiForm({ ...aiForm, difficulty: d })}
                            className={`py-2 rounded-xl border text-[11px] font-bold capitalize transition-all ${
                              aiForm.difficulty === d
                                ? 'bg-[#5D7C59]/10 border-[#5D7C59] text-[#5D7C59]'
                                : 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#5D7C59]/40'
                            }`}
                          >{d}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Specific Instructions */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Additional Instructions <span className="font-normal text-gray-400">(Optional)</span></label>
                  <textarea
                    placeholder="e.g. Focus on real-world examples, add a bonus question..."
                    value={aiForm.instructions}
                    onChange={e => setAiForm({ ...aiForm, instructions: e.target.value })}
                    className="w-full h-16 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#5D7C59] transition-colors resize-none"
                  />
                </div>

              </div>
            </div>

            {/* Error */}
            {aiError && (
              <div className="mx-6 mt-3 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" /> {aiError}
              </div>
            )}

            {/* Actions */}
            <div className="px-6 py-4 flex items-center justify-between gap-3 border-t border-gray-100 dark:border-white/10 shrink-0">
              <button
                onClick={() => setShowAIModal(false)}
                className="px-5 py-2.5 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer border-none"
              >
                Cancel
              </button>
              <button
                onClick={handleAIGenerate}
                disabled={isAIGenerating || isTokensExhausted() || !hasEnough || !aiForm.topic.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-[#5D7C59] to-[#4A6447] text-white font-bold text-sm rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer border-none"
              >
                {isAIGenerating ? (
                  <><Loader2 size={15} className="animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles size={15} /> Generate Activity</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateActivityModal;
