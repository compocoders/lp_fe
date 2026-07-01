const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'dashboard', 'AiStudioPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const anchorStart = content.indexOf('  // 2. Fetch History when activeMaterialId changes');
const anchorEnd = content.indexOf('  // 3. Fetch Messages when activeThreadId changes');

if (anchorStart !== -1 && anchorEnd !== -1) {
  const replacement = `  // 2. Fetch History when activeMaterialId changes
  useEffect(() => {
    if (activeMaterialId) {
      fetchHistory();
      setActiveThreadId(null);
      setActiveSavedId(null);
      
      // Only clear studioOutput if we don't have pending URL triggers
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
  }, [activeMaterialId, location.search]);

`;

  content = content.substring(0, anchorStart) + replacement + content.substring(anchorEnd);
  fs.writeFileSync(filePath, content);
  console.log("Successfully replaced effects.");
} else {
  console.log("Anchors not found.");
}
