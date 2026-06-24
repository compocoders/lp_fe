import React, { useEffect, useState } from 'react';
import { getMyGrades } from '../../api/submission.api';
import { Loader2, Award, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyGrades = ({ classroomId }) => {
  const [grades, setGrades] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await getMyGrades();
        const currentClassroomData = data.find(d => d.classroom.id === classroomId);
        setGrades(currentClassroomData || { activities: [] });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (classroomId) fetchGrades();
  }, [classroomId]);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#FAFCFA] dark:bg-[#121612]">
        <Loader2 size={30} className="text-[#5D7C59] animate-spin mb-4" />
        <p className="text-gray-500 font-medium text-sm tracking-wide">Loading your grades...</p>
      </div>
    );
  }

  const activities = grades?.activities || [];

  if (activities.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#FAFCFA] dark:bg-[#121612] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#5D7C59]/10 flex items-center justify-center mb-4">
          <Award size={32} className="text-[#5D7C59]/50" />
        </div>
        <h3 className="text-gray-900 dark:text-white font-bold text-lg">No Grades Yet</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center max-w-sm">There are no graded activities for you in this classroom yet. Check back later once your teacher has graded your work.</p>
      </div>
    );
  }

  const totalEarned = activities.reduce((sum, a) => sum + (a.submission?.totalScore || 0), 0);
  const totalPossible = activities.reduce((sum, a) => sum + (a.totalPoints || 0), 0);
  const percentage = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white dark:bg-[#1A211A] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
      <div className="shrink-0 p-8 bg-gradient-to-br from-[#5D7C59] to-[#4A6447] text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#7A9A7B]/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-24 h-24 bg-[#FFC700]/10 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight">My Overall Grade</h2>
            <p className="text-white/80 text-[13px] font-medium mt-1 uppercase tracking-widest">Compilation of all activities</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-black leading-none drop-shadow-sm">{percentage}%</div>
            <div className="text-[13px] font-bold text-white/80 mt-2 tracking-wide">{totalEarned} / {totalPossible} PTS</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#FAFCFA] dark:bg-[#121612]">
        <div className="flex flex-col gap-3 max-w-4xl mx-auto">
          {activities.map(activity => {
            const sub = activity.submission;
            const isGraded = sub?.status === 'graded';
            const isSubmitted = sub?.status === 'submitted' || sub?.status === 'late';
            
            return (
              <div 
                key={activity.id} 
                onClick={() => navigate(`/dashboard/activity/${activity.id}`)}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 bg-white dark:bg-[#232B23] rounded-2xl border border-gray-100 dark:border-white/10 hover:border-[#5D7C59]/30 dark:hover:border-[#7A9A7B]/40 hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer group gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${isGraded ? 'bg-[#5D7C59]/10 text-[#5D7C59]' : isSubmitted ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-100 dark:bg-[#1A211A] text-gray-400'}`}>
                    {isGraded ? <Award size={24} /> : isSubmitted ? <Clock size={24} /> : <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[15px] text-gray-900 dark:text-white group-hover:text-[#5D7C59] dark:group-hover:text-[#7A9A7B] transition-colors truncate">{activity.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${isGraded ? 'bg-[#5D7C59]/10 text-[#5D7C59]' : isSubmitted ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}>
                        {isGraded ? 'Graded' : isSubmitted ? 'Pending Review' : 'Not Submitted'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right shrink-0 bg-[#FAFCFA] dark:bg-[#1A211A] px-4 py-2 rounded-xl border border-gray-100 dark:border-white/5">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Score</div>
                  {isGraded ? (
                    <div className="text-xl font-black text-[#5D7C59] dark:text-[#7A9A7B]">
                      {sub.totalScore} <span className="text-xs font-bold text-gray-400">/ {activity.totalPoints}</span>
                    </div>
                  ) : (
                    <div className="text-xl font-black text-gray-300 dark:text-gray-600">
                      - <span className="text-xs font-bold">/ {activity.totalPoints}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyGrades;
