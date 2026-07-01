const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'dashboard', 'AiStudioPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const badEffect = `  // 2. Fetch History when activeMaterialId changes
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

const correctEffects = `  // 2. Fetch History when activeMaterialId changes
  useEffect(() => {
    if (activeMaterialId) {
      fetchHistory();
      setActiveThreadId(null);
      setActiveSavedId(null);
      
      // Only reset output if we are not about to auto-generate
      const params = new URLSearchParams(location.search);
      if (!params.get('autoGenerate') && !params.get('autoChat')) {
        setStudioOutput(null);
        setMessages([]);
      }
    } else {
      setConversations([]);
      setSavedMaterials([]);
    }
  }, [activeMaterialId]);

  // 3. Handle Auto Triggers
  useEffect(() => {
    if (activeMaterialId && location.search) {
      const params = new URLSearchParams(location.search);
      const autoGenerate = params.get('autoGenerate');
      const autoChat = params.get('autoChat');

      if (autoGenerate) {
        setTimeout(() => handleGenerate(autoGenerate), 50);
        navigate(\`/dashboard/classroom/\${code}/studio/\${activeMaterialId}\`, { replace: true });
      } else if (autoChat) {
        setTimeout(() => handleNewChat(), 50);
        navigate(\`/dashboard/classroom/\${code}/studio/\${activeMaterialId}\`, { replace: true });
      }
    }
  }, [activeMaterialId, location.search]);`;

if (content.includes(badEffect)) {
  content = content.replace(badEffect, correctEffects);
  fs.writeFileSync(filePath, content);
  console.log("Fixed AiStudioPage effects successfully.");
} else {
  console.log("Could not find the bad effect to replace.");
}
