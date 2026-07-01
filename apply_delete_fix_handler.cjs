const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'dashboard', 'AiStudioPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const handlerTarget = `  const handleDeleteConv = async (id) => {`;
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
      if (activeSavedId === id) {
         setActiveSavedId(null);
         setStudioOutput(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

`;

if (content.includes(handlerTarget) && !content.includes('handleDeleteMaterial')) {
  content = content.replace(handlerTarget, deleteMatFunc + handlerTarget);
  fs.writeFileSync(filePath, content);
  console.log("handleDeleteMaterial added!");
} else {
  console.log("Could not find handler target, or it already exists.");
}
