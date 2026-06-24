import React, { useState, useEffect } from 'react';
import { ClipboardList, Code, Grid, AlignLeft, FileText, UploadCloud, ChevronLeft, Calendar, LayoutTemplate, Loader2 } from 'lucide-react';
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
      
      // Formatting payload
      const payload = { ...activityData, status: 'published' };
      if (!payload.deadline) {
        delete payload.deadline;
      } else {
        payload.deadline = new Date(payload.deadline).toISOString();
      }
      
      if (payload.activityType === 'FRONTEND' && payload.questions.length > 0 && !payload.questions[0].content?.trim()) {
        payload.questions[0].content = 'Build the UI based on the instructions or mockup provided.';
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
      <div className="bg-white dark:bg-[#1A211A] px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between sticky top-0 z-10 shadow-sm shrink-0 transition-colors duration-200">
        <div className="flex items-center gap-3">
          {step === 2 && (
            <button onClick={() => setStep(1)} className="p-2 mr-2 bg-gray-100 dark:bg-white/5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border-none cursor-pointer">
              <ChevronLeft size={18} className="text-gray-600 dark:text-gray-300" />
            </button>
          )}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5D7C59] to-[#4A6447] flex items-center justify-center">
            <ClipboardList size={18} className="text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-gray-900 dark:text-white">Activity Builder</span>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">{step === 1 ? 'Select Activity Type' : 'Configure Activity'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors border-none bg-transparent cursor-pointer">Cancel</button>
          {step === 2 && (
            <button 
              onClick={() => handleSave(classroomId)} 
              disabled={isSaving}
              className="px-5 py-2 bg-gradient-to-r from-[#5D7C59] to-[#4A6447] text-white rounded-xl text-sm font-bold shadow-sm shadow-[#5D7C59]/20 hover:shadow-md hover:from-[#4A6447] hover:to-[#3A4E38] transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer flex items-center justify-center min-w-[120px]"
            >
              {isSaving ? (
                <><Loader2 size={14} className="animate-spin" /> Saving...</>
              ) : 'Save Activity'}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl w-full mx-auto px-5 py-8 flex flex-col gap-6">
        {step === 1 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">What kind of activity are you creating?</h2>
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
              <div className="px-6 py-6 flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Activity Title"
                  value={activityData.title}
                  onChange={e => setActivityData({ ...activityData, title: e.target.value })}
                  className="w-full border-none text-2xl font-bold text-gray-900 dark:text-white py-2 outline-none bg-transparent"
                  style={{ borderBottom: '2px solid #e5e7eb' }}
                  onFocus={e => { e.currentTarget.style.borderBottomColor = '#5D7C59'; }}
                  onBlur={e => { e.currentTarget.style.borderBottomColor = '#e5e7eb'; }}
                />
                <input
                  type="text"
                  placeholder="Instructions or description (optional)"
                  value={activityData.description}
                  onChange={e => setActivityData({ ...activityData, description: e.target.value })}
                  className="w-full border-none text-sm text-gray-500 dark:text-gray-400 py-1 outline-none bg-transparent"
                  style={{ borderBottom: '1px solid #e5e7eb' }}
                  onFocus={e => { e.currentTarget.style.borderBottomColor = '#5D7C59'; }}
                  onBlur={e => { e.currentTarget.style.borderBottomColor = '#e5e7eb'; }}
                />
                
                <div className="flex gap-4 mt-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 block mb-1">Total Points</label>
                    <input 
                      type="number" 
                      value={activityData.totalPoints}
                      onChange={e => setActivityData({ ...activityData, totalPoints: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#FAFCFA] dark:bg-[#232B23] rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/10 outline-none" 
                    />
                  </div>
                  <div className="flex-1">
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
    </div>
  );
};

export default CreateActivityModal;

