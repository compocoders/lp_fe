const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'classroom', 'MyGrades.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace the Hero Banner section
const heroRegex = /\{\/\* Premium Hero Banner \*\/\}([\s\S]*?)<div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">/m;

const newHero = `{/* Compact Premium Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="shrink-0 p-4 md:p-6 bg-white dark:bg-[#1A211A] relative overflow-hidden border-b border-gray-100 dark:border-white/5"
      >
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-[#FFC700]/15 via-[#5D7C59]/10 to-transparent blur-3xl rounded-full translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-5xl mx-auto">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#5D7C59]/10 dark:bg-[#5D7C59]/20 border border-[#5D7C59]/20 mb-2">
              <Target size={12} className="text-[#5D7C59] dark:text-[#7A9A7B]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#5D7C59] dark:text-[#7A9A7B]">Performance Overview</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">My Overall Grade</h2>
          </div>
          
          {/* Circular Progress Indicator */}
          <div className="flex items-center gap-4 shrink-0 bg-gray-50 dark:bg-[#232B23] p-3 md:px-5 md:py-3 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="relative w-16 h-16 flex items-center justify-center">
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
                <span className="text-sm font-black text-gray-900 dark:text-white leading-none">{percentage}%</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-0.5 pr-1">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Points</p>
              <p className="text-xl font-black text-gray-900 dark:text-white leading-none">
                {totalEarned} <span className="text-sm text-gray-400 font-bold">/ {totalPossible}</span>
              </p>
              <div className="flex items-center gap-1 mt-0.5 text-[11px] font-bold text-[#5D7C59] dark:text-[#7A9A7B]">
                <Zap size={10} className="fill-[#5D7C59] dark:fill-[#7A9A7B]" />
                {activities.filter(a => a.submission?.status === 'graded').length} Graded
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">`;

if (heroRegex.test(content)) {
  content = content.replace(heroRegex, newHero);
  fs.writeFileSync(filePath, content);
  console.log("Banner shrunk!");
} else {
  console.log("Could not find banner to replace.");
}
