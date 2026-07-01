const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'dashboard', 'AiStudioPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add import
if (!content.includes('InteractiveQuizGame')) {
  const importAnchor = "import TokenWidget from '../../components/common/TokenWidget';";
  if (content.includes(importAnchor)) {
    content = content.replace(importAnchor, importAnchor + "\nimport InteractiveQuizGame from '../../components/classroom/InteractiveQuizGame';");
  }
}

// 2. Add helper function to parse/render content inside AiStudioPage
// It's cleaner to inject it inside the component or outside. Let's create a small helper outside.
const helperStr = `
const renderMaterialContent = (type, content) => {
  if (type === 'quiz') {
    try {
      const parsed = JSON.parse(content);
      return <InteractiveQuizGame quizData={parsed} />;
    } catch (e) {
      // Fallback for legacy plain-text quizzes or AI format errors
      return <pre className="text-[13px] md:text-[14px] leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans">{content}</pre>;
    }
  }
  return <pre className="text-[13px] md:text-[14px] leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans">{content}</pre>;
};
`;

if (!content.includes('renderMaterialContent')) {
  const compAnchor = "const AiStudioPage = () => {";
  content = content.replace(compAnchor, helperStr + "\n" + compAnchor);
}

// 3. Replace the rendering in the JSX
const badJSX = `<pre className="text-[13px] md:text-[14px] leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans">
                    {activeSavedId ? savedMaterials.find(m => m.id === activeSavedId)?.content : studioOutput?.content}
                  </pre>`;

const goodJSX = `{(() => {
                    const type = activeSavedId ? savedMaterials.find(m => m.id === activeSavedId)?.type : studioOutput?.type;
                    const matContent = activeSavedId ? savedMaterials.find(m => m.id === activeSavedId)?.content : studioOutput?.content;
                    return renderMaterialContent(type, matContent);
                  })()}`;

if (content.includes(badJSX)) {
  content = content.replace(badJSX, goodJSX);
}

// Remove the max-w-4xl wrapper for quiz so it can use the full container width if needed (or keep it)
// We'll just replace the container classes to remove max-w-4xl so the game is nicely centered but full width of the view
const badContainer = `<div className="max-w-4xl mx-auto bg-white dark:bg-[#1A211A] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">`;
const goodContainer = `<div className="w-full bg-white dark:bg-[#1A211A] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col min-h-[500px]">`;

if (content.includes(badContainer)) {
  content = content.replace(badContainer, goodContainer);
}

// Also make sure the body can grow
const badBody = `<div className="p-5 md:p-8">`;
const goodBody = `<div className="p-0 m-0 flex-1 flex flex-col">
                  {/* For text notes we still need padding, so let's handle padding inside renderMaterialContent or wrap pre */}`;

// Wait, replacing badBody might be tricky, let's refine the goodJSX to handle padding for non-quiz
const goodJSX2 = `{(() => {
                    const type = activeSavedId ? savedMaterials.find(m => m.id === activeSavedId)?.type : studioOutput?.type;
                    const matContent = activeSavedId ? savedMaterials.find(m => m.id === activeSavedId)?.content : studioOutput?.content;
                    if (type === 'quiz') {
                      return (
                        <div className="h-full flex-1">
                           {renderMaterialContent(type, matContent)}
                        </div>
                      );
                    }
                    return (
                      <div className="p-5 md:p-8 h-full flex-1">
                        {renderMaterialContent(type, matContent)}
                      </div>
                    );
                  })()}`;

if (content.includes(`<div className="p-5 md:p-8">`)) {
  const fullBadBlock = `<div className="p-5 md:p-8">
                {studioLoading ? (
                  <div className="flex flex-col items-center py-20 text-gray-400 px-4 text-center">
                    <Sparkles size={40} className="mb-4 animate-pulse text-[#FFC700]" />
                    <p>Generating your study material...</p>
                  </div>
                ) : (
                  <pre className="text-[13px] md:text-[14px] leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans">
                    {activeSavedId ? savedMaterials.find(m => m.id === activeSavedId)?.content : studioOutput?.content}
                  </pre>
                )}
              </div>`;
              
  const fullGoodBlock = `<div className="flex-1 flex flex-col h-full w-full">
                {studioLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 px-4 text-center h-full">
                    <Sparkles size={40} className="mb-4 animate-pulse text-[#FFC700]" />
                    <p>Generating your study material...</p>
                  </div>
                ) : (
                  (() => {
                    const type = activeSavedId ? savedMaterials.find(m => m.id === activeSavedId)?.type : studioOutput?.type;
                    const matContent = activeSavedId ? savedMaterials.find(m => m.id === activeSavedId)?.content : studioOutput?.content;
                    
                    if (type === 'quiz') {
                      return <div className="h-full w-full flex-1 flex">{renderMaterialContent(type, matContent)}</div>;
                    }
                    return <div className="p-5 md:p-8">{renderMaterialContent(type, matContent)}</div>;
                  })()
                )}
              </div>`;
              
  if (content.includes(fullBadBlock)) {
     content = content.replace(fullBadBlock, fullGoodBlock);
  } else {
     console.log("Could not find the exact block for padding fix. The file might have been formatted.");
  }
}

fs.writeFileSync(filePath, content);
console.log("AiStudioPage.jsx updated successfully.");
