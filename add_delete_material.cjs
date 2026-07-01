const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'dashboard', 'AiStudioPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add handleDeleteMaterial function below handleDeleteConv
const funcAnchor = `  const handleDeleteConv = async (id) => {`;
const deleteMatFunc = `  const handleDeleteMaterial = async (id) => {
    if (!window.confirm("Delete this saved material?")) return;
    const token = localStorage.getItem('token');
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      await fetch(\`\${baseUrl}/studio/study-materials/\${id}\`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Authorization': \`Bearer \${token}\` }
      });
      setSavedMaterials(prev => prev.filter(m => m.id !== id));
      if (activeSavedId === id) setActiveSavedId(null);
    } catch (e) {
      console.error(e);
    }
  };

`;

if (content.includes(funcAnchor) && !content.includes('handleDeleteMaterial')) {
  content = content.replace(funcAnchor, deleteMatFunc + funcAnchor);
}

// 2. Add the delete button to the UI
const badUI = `                    {savedMaterials.map(m => (
                      <button
                        key={m.id}
                        onClick={() => { setActiveSavedId(m.id); setActiveThreadId(null); setStudioOutput(null); setShowLeftSidebar(false); }}
                        className={\`flex items-center gap-2.5 px-3 py-2.5 rounded-xl w-full text-left transition-colors border-none cursor-pointer
                          \${activeSavedId === m.id ? 'bg-[#FFC700]/10 text-[#B88F00] dark:text-[#FFC700] font-semibold' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'}\`}
                      >
                        <FileText size={14} />
                        <span className="text-[12.5px] truncate flex-1 capitalize">{m.type}</span>
                      </button>
                    ))}`;

const goodUI = `                    {savedMaterials.map(m => (
                      <div key={m.id} className="relative group w-full flex items-center">
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
                      </div>
                    ))}`;

if (content.includes(badUI)) {
  content = content.replace(badUI, goodUI);
  fs.writeFileSync(filePath, content);
  console.log("Delete material functionality added successfully.");
} else {
  console.log("Could not find UI block to replace.");
}
