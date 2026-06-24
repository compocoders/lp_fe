import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Loader2, Monitor, Tablet, Smartphone, Maximize, Play, FileText } from 'lucide-react';

const CSS_FRAMEWORKS = [
  { id: 'native', name: 'Native CSS', cdn: '' },
  { id: 'tailwind', name: 'Tailwind CSS', cdn: '<script src="https://cdn.tailwindcss.com"></script>' },
  { id: 'bootstrap', name: 'Bootstrap 5', cdn: '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">' },
];

const FrontendRenderer = ({ question, value, onChange }) => {
  const [activeTab, setActiveTab] = useState('html');
  const [previewWidth, setPreviewWidth] = useState(1024);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  // Initialize values
  const currentVal = value || {};
  const htmlCode = currentVal.html !== undefined ? currentVal.html : (question.config?.starterHtml || '');
  const cssCode = currentVal.css !== undefined ? currentVal.css : (question.config?.starterCss || '');
  const jsCode = currentVal.js !== undefined ? currentVal.js : (question.config?.starterJs || '');
  const selectedFramework = currentVal.cssFramework || question.config?.cssFramework || 'native';

  const handleUpdate = (type, newCode) => {
    onChange(question.id, {
      html: htmlCode,
      css: cssCode,
      js: jsCode,
      cssFramework: selectedFramework,
      [type]: newCode
    });
  };

  const handleFrameworkChange = (e) => {
    onChange(question.id, {
      html: htmlCode,
      css: cssCode,
      js: jsCode,
      cssFramework: e.target.value
    });
  };

  const updateIframe = () => {
    if (!iframeRef.current) return;
    const document = iframeRef.current.contentDocument;
    if (!document) return;

    const frameworkCDN = CSS_FRAMEWORKS.find(fw => fw.id === selectedFramework)?.cdn || '';

    const finalHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${frameworkCDN}
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>
            try {
              ${jsCode}
            } catch (err) {
              console.error(err);
            }
          </script>
        </body>
      </html>
    `;

    document.open();
    document.write(finalHtml);
    document.close();
  };

  // Debounce iframe updates
  useEffect(() => {
    const timeout = setTimeout(updateIframe, 500);
    return () => clearTimeout(timeout);
  }, [htmlCode, cssCode, jsCode, selectedFramework]);

  const getCurrentCode = () => {
    if (activeTab === 'html') return htmlCode;
    if (activeTab === 'css') return cssCode;
    if (activeTab === 'js') return jsCode;
    return '';
  };

  return (
    <div className="bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden flex flex-col transition-colors duration-200">
      
      {/* Top: Preview Pane */}
      <div className="flex flex-col bg-[#f8f9fa] dark:bg-[#121612] border-b border-gray-100 dark:border-white/10">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-[#232B23] border-b border-gray-100 dark:border-white/10">
          <span className="text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2">
            <Play size={14} className="text-[#5D7C59]" /> Live Preview
          </span>
          <div className="flex gap-1 bg-white dark:bg-[#1A211A] p-1 rounded-lg border border-gray-200 dark:border-white/10">
            <button onClick={() => setPreviewWidth(1024)} title="Desktop" className={`p-1.5 rounded transition-colors ${previewWidth === 1024 ? 'bg-[#5D7C59] text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
              <Monitor size={14} />
            </button>
            <button onClick={() => setPreviewWidth(768)} title="Tablet" className={`p-1.5 rounded transition-colors ${previewWidth === 768 ? 'bg-[#5D7C59] text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
              <Tablet size={14} />
            </button>
            <button onClick={() => setPreviewWidth(375)} title="Mobile" className={`p-1.5 rounded transition-colors ${previewWidth === 375 ? 'bg-[#5D7C59] text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
              <Smartphone size={14} />
            </button>
            <button onClick={() => setPreviewWidth('100%')} title="Fill Space" className={`p-1.5 rounded transition-colors ${previewWidth === '100%' ? 'bg-[#5D7C59] text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
              <Maximize size={14} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex items-start justify-center p-4 bg-gray-200/50 dark:bg-black/20 overflow-auto">
          <div 
            ref={containerRef}
            className="bg-white rounded-lg shadow-sm flex flex-col mx-auto relative group"
            style={{ 
              width: previewWidth === '100%' ? '100%' : `${previewWidth}px`, 
              minHeight: '400px', 
              height: '100%', 
              border: previewWidth !== '100%' ? '8px solid #333' : 'none' 
            }}
          >
            <iframe
              ref={iframeRef}
              title="Preview"
              className="w-full h-full border-none bg-white relative z-0 min-h-[400px]"
              sandbox="allow-scripts allow-modals allow-same-origin"
            />

            {/* Drag Handle Overlay */}
            {previewWidth !== '100%' && (
              <div 
                className="absolute top-0 right-[-24px] bottom-0 w-12 cursor-ew-resize flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const startX = e.clientX;
                  const startWidth = typeof previewWidth === 'number' ? previewWidth : containerRef.current.offsetWidth;
                  
                  const overlay = document.createElement('div');
                  overlay.style.position = 'fixed';
                  overlay.style.inset = '0';
                  overlay.style.zIndex = '9999';
                  overlay.style.cursor = 'ew-resize';
                  document.body.appendChild(overlay);

                  const onMouseMove = (moveEvent) => {
                    const deltaX = moveEvent.clientX - startX;
                    const newWidth = Math.max(320, startWidth + (deltaX * 2));
                    setPreviewWidth(newWidth);
                  };

                  const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    document.body.removeChild(overlay);
                  };

                  document.addEventListener('mousemove', onMouseMove);
                  document.addEventListener('mouseup', onMouseUp);
                }}
              >
                <div className="w-1.5 h-16 bg-[#5D7C59] rounded-full shadow-md" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Instructions & Editor */}
      <div className="flex flex-col lg:flex-row min-h-[400px]">
        
        {/* Left: Instructions Sidebar */}
        <div className="w-full lg:w-80 shrink-0 p-6 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-white/10 flex flex-col gap-6 bg-[#FAFCFA] dark:bg-[#1A211A] overflow-y-auto">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5D7C59] uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} /> Instructions
              </span>
              <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-white/10 px-2 py-1 rounded-md">
                {question.points} Pts
              </span>
            </div>
            <h3 className="text-[14px] text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap font-medium">
              {question.content}
            </h3>
          </div>

          {question.config?.mockupUrl && (
            <div className="flex flex-col gap-3 pt-5 border-t border-gray-200 dark:border-white/10">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Target UI</span>
              <img 
                src={question.config.mockupUrl} 
                alt="UI Mockup" 
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 object-contain bg-white dark:bg-black/20 shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Right: Editor Pane */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1E1E1E]">
          <div className="flex items-center justify-between px-4 py-3 bg-[#181818] border-b border-black/50">
            <div className="flex gap-1 p-0.5 bg-[#252526] rounded-lg border border-white/5">
              {['html', 'css', 'js'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setActiveTab(lang)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                    activeTab === lang 
                      ? 'bg-[#5D7C59] text-white shadow-sm' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400 hidden sm:inline">Framework:</span>
              <select 
                value={selectedFramework}
                onChange={handleFrameworkChange}
                className="bg-[#2D2D30] border border-white/10 text-xs text-gray-200 py-1.5 px-3 rounded-md outline-none focus:border-[#5D7C59] transition-colors shadow-sm cursor-pointer hover:border-white/20"
              >
                {CSS_FRAMEWORKS.map(fw => (
                  <option key={fw.id} value={fw.id}>{fw.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex-1 relative min-h-[400px]">
            <Editor
              height="100%"
              language={activeTab === 'js' ? 'javascript' : activeTab}
              theme="vs-dark"
              value={getCurrentCode()}
              onChange={(val) => handleUpdate(activeTab, val)}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                roundedSelection: false,
                wordWrap: 'on'
              }}
              loading={<div className="flex items-center justify-center h-full text-gray-500"><Loader2 size={24} className="animate-spin" /></div>}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontendRenderer;
