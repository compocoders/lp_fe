const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'classroom', 'MaterialPreviewModal.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Find the line with 'title="Download"'
const downloadIdx = content.indexOf('title="Download"');
if (downloadIdx !== -1) {
  content = content.substring(0, downloadIdx + 16);
  const correctEnding = `
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

        {/* ── Content Area (Split) ── */}
        <div className="flex flex-1 overflow-hidden">
          {/* Document Preview */}
          <div className="flex-1 relative bg-[#FAFCFA] dark:bg-[#0D110D] transition-all duration-300">
            {renderPreview()}
          </div>
        </div>
      </div>

      {/* Keyframe definitions */}
      <style>{\`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      \`}</style>
    </div>
  );
};

export default MaterialPreviewModal;
`;
  
  content += correctEnding;
  fs.writeFileSync(filePath, content);
  console.log("Restored MaterialPreviewModal.jsx");
} else {
  console.log("Could not find 'title=\"Download\"'");
}
