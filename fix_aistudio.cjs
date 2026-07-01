const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const filePath = path.join(__dirname, 'src', 'pages', 'dashboard', 'AiStudioPage.jsx');

// 1. Restore from git
execSync('git checkout -- src/pages/dashboard/AiStudioPage.jsx', { cwd: __dirname });
console.log("Restored AiStudioPage.jsx from git");

// 2. Read the file
let content = fs.readFileSync(filePath, 'utf-8');

// 3. Add location hook
content = content.replace(/import \{ useParams, useNavigate \} from 'react-router-dom';/, "import { useParams, useNavigate, useLocation } from 'react-router-dom';");
content = content.replace(/const navigate = useNavigate\(\);/, "const navigate = useNavigate();\n  const location = useLocation();");

// 4. Update error handling inside handleGenerate
content = content.replace(
  /if \(!res\.ok\) \{\s*if \(res\.status === 429\) \{\s*setVirtualTokens\(0\);\s*if \(data\.nextResetAt\) setNextResetAt\(data\.nextResetAt\);\s*setStudioOutput\(\{ type, content: data\.message, isLoading: false \}\);\s*return;\s*\}\s*throw new Error\("Failed to generate"\);\s*\}/,
  `if (!res.ok) {
        if (res.status === 429) {
           setVirtualTokens(0);
           if (data.nextResetAt) setNextResetAt(data.nextResetAt);
           setStudioOutput({ type, content: data.message, isLoading: false });
           return;
        }
        throw new Error(data.message || data.error || "Failed to generate");
      }`
);

// Update catch block
content = content.replace(
  /\} catch \(e\) \{\s*setStudioOutput\(\{ type, content: "Error generating content.", isLoading: false \}\);\s*\} finally \{/,
  `} catch (e) {
      setStudioOutput({ type, content: e.message || "Error generating content.", isLoading: false });
    } finally {`
);

// 5. Update the activeMaterialId useEffect to handle both the Auto trigger AND the History fetch
const oldEffect = `  // 2. Fetch History when activeMaterialId changes
  useEffect(() => {
    if (activeMaterialId) {
      fetchHistory();
      setActiveThreadId(null);
      setActiveSavedId(null);
      setStudioOutput(null);
      setMessages([]);
    } else {
      setConversations([]);
      setSavedMaterials([]);
    }
  }, [activeMaterialId]);`;

const newEffect = `  // 2. Fetch History when activeMaterialId changes
  useEffect(() => {
    if (activeMaterialId) {
      fetchHistory();
      
      const params = new URLSearchParams(location.search);
      const autoGenerate = params.get('autoGenerate');
      const autoChat = params.get('autoChat');

      if (autoGenerate) {
        handleGenerate(autoGenerate);
        navigate(\`/dashboard/classroom/\${code}/studio/\${activeMaterialId}\`, { replace: true });
      } else if (autoChat) {
        handleNewChat();
        navigate(\`/dashboard/classroom/\${code}/studio/\${activeMaterialId}\`, { replace: true });
      } else {
        setActiveThreadId(null);
        setActiveSavedId(null);
        setStudioOutput(null);
        setMessages([]);
      }
    } else {
      setConversations([]);
      setSavedMaterials([]);
    }
  }, [activeMaterialId, location.search]);`;

content = content.replace(oldEffect, newEffect);

fs.writeFileSync(filePath, content);
console.log("AiStudioPage.jsx rebuilt successfully.");
