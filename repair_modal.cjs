const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'classroom', 'MaterialPreviewModal.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const actionsStart = content.indexOf('{/* Actions */}');
const closeBtnEnd = content.indexOf('{/* ── Content Area (Split) ── */}');

if (actionsStart !== -1 && closeBtnEnd !== -1) {
  const replacement = `{/* Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto scrollbar-hide pb-1 sm:pb-0 shrink-0">
            {/* Generate Notes */}
            <button
              onClick={() => { onClose(); navigate(\`/dashboard/classroom/\${code}/studio/\${material.id}?autoGenerate=summary\`); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[12px] font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              <ScrollText size={14} /> Notes
            </button>
            
            {/* Generate Quiz */}
            <button
              onClick={() => { onClose(); navigate(\`/dashboard/classroom/\${code}/studio/\${material.id}?autoGenerate=quiz\`); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-900/30 bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-[12px] font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              <Brain size={14} /> Quiz
            </button>

            {/* Toggle AI */}
            <button
              onClick={() => { onClose(); navigate(\`/dashboard/classroom/\${code}/studio/\${material.id}?autoChat=true\`); }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl border border-[#5D7C59]/30 text-[12px] font-bold transition-all cursor-pointer bg-white dark:bg-[#1A211A] text-[#5D7C59] dark:text-[#7A9A7B] hover:bg-[#5D7C59]/10"
            >
              <Sparkles size={14} /> Chat
            </button>
            
            {/* Reload */}
            <button
              onClick={() => setKey(k => k + 1)}
              title="Reload preview"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 text-[12px] font-semibold transition-colors cursor-pointer shrink-0"
            >
              <RefreshCw size={13} /> <span className="hidden sm:inline">Reload</span>
            </button>
            {/* Open in new tab */}
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              title="Open in new tab"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 text-[12px] font-semibold transition-colors cursor-pointer no-underline shrink-0"
            >
              <ExternalLink size={13} /> <span className="hidden sm:inline">Open</span>
            </a>
            {/* Download */}
            <a
              href={fileUrl}
              download
              title="Download"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 text-[12px] font-bold transition-all hover:bg-gray-200 dark:hover:bg-white/20 cursor-pointer no-underline shrink-0"
            >
              <Download size={13} /> <span className="hidden sm:inline">Download</span>
            </a>
            {/* Close (Desktop) */}
            <button
              onClick={onClose}
              className="hidden sm:flex p-2 ml-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        `;

  content = content.substring(0, actionsStart) + replacement + content.substring(closeBtnEnd);
  fs.writeFileSync(filePath, content);
  console.log("Repaired successfully.");
} else {
  console.log("Markers not found");
}
