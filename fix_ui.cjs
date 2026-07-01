const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'classroom', 'CreateActivityModal.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace all colored outer boxes with neutral gray boxes
content = content.replace(/bg-(purple|yellow|green|teal|emerald|indigo)-50\/50 dark:bg-(purple|yellow|green|teal|emerald|indigo)-900\/10 border border-(purple|yellow|green|teal|emerald|indigo)-100 dark:border-(purple|yellow|green|teal|emerald|indigo)-500\/20/g, 'bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10');

// 2. Replace colored text for the titles with neutral gray text
content = content.replace(/text-[a-z]+-600 dark:text-[a-z]+-400 uppercase tracking-wider">([^<]+) Settings/g, 'text-gray-500 dark:text-gray-400 uppercase tracking-wider">$1 Settings');

// 3. Fix 3-column grids used for difficulty buttons so they don't squeeze "Intermediate"
content = content.replace(/<div className="grid grid-cols-3 gap-2">\s*\{\['easy', 'intermediate', 'hard'\]/g, '<div className="flex flex-col sm:flex-row gap-2">\n                        {[\'easy\', \'intermediate\', \'hard\']');
content = content.replace(/<div className="grid grid-cols-3 gap-2">\s*\{\['beginner', 'intermediate', 'advanced'\]/g, '<div className="flex flex-col sm:flex-row gap-2">\n                        {[\'beginner\', \'intermediate\', \'advanced\']');
content = content.replace(/<div className="grid grid-cols-3 gap-2">\s*\{\['simple', 'moderate', 'complex'\]/g, '<div className="flex flex-col sm:flex-row gap-2">\n                        {[\'simple\', \'moderate\', \'complex\']');

// 4. Update the difficulty buttons to have flex-1 if they were changed
content = content.replace(/className={`py-2 rounded-xl border text-\[11px\] font-bold capitalize transition-all \$\{/g, 'className={`flex-1 py-2.5 rounded-xl border text-[11px] font-bold capitalize transition-all ${');

// 5. Add hover state and shadow to the active buttons
content = content.replace(/'bg-\[#5D7C59\]\/10 border-\[#5D7C59\] text-\[#5D7C59\]'/g, "'bg-[#5D7C59]/10 border-[#5D7C59] text-[#5D7C59] shadow-sm'");
content = content.replace(/'bg-white dark:bg-black\/20 border-gray-200 dark:border-white\/10 text-gray-600 dark:text-gray-400 hover:border-\[#5D7C59\]\/40'/g, "'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#5D7C59]/40 hover:bg-gray-50'");

// 6. Fix "Cancel" and "Generate Activity" buttons to fit better
// Actually, I already added whitespace-nowrap. But wait, if they are still overflowing, I should make them shrink or take less padding.
// In the screenshot, the "Generate Activity" text is fine, but the button seems pushed.
content = content.replace(/className="px-6 py-2.5 bg-gradient-to-r from-\[#5D7C59\] to-\[#4A6447\] text-white font-bold text-sm rounded-xl/g, 'className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-[#5D7C59] to-[#4A6447] text-white font-bold text-sm rounded-xl');
content = content.replace(/className="px-5 py-2.5 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-white\/5 rounded-xl transition-colors cursor-pointer border-none"/g, 'className="px-3 sm:px-5 py-2.5 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer border-none"');

fs.writeFileSync(filePath, content, 'utf8');
console.log('UI fixes applied!');
