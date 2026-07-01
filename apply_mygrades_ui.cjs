const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'classroom', 'MyGrades.jsx');
const newContent = `import React, { useEffect, useState } from 'react';
import { getMyGrades } from '../../api/submission.api';
import { Loader2, Award, Clock, ChevronRight, Sparkles, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#5D7C59]/20 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-[#5D7C59] rounded-full border-t-transparent animate-spin absolute inset-0"></div>
          <Sparkles className="absolute inset-0 m-auto text-[#FFC700] animate-pulse" size={20} />
        </div>
        <p className="text-[#5D7C59] dark:text-[#7A9A7B] font-bold text-sm tracking-wide mt-4">Loading your grades...</p>
      </div>
    );
  }

  const activities = grades?.activities || [];

  if (activities.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#FAFCFA] dark:bg-[#121612] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#5D7C59]/10 to-[#FFC700]/10 flex items-center justify-center mb-6 relative"
        >
          <div className="absolute inset-0 rounded-full border border-[#5D7C59]/20 animate-[spin_10s_linear_infinite]" />
          <Award size={40} className="text-[#5D7C59] dark:text-[#7A9A7B]" strokeWidth={1.5} />
        </motion.div>
        <h3 className="text-gray-900 dark:text-white font-black text-2xl mb-2 tracking-tight">No Grades Yet</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center max-w-sm font-medium leading-relaxed">
          There are no graded activities for you in this classroom yet. Keep up the good work and check back later!
        </p>
      </div>
    );
  }

  const totalEarned = activities.reduce((sum, a) => sum + (a.submission?.totalScore || 0), 0);
  const totalPossible = activities.reduce((sum, a) => sum + (a.totalPoints || 0), 0);
  const percentage = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;
  
  // Calculate dash offset for circle progress (circumference = 2 * pi * r)
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-[#FAFCFA] dark:bg-[#121612] rounded-3xl">
      {/* Premium Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="shrink-0 p-6 md:p-8 bg-white dark:bg-[#1A211A] relative overflow-hidden border-b border-gray-100 dark:border-white/5"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-[#FFC700]/15 via-[#5D7C59]/10 to-transparent blur-3xl rounded-full translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-[#5D7C59]/10 to-transparent blur-3xl rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 max-w-5xl mx-auto">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20 border border-[#5D7C59]/20 mb-4">
              <Target size={14} className="text-[#5D7C59] dark:text-[#7A9A7B]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#5D7C59] dark:text-[#7A9A7B]">Performance Overview</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">My Overall Grade</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed max-w-md">
              A comprehensive compilation of all your submitted and graded activities in this classroom.
            </p>
          </div>
          
          {/* Circular Progress Indicator */}
          <div className="flex items-center gap-6 shrink-0 bg-gray-50 dark:bg-[#232B23] p-5 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200 dark:text-white/10"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="50"
                  cy="50"
                />
                <motion.circle
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={\`\${percentage >= 80 ? 'text-[#5D7C59]' : percentage >= 50 ? 'text-[#FFC700]' : 'text-red-500'}\`}
                  strokeWidth="8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="50"
                  cy="50"
                  style={{ strokeDasharray: circumference }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-gray-900 dark:text-white leading-none">{percentage}%</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1 pr-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Points</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                {totalEarned} <span className="text-base text-gray-400 font-bold">/ {totalPossible}</span>
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-[#5D7C59] dark:text-[#7A9A7B]">
                <Zap size={12} className="fill-[#5D7C59] dark:fill-[#7A9A7B]" />
                {activities.filter(a => a.submission?.status === 'graded').length} Graded
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <div className="flex flex-col gap-4 max-w-5xl mx-auto pb-10">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-2 px-1">Activity Breakdown</h3>
          {activities.map((activity, index) => {
            const sub = activity.submission;
            const isGraded = sub?.status === 'graded';
            const isSubmitted = sub?.status === 'submitted' || sub?.status === 'late';
            const activityScore = sub?.totalScore || 0;
            const activityPercentage = activity.totalPoints > 0 ? (activityScore / activity.totalPoints) * 100 : 0;
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.2 }}
                key={activity.id} 
                onClick={() => navigate(\`/dashboard/activity/\${activity.id}\`)}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/5 hover:border-[#5D7C59]/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(93,124,89,0.1)] transition-all duration-300 cursor-pointer overflow-hidden gap-5"
              >
                {/* Subtle hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#5D7C59]/[0.02] dark:via-[#5D7C59]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="flex items-center gap-4 min-w-0 z-10">
                  <div className={\`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner transition-colors duration-300 \${
                    isGraded ? 'bg-gradient-to-br from-[#5D7C59]/20 to-[#5D7C59]/5 text-[#5D7C59] dark:text-[#7A9A7B]' 
                    : isSubmitted ? 'bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-500' 
                    : 'bg-gray-50 dark:bg-[#232B23] text-gray-400'
                  }\`}>
                    {isGraded ? <Award size={26} strokeWidth={2} /> : isSubmitted ? <Clock size={26} strokeWidth={2} /> : <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-[#5D7C59] dark:group-hover:text-[#7A9A7B] transition-colors truncate tracking-tight">
                      {activity.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={\`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md \${
                        isGraded ? 'bg-[#5D7C59]/10 text-[#5D7C59] dark:text-[#7A9A7B]' 
                        : isSubmitted ? 'bg-blue-500/10 text-blue-500' 
                        : 'bg-gray-100 dark:bg-white/5 text-gray-500'
                      }\`}>
                        {isGraded ? 'Graded' : isSubmitted ? 'Pending Review' : 'Not Submitted'}
                      </span>
                      {activity.dueDate && (
                        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1">
                          <Clock size={12} />
                          Due {new Date(activity.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 sm:justify-end shrink-0 z-10 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-gray-50 sm:border-t-0 dark:border-white/5">
                  <div className="flex-1 sm:flex-none">
                    <div className="flex justify-between items-end mb-1">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Score</div>
                      {isGraded && <div className="text-[10px] font-bold text-[#5D7C59] dark:text-[#7A9A7B] sm:hidden">{Math.round(activityPercentage)}%</div>}
                    </div>
                    {isGraded ? (
                      <div className="flex flex-col gap-1.5 w-full sm:w-32">
                        <div className="text-xl font-black text-gray-900 dark:text-white leading-none">
                          {sub.totalScore} <span className="text-xs font-bold text-gray-400">/ {activity.totalPoints}</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: \`\${activityPercentage}%\` }}
                            transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 + 0.5 }}
                            className={\`h-full \${activityPercentage >= 80 ? 'bg-gradient-to-r from-[#4A6447] to-[#5D7C59]' : activityPercentage >= 50 ? 'bg-gradient-to-r from-[#FFC700] to-amber-500' : 'bg-red-400'}\`} 
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-xl font-black text-gray-300 dark:text-gray-600 leading-none">
                        - <span className="text-xs font-bold">/ {activity.totalPoints}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 group-hover:bg-[#5D7C59]/10 flex items-center justify-center shrink-0 transition-colors">
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-[#5D7C59] dark:group-hover:text-[#7A9A7B] transition-colors" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyGrades;
`;

fs.writeFileSync(filePath, newContent);
console.log("MyGrades updated with rich UI.");
