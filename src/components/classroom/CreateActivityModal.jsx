import React, { useState, useEffect } from 'react';
import { ClipboardList, Code, Grid, AlignLeft, FileText, UploadCloud, ChevronLeft, Calendar, LayoutTemplate, Loader2, Sparkles, AlertCircle } from 'lucide-react';
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
  const [aiForm, setAiForm] = useState({ topic: '', gradeLevel: '', type: 'QUIZ', instructions: '' });
  const [aiError, setAiError] = useState('');
  
  const { isTokensExhausted, setVirtualTokens, setNextResetAt } = useAIStore();

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
          title: `AI Generated: ${aiForm.topic}`,
          description: '',
          activityType: aiForm.type,
          questions: [{ id: Date.now().toString(), questionType: defaultQType, content: content, points: 100 }]
        });
      } else {
        setActivityData({
          ...activityData,
          title: `AI Generated: ${aiForm.topic}`,
          description: '',
          activityType: aiForm.type,
          questions: content
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
        <div className="fixed inset-0 bg-black/60 z-[1001] flex items-center justify-center backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-[#1A211A] rounded-2xl w-full max-w-md p-6 shadow-2xl relative border border-gray-100 dark:border-white/10" style={{ animation: 'slideUpIn 0.2s ease-out' }}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="text-[#5D7C59]"><Sparkles size={20} /></span> Generate Activity
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Let the AI do the heavy lifting. Just provide a topic and grade level.</p>
            
            <div className="flex flex-col gap-4">
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
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Specific Instructions (Optional)</label>
                <textarea 
                  placeholder="e.g. Focus on practical examples, or make it a 5-question true/false quiz..."
                  value={aiForm.instructions}
                  onChange={e => setAiForm({ ...aiForm, instructions: e.target.value })}
                  className="w-full h-24 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#5D7C59] transition-colors resize-none"
                />
              </div>
            </div>

            {aiError && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-start gap-2">
                <AlertCircle size={18} className="mt-0.5" /> {aiError}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setShowAIModal(false)}
                className="px-5 py-2.5 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer border-none"
              >
                Cancel
              </button>
              <button 
                onClick={handleAIGenerate}
                disabled={isAIGenerating || isTokensExhausted() || !aiForm.topic.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-[#5D7C59] to-[#4A6447] text-white font-bold text-sm rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer border-none"
              >
                {isAIGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Generate
                  </>
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
