import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getActivity } from '../../api/activity.api';
import { getAllSubmissions, gradeSubmission } from '../../api/submission.api';
import { ChevronLeft, Loader2, Search, CheckCircle, Clock, Save, File, Download, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import useAIStore from '../../store/ai.store';
import Loading from '../../components/common/Loading';
import ErrorState from '../../components/common/ErrorState';
import Spreadsheet from 'react-spreadsheet';

const CSS_FRAMEWORKS = [
  { id: 'native', name: 'Native CSS', cdn: '' },
  { id: 'tailwind', name: 'Tailwind CSS', cdn: '<script src="https://cdn.tailwindcss.com"></script>' },
  { id: 'bootstrap', name: 'Bootstrap 5', cdn: '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">' },
];

const ActivityGradebook = () => {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const targetStudentId = searchParams.get('studentId');
  
  const [activity, setActivity] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  
  // Grading State
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState({});
  const [generalFeedback, setGeneralFeedback] = useState('');
  const [isGrading, setIsGrading] = useState(false);
  const [isAIGrading, setIsAIGrading] = useState(false);
  const { isTokensExhausted, setVirtualTokens, setNextResetAt } = useAIStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actData, subData] = await Promise.all([
          getActivity(activityId),
          getAllSubmissions(activityId, 1, 100)
        ]);
        setActivity(actData);
        
        const fetchedSubs = subData.submissions || [];
        setSubmissions(fetchedSubs);

        if (targetStudentId) {
          const targetSub = fetchedSubs.find(s => s.studentId === targetStudentId);
          if (targetSub) {
            handleSelectSubmission(targetSub);
          }
        }
      } catch (err) {
        console.error(err);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activityId, targetStudentId]);

  const handleSelectSubmission = (sub) => {
    setSelectedSubmission(sub);
    // Initialize grading state
    const initialScores = {};
    const initialFeedback = {};
    sub.answers?.forEach(ans => {
      initialScores[ans.id] = ans.score ?? '';
      initialFeedback[ans.id] = ans.feedback || '';
    });
    setScores(initialScores);
    setFeedback(initialFeedback);
    setGeneralFeedback(sub.feedback || '');
  };

  const submitGrade = async () => {
    try {
      setIsGrading(true);
      const answersPayload = Object.entries(scores).map(([answerId, score]) => ({
        answerId,
        score: score === '' ? undefined : parseInt(score),
        feedback: feedback[answerId] || undefined
      })).filter(ans => ans.score !== undefined || ans.feedback !== undefined);

      const payload = {
        feedback: generalFeedback || undefined,
        answers: answersPayload.length > 0 ? answersPayload : undefined
      };

      const updatedSub = await gradeSubmission(selectedSubmission.id, payload);
      setSubmissions(prev => prev.map(s => s.id === updatedSub.id ? updatedSub : s));
      setSelectedSubmission(updatedSub);
      toast.success('Grade saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save grade. Please try again.');
    } finally {
      setIsGrading(false);
    }
  };

  const handleAIGrade = async () => {
    if (!selectedSubmission) return;
    try {
      setIsAIGrading(true);
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      const res = await fetch(`${baseUrl}/ai/grade-submission`, {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ submissionId: selectedSubmission.id })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 429) {
           setVirtualTokens(0);
           if (data.nextResetAt) setNextResetAt(data.nextResetAt);
           toast.error(data.message || 'Daily AI token limit reached.');
           return;
        }
        throw new Error(data.error || 'Failed to auto-grade');
      }

      if (data.grading) {
        const newScores = { ...scores };
        const newFeedback = { ...feedback };
        
        data.grading.grades?.forEach(g => {
          if (g.answerId && g.score !== undefined) newScores[g.answerId] = g.score;
          if (g.answerId && g.feedback) newFeedback[g.answerId] = g.feedback;
        });
        
        setScores(newScores);
        setFeedback(newFeedback);
        if (data.grading.generalFeedback) {
          setGeneralFeedback(data.grading.generalFeedback);
        }
        
        if (data.remainingTokens !== undefined) {
          window.dispatchEvent(new CustomEvent('aiTokensUpdate', { detail: data.remainingTokens }));
        }
        toast.success('AI Grading Complete! Review the scores below.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to generate AI grades.');
    } finally {
      setIsAIGrading(false);
    }
  };

  if (loading) return <Loading text="Loading submissions..." />;
  if (fetchError) return <ErrorState title="Failed to load gradebook" message="We couldn't fetch the submissions. Check your connection and try again." onRetry={() => { setFetchError(false); setLoading(true); }} />;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAFCFA] dark:bg-[#121612] font-sans">
      <div className="bg-white dark:bg-[#1A211A] px-4 md:px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center gap-3 sticky top-0 z-10 shadow-sm shrink-0">
        {selectedSubmission ? (
          <button 
            onClick={() => setSelectedSubmission(null)} 
            className="p-2 shrink-0 bg-gray-100 dark:bg-white/5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border-none cursor-pointer md:hidden"
          >
            <ChevronLeft size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
        ) : (
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 shrink-0 bg-gray-100 dark:bg-white/5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors border-none cursor-pointer"
          >
            <ChevronLeft size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
        )}
        <div className="min-w-0">
          <span className="text-sm md:text-base font-bold text-gray-900 dark:text-white line-clamp-1">Gradebook: {activity?.title}</span>
          <p className="text-[11px] text-gray-400 dark:text-gray-500">
            {submissions.length} Submissions
          </p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Submission List */}
        <div className={`w-full md:w-80 bg-white dark:bg-[#1A211A] border-r border-gray-100 dark:border-white/10 flex flex-col overflow-y-auto shrink-0 ${selectedSubmission ? 'hidden md:flex' : 'flex'}`}>
          {submissions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No submissions yet.</div>
          ) : (
            <div className="flex flex-col p-4 gap-2">
              {submissions.map(sub => (
                <div 
                  key={sub.id} 
                  onClick={() => handleSelectSubmission(sub)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    selectedSubmission?.id === sub.id 
                      ? 'bg-gradient-to-r from-[#4A6447] to-[#5D7C59] border-transparent text-white shadow-md' 
                      : 'bg-[#FAFCFA] dark:bg-[#232B23] border-gray-100 dark:border-white/5 hover:border-[#5D7C59]/30 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <p className="font-bold text-[14px]">
                    {sub.Student?.profile?.firstName 
                      ? `${sub.Student.profile.firstName} ${sub.Student.profile.lastName}`
                      : sub.Student?.email || 'Unknown Student'}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      selectedSubmission?.id === sub.id ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                    }`}>
                      {sub.status.replace('_', ' ')}
                    </span>
                    <span className={`text-[12px] font-bold ${selectedSubmission?.id === sub.id ? 'text-[#FFC700]' : 'text-[#5D7C59] dark:text-[#7A9A7B]'}`}>
                      {sub.totalScore !== null ? `${sub.totalScore}/${activity.totalPoints}` : 'Not Graded'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Grading UI */}
        <div className={`flex-1 overflow-y-auto p-4 md:p-8 flex justify-center ${!selectedSubmission ? 'hidden md:flex' : 'flex'}`}>
          {!selectedSubmission ? (
            <div className="text-gray-400 dark:text-gray-600 text-center mt-20 hidden md:block">
              Select a submission from the list to start grading
            </div>
          ) : (
            <div className="max-w-3xl w-full flex flex-col gap-6">
              <div className="bg-white dark:bg-[#1A211A] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 sticky top-0 z-10">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedSubmission.Student?.profile?.firstName 
                      ? `${selectedSubmission.Student.profile.firstName} ${selectedSubmission.Student.profile.lastName}`
                      : selectedSubmission.Student?.email || 'Unknown Student'}
                  </h2>
                  <p className="text-sm text-gray-500">Submitted on {new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button 
                    onClick={handleAIGrade}
                    disabled={isAIGrading || isGrading || isTokensExhausted()}
                    className="flex-1 md:flex-none px-4 py-2.5 bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-bold text-sm rounded-xl transition-all border-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isAIGrading ? <Loader2 size={16} className="animate-spin" /> : <><Sparkles size={16} /> AI</>}
                  </button>
                  <button 
                    onClick={submitGrade}
                    disabled={isGrading || isAIGrading}
                    className="flex-1 md:flex-none px-6 py-2.5 bg-[#FFC700] hover:bg-[#FFD633] text-gray-900 font-extrabold text-sm rounded-xl shadow-md transition-all border-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isGrading ? <Loader2 size={16} className="animate-spin" /> : 'Save'}
                  </button>
                </div>
              </div>

              {activity.questions?.map(q => {
                const ans = selectedSubmission.answers?.find(a => a.questionId === q.id);
                return (
                  <div key={q.id} className="bg-white dark:bg-[#1A211A] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 flex flex-col gap-4">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">{q.content}</h3>
                      <span className="text-[11px] font-bold text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md shrink-0">{q.points} Pts</span>
                    </div>
                    
                    <div className="bg-[#FAFCFA] dark:bg-[#232B23] p-4 rounded-xl border border-gray-200 dark:border-white/5 text-[14px] text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                      {ans?.content?.text && <div>{ans.content.text}</div>}
                      {ans?.content?.selectedId && (
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-[#5D7C59]" />
                          <span>{q.options?.find(o => o.id === ans.content.selectedId)?.text || ans.content.selectedId}</span>
                        </div>
                      )}
                      {ans?.content?.selectedIds && (
                        <div className="flex flex-col gap-1">
                          {ans.content.selectedIds.map(id => (
                            <div key={id} className="flex items-center gap-2">
                              <CheckCircle size={16} className="text-[#5D7C59]" />
                              <span>{q.options?.find(o => o.id === id)?.text || id}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {ans?.content?.data && (
                        <div className="overflow-x-auto">
                          <Spreadsheet data={ans.content.data} />
                        </div>
                      )}
                      {ans?.content?.fileUrl && (
                        <div className="flex items-center gap-3">
                          <File size={20} className="text-[#5D7C59]" />
                          <span className="text-sm truncate">{ans.content.fileName || 'Uploaded File'}</span>
                          <a 
                            href={ans.content.fileUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-1.5 text-gray-400 hover:text-[#5D7C59] transition-colors rounded-lg bg-black/5 dark:bg-white/5"
                            title="Download"
                          >
                            <Download size={14} />
                          </a>
                        </div>
                      )}
                      {ans?.content?.code && (
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-bold text-[#5D7C59] uppercase tracking-widest">{ans.content.language} Code</span>
                          <pre className="bg-[#1e1e1e] text-gray-300 p-4 rounded-lg text-xs font-mono overflow-x-auto">
                            {ans.content.code}
                          </pre>
                          {ans.content.output && (
                            <>
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Output</span>
                              <pre className="bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 p-3 rounded-lg text-[11px] font-mono whitespace-pre-wrap">
                                {ans.content.output}
                              </pre>
                            </>
                          )}
                        </div>
                      )}
                      {ans?.content?.html !== undefined && (() => {
                        const framework = CSS_FRAMEWORKS.find(fw => fw.id === (ans.content.cssFramework || 'native')) || CSS_FRAMEWORKS[0];
                        const srcDoc = `
                          <!DOCTYPE html>
                          <html>
                            <head>
                              <meta charset="UTF-8">
                              <meta name="viewport" content="width=device-width, initial-scale=1.0">
                              ${framework.cdn}
                              <style>${ans.content.css || ''}</style>
                            </head>
                            <body>
                              ${ans.content.html || ''}
                              <script>
                                try {
                                  ${ans.content.js || ''}
                                } catch (err) {
                                  console.error(err);
                                }
                              </script>
                            </body>
                          </html>
                        `;
                        return (
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                              <span className="text-xs font-bold text-[#5D7C59] uppercase tracking-widest">Live Preview</span>
                              <div className="bg-white rounded-xl shadow-inner border border-gray-200 overflow-hidden" style={{ minHeight: '200px' }}>
                                <iframe
                                  title="Frontend Preview"
                                  srcDoc={srcDoc}
                                  className="w-full h-full min-h-[200px] border-none bg-white"
                                  sandbox="allow-scripts allow-modals allow-same-origin"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                      {!ans?.content?.text && !ans?.content?.code && !ans?.content?.selectedId && !ans?.content?.selectedIds && !ans?.content?.data && !ans?.content?.fileUrl && ans?.content?.html === undefined && <span className="text-gray-400 italic">No answer provided</span>}
                    </div>

                    {ans && (
                      <div className="flex gap-4 mt-2">
                        <div className="w-24 shrink-0">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Score</label>
                          <input 
                            type="number" 
                            max={q.points}
                            min={0}
                            value={scores[ans.id] ?? ''}
                            onChange={(e) => setScores(prev => ({ ...prev, [ans.id]: e.target.value }))}
                            className="w-full bg-white dark:bg-[#1A211A] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-bold focus:border-[#5D7C59] outline-none"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Feedback</label>
                          <input 
                            type="text" 
                            placeholder="Feedback..."
                            value={feedback[ans.id] || ''}
                            onChange={(e) => setFeedback(prev => ({ ...prev, [ans.id]: e.target.value }))}
                            className="w-full bg-white dark:bg-[#1A211A] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#5D7C59] outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="bg-white dark:bg-[#1A211A] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 mb-8">
                <label className="text-[12px] font-bold text-[#5D7C59] dark:text-[#7A9A7B] uppercase tracking-widest block mb-2">Overall Feedback</label>
                <textarea 
                  value={generalFeedback}
                  onChange={(e) => setGeneralFeedback(e.target.value)}
                  placeholder="General feedback..."
                  className="w-full bg-[#FAFCFA] dark:bg-[#232B23] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#5D7C59] outline-none min-h-[100px] resize-y"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityGradebook;
