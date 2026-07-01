const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'dashboard', 'AiStudioPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const badBlock = `<button
                        key={m.id}
                        onClick={() => { setActiveSavedId(m.id); setActiveThreadId(null); setStudioOutput(null); setShowLeftSidebar(false); }}
                        className={\`flex items-center gap-2.5 px-3 py-2.5 rounded-xl w-full text-left transition-colors border-none cursor-pointer
                          \${activeSavedId === m.id ? 'bg-[#FFC700]/10 text-[#B88F00] dark:text-[#FFC700] font-semibold' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'}\`}
                      >
                        <FileText size={14} />
                        <span className="text-[12.5px] truncate flex-1 capitalize">{m.type}</span>
                      </button>`;

const goodBlock = `<div key={m.id} className="relative group w-full flex items-center">
                        <button
                          onClick={() => { setActiveSavedId(m.id); setActiveThreadId(null); setStudioOutput(null); setShowLeftSidebar(false); }}
                          className={\`flex items-center gap-2.5 px-3 py-2.5 rounded-xl w-full text-left transition-colors border-none cursor-pointer
                            \${activeSavedId === m.id ? 'bg-[#FFC700]/10 text-[#B88F00] dark:text-[#FFC700] font-semibold' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'}\`}
                        >
                          <FileText size={14} />
                          <span className="text-[12.5px] truncate flex-1 capitalize pr-6">{m.type}</span>
                        </button>
                        
                        <div className="absolute right-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteMaterial(m.id); }} 
                            title="Delete Material"
                            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-500 rounded-lg text-gray-500 cursor-pointer border-none bg-transparent transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>`;

let found = false;
// Quick and dirty manual replacement using index
const index = content.indexOf('<button\n                        key={m.id}');
if (index !== -1) {
    const nextButton = content.indexOf('</button>', index) + 9;
    const toReplace = content.substring(index, nextButton);
    content = content.replace(toReplace, goodBlock);
    fs.writeFileSync(filePath, content);
    console.log("Replaced successfully via substring.");
    found = true;
} else {
    console.log("Could not find index!");
}

