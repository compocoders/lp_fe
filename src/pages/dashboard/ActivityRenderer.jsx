import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivity } from '../../api/activity.api';
import { submitActivity, getMySubmission } from '../../api/submission.api';
import { ChevronLeft, Loader2, Play, Check } from 'lucide-react';
import { toast } from 'sonner';
import useAuthStore from '../../store/auth.store';
import Loading from '../../components/common/Loading';
import ErrorState from '../../components/common/ErrorState';
import CodingRenderer from '../../components/classroom/CodingRenderer';
import MultipleChoiceRenderer from '../../components/classroom/MultipleChoiceRenderer';
import SpreadsheetRenderer from '../../components/classroom/SpreadsheetRenderer';
import FileUploadRenderer from '../../components/classroom/FileUploadRenderer';
import CaseStudyRenderer from '../../components/classroom/CaseStudyRenderer';
import FrontendRenderer from '../../components/classroom/FrontendRenderer';

// Helper component for rendering Text Input (Short Answer, Essay, Problem Set)
const TextAnswerRenderer = ({ question, value, onChange, disabled }) => {
  return (
    <div className="bg-white dark:bg-[#1A211A] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap">
          {question.content}
        </h3>
        <span className="text-[11px] font-bold text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md shrink-0">
          {question.points} Pts
        </span>
      </div>
      <textarea
        value={value?.text || ''}
        onChange={(e) => onChange(question.id, { text: e.target.value })}
        disabled={disabled}
        placeholder="Type your answer here..."
        className="w-full bg-[#FAFCFA] dark:bg-[#232B23] rounded-xl px-4 py-3 text-[14px] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/10 outline-none focus:border-[#5D7C59] transition-colors min-h-[140px] resize-y disabled:opacity-60"
      />
    </div>
  );
};

const ActivityRenderer = () => {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [activity, setActivity] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  
  const [isStarted, setIsStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actData, subData] = await Promise.all([
          getActivity(activityId),
          getMySubmission(activityId).catch(() => null)
        ]);
        setActivity(actData);
        setSubmission(subData);
      } catch (err) {
        console.error(err);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activityId]);

  const retry = () => {
    setFetchError(false);
    setLoading(true);
    getActivity(activityId)
      .then(setActivity)
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  };

  // Load draft from local storage when user data is available
  useEffect(() => {
    if (activityId && user?.id && !submission) {
      const draftKey = `activity_draft_${activityId}_${user.id}`;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          if (parsed.answers && Object.keys(parsed.answers).length > 0) {
            setAnswers(prev => Object.keys(prev).length === 0 ? parsed.answers : prev);
          }
          if (parsed.isStarted) {
            setIsStarted(true);
          }
        } catch(e) {
          console.error('Failed to parse activity draft', e);
        }
      }
    }
  }, [activityId, user?.id, submission]);

  // Save draft to local storage whenever answers or isStarted changes
  useEffect(() => {
    if (activityId && user?.id && isStarted && !submission) {
      const draftKey = `activity_draft_${activityId}_${user.id}`;
      localStorage.setItem(draftKey, JSON.stringify({ answers, isStarted }));
    }
  }, [answers, isStarted, activityId, user?.id, submission]);

  const handleAnswerChange = (questionId, content) => {
    setAnswers(prev => ({ ...prev, [questionId]: content }));
  };

  const handleSubmit = async () => {
    const answerPayload = Object.entries(answers).map(([questionId, content]) => ({
      questionId,
      content
    }));

    if (answerPayload.length === 0) {
      toast.warning('Please answer at least one question before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await submitActivity(activityId, answerPayload);
      setSubmission(result);
      toast.success('Activity submitted successfully!');
      // Clear draft upon successful submission
      if (user?.id) {
        localStorage.removeItem(`activity_draft_${activityId}_${user.id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading text="Loading activity..." />;
  if (fetchError) return <ErrorState title="Failed to load activity" message="We couldn't fetch this activity. Check your connection and try again." onRetry={retry} />;
  if (!activity) return <ErrorState title="Activity not found" message="This activity may have been deleted or you don't have access." />;

  const isTeacher = user?.id === activity.Classroom?.ownerId;

  // Determine which UI state to show
  const showIntro = !isStarted && !submission;
  const showActive = isStarted && !submission;
  const showResult = !!submission;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAFCFA] dark:bg-[#121612] font-sans">
      {/* Header */}
      <div className="bg-white dark:bg-[#1A211A] px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between sticky top-0 z-10 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 mr-2 bg-gray-100 dark:bg-white/5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border-none cursor-pointer"
          >
            <ChevronLeft size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <span className="text-base font-bold text-gray-900 dark:text-white">{activity.title}</span>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              {activity.activityType || 'Activity'} • {activity.totalPoints} Points
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {showActive && (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#FFC700] hover:bg-[#FFD633] text-gray-900 font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all border-none cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Submit Activity'}
            </button>
          )}
          {isTeacher && (
            <button 
              onClick={() => navigate(`/dashboard/activity/${activityId}/gradebook`)}
              className="px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-800 dark:text-white rounded-xl text-sm font-bold transition-all border-none cursor-pointer"
            >
              Grade Submissions
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full flex flex-col gap-6">
        
        {/* Intro view */}
        {showIntro && (
          <>
            {activity.description && (
              <div className="bg-white dark:bg-[#1A211A] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Instructions</h3>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {activity.description}
                </p>
              </div>
            )}
            <div className="bg-white dark:bg-[#1A211A] rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-white/10 flex flex-col items-center justify-center text-center mt-4">
              <div className="w-16 h-16 rounded-2xl bg-[#5D7C59]/10 flex items-center justify-center mb-4">
                <Play size={28} className="text-[#5D7C59]" fill="currentColor" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Ready to start?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
                This activity has {activity.questions?.length || 0} question(s) worth {activity.totalPoints} points in total. Good luck!
              </p>
              <button 
                onClick={() => setIsStarted(true)}
                className="px-6 py-3 bg-[#5D7C59] hover:bg-[#4A6447] text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all border-none cursor-pointer"
              >
                Begin Activity
              </button>
            </div>
          </>
        )}

        {/* Active answering view */}
        {showActive && (
          <>
            {activity.description && (
              <div className="bg-white dark:bg-[#1A211A] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-white/10 mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                  {activity.description}
                </p>
              </div>
            )}
            
            <div className="flex flex-col gap-5">
              {activity.questions?.map((q, idx) => {
                // Determine which renderer to use based on question type
                // For now we map short_answer, essay, problem_set all to the TextAnswerRenderer
                const isTextBased = ['short_answer', 'essay', 'problem_set'].includes(q.questionType) || activity.activityType === 'PROBLEM_SET' || activity.activityType === 'ESSAY';
                
                const isCoding = ['coding_problem'].includes(q.questionType) || activity.activityType === 'CODING';
                const isMultipleChoice = ['multiple_choice', 'checkbox'].includes(q.questionType) || activity.activityType === 'QUIZ';
                const isSpreadsheet = ['spreadsheet_problem'].includes(q.questionType) || activity.activityType === 'SPREADSHEET';
                const isFileUpload = ['file_upload'].includes(q.questionType) || activity.activityType === 'PRESENTATION';
                const isCaseStudy = ['case_study_problem'].includes(q.questionType) || activity.activityType === 'CASE_STUDY';
                const isFrontend = ['frontend_problem'].includes(q.questionType) || activity.activityType === 'FRONTEND';

                if (isFrontend) {
                  return (
                    <FrontendRenderer
                      key={q.id}
                      question={q}
                      value={answers[q.id]}
                      onChange={handleAnswerChange}
                    />
                  );
                }

                if (isCaseStudy) {
                  return (
                    <CaseStudyRenderer
                      key={q.id}
                      question={q}
                      value={answers[q.id]}
                      onChange={handleAnswerChange}
                    />
                  );
                }

                if (isTextBased) {
                  return (
                    <TextAnswerRenderer 
                      key={q.id} 
                      question={q} 
                      value={answers[q.id]} 
                      onChange={handleAnswerChange} 
                    />
                  );
                }

                if (isCoding) {
                  return (
                    <CodingRenderer
                      key={q.id}
                      question={q}
                      value={answers[q.id]}
                      onChange={handleAnswerChange}
                    />
                  );
                }

                if (isSpreadsheet) {
                  return (
                    <SpreadsheetRenderer
                      key={q.id}
                      question={q}
                      value={answers[q.id]}
                      onChange={handleAnswerChange}
                    />
                  );
                }

                if (isFileUpload) {
                  return (
                    <FileUploadRenderer
                      key={q.id}
                      question={q}
                      value={answers[q.id]}
                      onChange={handleAnswerChange}
                    />
                  );
                }

                if (isMultipleChoice) {
                  return (
                    <MultipleChoiceRenderer
                      key={q.id}
                      question={q}
                      value={answers[q.id]}
                      onChange={handleAnswerChange}
                    />
                  );
                }
                
                return (
                  <div key={q.id} className="bg-white dark:bg-[#1A211A] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
                    <p className="text-sm text-gray-500 mb-2">Renderer for {q.questionType} is not yet implemented.</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Completed/Submitted view */}
        {showResult && (
          <div className="flex flex-col gap-6">
            <div className="bg-gradient-to-br from-[#5D7C59] to-[#4A6447] rounded-3xl p-8 text-center flex flex-col items-center justify-center shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 relative z-10">
                <Check size={32} className="text-white" strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-black text-white mb-2 relative z-10">Activity Submitted!</h2>
              <p className="text-white/80 text-sm max-w-sm mx-auto relative z-10">
                Your answers have been recorded. You can review your submission below.
              </p>
              
              <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-center gap-8 w-full max-w-md relative z-10">
                <div>
                  <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mb-1">Total Score</p>
                  <p className="text-3xl font-black text-[#FFC700]">
                    {submission.totalScore !== null ? submission.totalScore : '-'}
                    <span className="text-lg text-white/50 ml-1">/ {activity.totalPoints}</span>
                  </p>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div>
                  <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mb-1">Status</p>
                  <p className="text-lg font-bold text-white capitalize">{submission.status.replace('_', ' ')}</p>
                </div>
              </div>
            </div>

            {/* Readonly answers review */}
            <div className="flex flex-col gap-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white px-2 mt-4">Your Answers</h3>
              {activity.questions?.map((q) => {
                // Find student's answer for this question
                const submittedAnswer = submission.answers?.find(a => a.questionId === q.id);
                
                return (
                  <div key={q.id} className="bg-white dark:bg-[#1A211A] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap">
                        {q.content}
                      </h3>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-[11px] font-bold text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md mb-1">
                          {q.points} Pts
                        </span>
                        {submittedAnswer?.score !== null && submittedAnswer?.score !== undefined && (
                          <span className={`text-[12px] font-bold px-2 py-1 rounded-md ${
                            submittedAnswer.score === q.points 
                              ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' 
                              : submittedAnswer.score > 0 
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                          }`}>
                            Score: {submittedAnswer.score}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="w-full bg-[#FAFCFA] dark:bg-[#232B23] rounded-xl p-4 text-[14px] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/10 opacity-75">
                      {submittedAnswer?.content?.text && <div>{submittedAnswer.content.text}</div>}
                      {submittedAnswer?.content?.selectedId && (
                        <div className="flex items-center gap-2">
                          <Check size={16} className="text-[#5D7C59]" />
                          <span>{q.options?.find(o => o.id === submittedAnswer.content.selectedId)?.text || submittedAnswer.content.selectedId}</span>
                        </div>
                      )}
                      {submittedAnswer?.content?.selectedIds && (
                        <div className="flex flex-col gap-1">
                          {submittedAnswer.content.selectedIds.map(id => (
                            <div key={id} className="flex items-center gap-2">
                              <Check size={16} className="text-[#5D7C59]" />
                              <span>{q.options?.find(o => o.id === id)?.text || id}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {submittedAnswer?.content?.data && (
                        <div className="text-xs italic text-gray-500">Spreadsheet submitted successfully.</div>
                      )}
                      {submittedAnswer?.content?.fileUrl && (
                        <a href={submittedAnswer.content.fileUrl} target="_blank" rel="noreferrer" className="text-[#5D7C59] hover:underline flex items-center gap-2">
                          View {submittedAnswer.content.fileName || 'Attached File'}
                        </a>
                      )}
                      {submittedAnswer?.content?.code && (
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-bold text-[#5D7C59] uppercase tracking-widest">{submittedAnswer.content.language} Code</span>
                          <pre className="bg-[#1e1e1e] text-gray-300 p-4 rounded-lg text-xs font-mono overflow-x-auto">
                            {submittedAnswer.content.code}
                          </pre>
                          {submittedAnswer.content.output && (
                            <>
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Output</span>
                              <pre className="bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 p-3 rounded-lg text-[11px] font-mono whitespace-pre-wrap">
                                {submittedAnswer.content.output}
                              </pre>
                            </>
                          )}
                        </div>
                      )}
                      {submittedAnswer?.content?.html !== undefined && (
                        <div className="flex flex-col gap-2 mt-2">
                          <span className="text-xs font-bold text-[#5D7C59] uppercase tracking-widest">Frontend UI Solution</span>
                          <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden mt-1 bg-white">
                            <div className="bg-gray-100 dark:bg-[#232B23] p-2 text-xs font-bold text-gray-500 uppercase flex items-center justify-between border-b border-gray-200 dark:border-white/10">
                              <span>Live Preview ({submittedAnswer.content.cssFramework || 'native'})</span>
                            </div>
                            <iframe
                              className="w-full h-[400px] bg-white border-none"
                              srcDoc={`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${submittedAnswer.content.cssFramework === 'tailwind' ? '<script src="https://cdn.tailwindcss.com"></script>' : submittedAnswer.content.cssFramework === 'bootstrap' ? '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">' : ''}<style>${submittedAnswer.content.css}</style></head><body>${submittedAnswer.content.html}<script>${submittedAnswer.content.js}</script></body></html>`}
                              sandbox="allow-scripts"
                            />
                          </div>
                        </div>
                      )}
                      {!submittedAnswer?.content?.text && !submittedAnswer?.content?.code && !submittedAnswer?.content?.html && <span className="text-gray-400 italic">No answer provided</span>}
                    </div>
                    
                    {submittedAnswer?.feedback && (
                      <div className="mt-2 bg-[#5D7C59]/10 rounded-xl p-4 border border-[#5D7C59]/20">
                        <p className="text-[11px] font-bold text-[#5D7C59] uppercase tracking-wider mb-1">Teacher Feedback</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{submittedAnswer.feedback}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ActivityRenderer;
