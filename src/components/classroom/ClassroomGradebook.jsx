import React, { useEffect, useState } from 'react';
import { getClassroomGradebook } from '../../api/submission.api';
import { Users, Search, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Loading from '../common/Loading';
import ErrorState from '../common/ErrorState';

const ClassroomGradebook = ({ classroomId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGradebook = async () => {
      try {
        const gradebookData = await getClassroomGradebook(classroomId);
        setData(gradebookData);
      } catch (err) {
        console.error(err);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };
    if (classroomId) fetchGradebook();
  }, [classroomId]);

  if (loading) return <Loading variant="inline" text="Loading gradebook..." />;
  if (fetchError) return <ErrorState title="Failed to load gradebook" message="Could not fetch the gradebook data." onRetry={() => { setFetchError(false); setLoading(true); }} />;

  const activities = data?.activities || [];
  let students = data?.students || [];

  if (search.trim()) {
    const q = search.toLowerCase();
    students = students.filter(s => 
      s.student?.profile?.firstName?.toLowerCase().includes(q) || 
      s.student?.profile?.lastName?.toLowerCase().includes(q)
    );
  }

  if (activities.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#FAFCFA] dark:bg-[#121612] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#5D7C59]/10 flex items-center justify-center mb-4">
          <Users size={32} className="text-[#5D7C59]/50" />
        </div>
        <h3 className="text-gray-900 dark:text-white font-bold text-lg">No Gradebook Data</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center max-w-sm">Create activities to start populating the gradebook.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white dark:bg-[#1A211A] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
      <div className="shrink-0 px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-[#FAFCFA] dark:bg-[#232B23]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#5D7C59]/10 flex items-center justify-center">
            <Users size={20} className="text-[#5D7C59]" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">Master Gradebook</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{students.length} Students</p>
          </div>
        </div>
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={14} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1A211A] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-[#5D7C59] transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white dark:bg-[#1A211A]">
        <table className="w-full text-left border-collapse min-w-max">
          <thead className="bg-[#FAFCFA] dark:bg-[#232B23] sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="p-4 border-b border-gray-200 dark:border-white/10 font-bold text-xs text-gray-500 uppercase tracking-wider sticky left-0 bg-[#FAFCFA] dark:bg-[#232B23] z-20 min-w-[200px]">
                Student
              </th>
              {activities.map(act => (
                <th key={act.id} className="p-4 border-b border-gray-200 dark:border-white/10 min-w-[140px]">
                  <div 
                    onClick={() => navigate(`/dashboard/activity/${act.id}`)}
                    className="flex flex-col gap-1 cursor-pointer group"
                  >
                    <span className="font-bold text-[13px] text-gray-800 dark:text-gray-200 group-hover:text-[#5D7C59] transition-colors truncate max-w-[120px]" title={act.title}>
                      {act.title}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded w-max">
                      {act.totalPoints} Pts
                    </span>
                  </div>
                </th>
              ))}
              <th className="p-4 border-b border-gray-200 dark:border-white/10 font-bold text-[13px] text-gray-800 dark:text-gray-200 text-right min-w-[120px]">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((row, i) => {
              const studentName = `${row.student?.profile?.firstName} ${row.student?.profile?.lastName}`;
              const studentTotalEarned = row.grades.reduce((sum, g) => sum + (g.submission?.totalScore || 0), 0);
              const classTotalPossible = activities.reduce((sum, a) => sum + (a.totalPoints || 0), 0);
              const percentage = classTotalPossible > 0 ? Math.round((studentTotalEarned / classTotalPossible) * 100) : 0;

              return (
                <tr key={row.student.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-[#2A342A] transition-colors group">
                  <td className="p-4 sticky left-0 bg-white dark:bg-[#1A211A] group-hover:bg-gray-50 dark:group-hover:bg-[#2A342A] border-r border-gray-100 dark:border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5D7C59] to-[#4A6447] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                      {row.student?.profile?.firstName?.charAt(0)}{row.student?.profile?.lastName?.charAt(0)}
                    </div>
                    <span className="font-semibold text-[13px] text-gray-800 dark:text-gray-200 truncate max-w-[140px]">{studentName}</span>
                  </td>
                  {row.grades.map(g => {
                    const sub = g.submission;
                    const isGraded = sub?.status === 'graded';
                    const isSubmitted = sub?.status === 'submitted' || sub?.status === 'late';
                    
                    return (
                      <td key={g.activityId} className="p-4 align-middle">
                        <div 
                          onClick={() => navigate(`/dashboard/activity/${g.activityId}`)}
                          className="flex items-center gap-2 cursor-pointer group/cell"
                        >
                          <div className={`w-2 h-2 rounded-full shrink-0 ${isGraded ? 'bg-[#5D7C59]' : isSubmitted ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'}`} />
                          {isGraded ? (
                            <span className="font-bold text-[13px] text-[#5D7C59] dark:text-[#7A9A7B] group-hover/cell:underline">
                              {sub.totalScore} <span className="text-[10px] text-gray-400 font-medium">/ {g.totalPoints}</span>
                            </span>
                          ) : isSubmitted ? (
                            <span className="text-[11px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded group-hover/cell:underline">Needs Grading</span>
                          ) : (
                            <span className="text-[11px] text-gray-400 font-medium">Missing</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="p-4 text-right">
                    <div className="font-black text-[14px] text-gray-900 dark:text-white">{percentage}%</div>
                    <div className="text-[10px] font-bold text-gray-400">{studentTotalEarned} / {classTotalPossible}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassroomGradebook;
