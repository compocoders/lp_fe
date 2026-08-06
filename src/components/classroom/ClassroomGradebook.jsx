import React, { useEffect, useState } from 'react';
import { getClassroomGradebook } from '../../api/submission.api';
import { Users, Search } from 'lucide-react';
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
  if (fetchError)
    return (
      <ErrorState
        title="Failed to load gradebook"
        message="Could not fetch the gradebook data."
        onRetry={() => { setFetchError(false); setLoading(true); }}
      />
    );

  const activities = data?.activities || [];
  let students = data?.students || [];

  if (search.trim()) {
    const q = search.toLowerCase();
    students = students.filter(
      s =>
        s.student?.profile?.firstName?.toLowerCase().includes(q) ||
        s.student?.profile?.lastName?.toLowerCase().includes(q)
    );
  }

  const classTotalPossible = activities.reduce((sum, a) => sum + (a.totalPoints || 0), 0);

  if (activities.length === 0) {
    return (
      <div className="w-full flex-1 min-h-0 flex flex-col items-center justify-center p-8 bg-[#FAFCFA] dark:bg-[#121612] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-[#5D7C59]/10 flex items-center justify-center mb-3">
          <Users size={28} className="text-[#5D7C59]/50" />
        </div>
        <h3 className="text-gray-900 dark:text-white font-bold text-base">No Gradebook Data</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center max-w-sm">
          Create activities to start populating the gradebook.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col overflow-hidden bg-white dark:bg-[#1A211A] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">

      {/* ── Compact header strip ── */}
      <div className="shrink-0 px-3 py-2 border-b border-gray-100 dark:border-white/10 bg-[#FAFCFA] dark:bg-[#232B23] flex items-center gap-2">
        {/* Icon + title */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-[#5D7C59]/10 flex items-center justify-center">
            <Users size={14} className="text-[#5D7C59]" />
          </div>
          <div className="leading-none">
            <p className="text-[12px] font-extrabold text-gray-800 dark:text-white tracking-tight">Master Gradebook</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{students.length} student{students.length !== 1 ? 's' : ''} · {activities.length} activit{activities.length !== 1 ? 'ies' : 'y'}</p>
          </div>
        </div>

        {/* Search — fills remaining space */}
        <div className="relative flex-1 min-w-0">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 bg-white dark:bg-[#1A211A] border border-gray-200 dark:border-white/10 rounded-lg text-[12px] outline-none focus:border-[#5D7C59] transition-colors"
          />
        </div>
      </div>

      {/* ── Table — horizontal scroll, student column sticky ── */}
      <div className="flex-1 min-h-0 overflow-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <table style={{ borderCollapse: 'collapse', minWidth: '100%', tableLayout: 'auto' }}>

          {/* thead */}
          <thead style={{ position: 'sticky', top: 0, zIndex: 20 }}>
            <tr>
              {/* Student col header */}
              <th
                style={{ minWidth: 130 }}
                className="px-3 py-2.5 text-left border-b-2 border-[#5D7C59]/20 bg-[#FAFCFA] dark:bg-[#232B23]"
              >
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Student</span>
              </th>

              {/* Activity col headers */}
              {activities.map((act, idx) => (
                <th
                  key={act.id}
                  style={{ minWidth: 130 }}
                  className="px-3 py-2.5 text-left border-b-2 border-[#5D7C59]/20 bg-[#FAFCFA] dark:bg-[#232B23] align-bottom"
                >
                  <div
                    onClick={() => navigate(`/dashboard/activity/${act.id}`)}
                    className="flex flex-col gap-1 cursor-pointer group"
                  >
                    <span
                      className="font-bold text-[11px] text-gray-700 dark:text-gray-300 group-hover:text-[#5D7C59] transition-colors leading-snug"
                      title={act.title}
                      style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                      {act.title}
                    </span>
                    <span className="text-[9px] font-bold text-[#5D7C59] bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20 px-1.5 py-0.5 rounded w-max border border-[#5D7C59]/20">
                      {act.totalPoints} pts
                    </span>
                  </div>
                </th>
              ))}

              {/* Total col header */}
              <th
                style={{ minWidth: 80 }}
                className="px-3 py-2.5 text-right border-b-2 border-[#5D7C59]/20 bg-[#FAFCFA] dark:bg-[#232B23]"
              >
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Total</span>
              </th>
            </tr>
          </thead>

          {/* tbody */}
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={activities.length + 2} className="py-10 text-center text-sm text-gray-400">
                  No students match your search.
                </td>
              </tr>
            ) : (
              students.map((row, i) => {
                const firstName = row.student?.profile?.firstName ?? '';
                const lastName  = row.student?.profile?.lastName  ?? '';
                const studentName = `${firstName} ${lastName}`.trim();
                const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
                const earned = row.grades.reduce((sum, g) => sum + (g.submission?.totalScore || 0), 0);
                const pct = classTotalPossible > 0 ? Math.round((earned / classTotalPossible) * 100) : 0;

                // Row stripe
                const isEven = i % 2 === 0;

                return (
                  <tr
                    key={row.student.id}
                    className={`transition-colors group ${isEven ? 'bg-white dark:bg-[#1A211A]' : 'bg-[#FAFCFA] dark:bg-[#232B23]'}`}
                  >
                    {/* Student cell */}
                    <td
                      style={{ minWidth: 130 }}
                      className="px-3 py-2.5 border-r border-gray-100 dark:border-white/5"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0 ring-1 ring-white dark:ring-[#1A211A]"
                          style={{ background: 'linear-gradient(135deg,#5D7C59,#4A6447)' }}
                        >
                          {initials}
                        </div>
                        <span
                          className="font-semibold text-[12px] text-gray-800 dark:text-gray-200"
                          style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 90 }}
                        >
                          {studentName}
                        </span>
                      </div>
                    </td>

                    {/* Activity score cells */}
                    {row.grades.map(g => {
                      const sub = g.submission;
                      const isGraded    = sub?.status === 'graded';
                      const isSubmitted = sub?.status === 'submitted' || sub?.status === 'late';

                      return (
                        <td
                          key={g.activityId}
                          className={`px-3 py-2.5 align-middle ${isEven ? '' : 'bg-[#FAFCFA]/40 dark:bg-[#1F271F]/40'}`}
                        >
                          <div
                            onClick={() => navigate(`/dashboard/activity/${g.activityId}/gradebook?studentId=${row.student.id}`)}
                            className="cursor-pointer group/cell w-max"
                          >
                            {isGraded ? (
                              <span className="inline-flex items-center gap-1 bg-[#5D7C59]/10 text-[#5D7C59] dark:bg-[#5D7C59]/20 dark:text-[#7A9A7B] text-[11px] font-bold px-2 py-0.5 rounded-md border border-[#5D7C59]/20 transition-all group-hover/cell:bg-[#5D7C59] group-hover/cell:text-white group-hover/cell:border-[#5D7C59]">
                                {sub.totalScore}<span className="opacity-50 font-normal">/{g.totalPoints}</span>
                              </span>
                            ) : isSubmitted ? (
                              <span className="inline-flex items-center bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 text-[11px] font-bold px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/50 transition-all group-hover/cell:bg-amber-500 group-hover/cell:text-white group-hover/cell:border-amber-500">
                                Needs Grading
                              </span>
                            ) : (
                              <span className="inline-flex items-center bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-gray-200 dark:border-white/10">
                                Missing
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}

                    {/* Total cell */}
                    <td
                      className={`px-3 py-2.5 text-right ${isEven ? 'bg-gray-50/50 dark:bg-white/[0.02]' : 'bg-gray-100/50 dark:bg-white/[0.03]'}`}
                    >
                      <div className={`font-black text-[12px] ${pct >= 75 ? 'text-[#5D7C59] dark:text-[#7A9A7B]' : pct >= 50 ? 'text-amber-500' : pct > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                        {pct}%
                      </div>
                      <div className="text-[9px] font-bold text-gray-400">{earned}/{classTotalPossible}</div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassroomGradebook;
