const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'classroom', 'MaterialPreviewModal.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Update imports
content = content.replace(/import useAIStore from '\.\.\/\.\.\/store\/ai\.store';/, "import { useParams, useNavigate } from 'react-router-dom';");

// Remove ai store usage
content = content.replace(/const { isTokensExhausted, setVirtualTokens, setNextResetAt } = useAIStore\(\);/g, "");

// Remove AI states
content = content.replace(/\/\/ AI Chat State[\s\S]*?\/\/ Study Material State[\s\S]*?const \[studyType, setStudyType\] = useState\(''\);/, "");

// Inject navigate and useParams
content = content.replace(/const \[key, setKey\] = useState\(0\); \/\/ force iframe reload/g, "const [key, setKey] = useState(0);\n  const { code } = useParams();\n  const navigate = useNavigate();");

// Remove handleGenerateStudyMaterial and handleSendMessage functions
content = content.replace(/const handleGenerateStudyMaterial = async \([\s\S]*?const handleSendMessage = async \([\s\S]*?return \(/, "return (");

// Change button handlers in the top bar
// Notes
content = content.replace(/onClick=\{\(\) => handleGenerateStudyMaterial\('notes'\)\}\s*disabled=\{isGeneratingStudy \|\| isTokensExhausted\(\)\}/g, "onClick={() => { onClose(); navigate(`/dashboard/classroom/${code}/studio/${material.id}?autoGenerate=summary`); }}");

// Quiz
content = content.replace(/onClick=\{\(\) => handleGenerateStudyMaterial\('quiz'\)\}\s*disabled=\{isGeneratingStudy \|\| isTokensExhausted\(\)\}/g, "onClick={() => { onClose(); navigate(`/dashboard/classroom/${code}/studio/${material.id}?autoGenerate=quiz`); }}");

// Chat
content = content.replace(/onClick=\{\(\) => setIsAIChatOpen\(!isAIChatOpen\)\}/g, "onClick={() => { onClose(); navigate(`/dashboard/classroom/${code}/studio/${material.id}?autoChat=true`); }}");

// Fix Chat button styling
content = content.replace(/className=\{`flex items-center gap-1\.5 px-4 py-1\.5 rounded-xl border text-\[12px\] font-bold transition-all cursor-pointer \$\{[\s\S]*?✨ Chat\s*<\/button>/, `className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl border border-[#5D7C59]/30 text-[12px] font-bold transition-all cursor-pointer bg-white dark:bg-[#1A211A] text-[#5D7C59] dark:text-[#7A9A7B] hover:bg-[#5D7C59]/10"
            >
              ✨ Chat
            </button>`);

// Remove AI Chat Sidebar JSX
content = content.replace(/\{\/\* AI Chat Sidebar \*\/\}(.|\n)*\{\/\* Study Material Modal \*\/\}/g, "{/* Study Material Modal */}");

// Remove Study Material Modal JSX
content = content.replace(/\{\/\* Study Material Modal \*\/\}(.|\n)*\{\/\* Keyframe definitions \*\/\}/g, "{/* Keyframe definitions */}");

fs.writeFileSync(filePath, content);
console.log("Rewrite successful.");
