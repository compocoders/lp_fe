const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'dashboard', 'AiStudioPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Add useLocation
content = content.replace(/import \{ useParams, useNavigate \} from 'react-router-dom';/, "import { useParams, useNavigate, useLocation } from 'react-router-dom';");

// Add location hook
content = content.replace(/const navigate = useNavigate\(\);/, "const navigate = useNavigate();\n  const location = useLocation();");

// Add useEffect
const useEffectBlock = `
  useEffect(() => {
    if (activeMaterialId && location.search) {
      const params = new URLSearchParams(location.search);
      const autoGenerate = params.get('autoGenerate');
      const autoChat = params.get('autoChat');

      if (autoGenerate) {
        handleGenerate(autoGenerate);
        navigate(\`/dashboard/classroom/\${code}/studio/\${activeMaterialId}\`, { replace: true });
      } else if (autoChat) {
        handleNewChat();
        navigate(\`/dashboard/classroom/\${code}/studio/\${activeMaterialId}\`, { replace: true });
      }
    }
  }, [activeMaterialId, location.search]);
`;

// Insert it before useEffect(() => { if (code) initData(); }, [code]);
content = content.replace(/\/\/ 1\. Fetch Classroom and Materials/, useEffectBlock + '\n  // 1. Fetch Classroom and Materials');

fs.writeFileSync(filePath, content);
console.log("Rewrite successful.");
