import React, { useState, useMemo, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Loader2, Monitor, Tablet, Smartphone, Maximize, Play, FileText, Lock, ChevronDown, ChevronUp } from 'lucide-react';

const CSS_FRAMEWORKS = [
  { id: 'native',    name: 'Native CSS',   cdn: '' },
  { id: 'tailwind',  name: 'Tailwind CSS', cdn: '<script src="https://cdn.tailwindcss.com"></script>' },
  { id: 'bootstrap', name: 'Bootstrap 5',  cdn: '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>' },
];

// Device presets: { label, icon, width in px (null = fill) }
const DEVICES = [
  { id: 'fill',    label: 'Fill',    width: null,  icon: 'fill' },
  { id: 'desktop', label: '1280px',  width: 1280,  icon: 'desktop' },
  { id: 'tablet',  label: '768px',   width: 768,   icon: 'tablet' },
  { id: 'mobile',  label: '375px',   width: 375,   icon: 'mobile' },
];

const PREVIEW_HEIGHT = 340; // px — fixed height of the preview area

const FrontendRenderer = ({ question, value, onChange }) => {
  const [activeTab, setActiveTab]         = useState('html');
  const [activeDevice, setActiveDevice]   = useState('fill');
  const [instrCollapsed, setInstrCollapsed] = useState(false);
  const previewAreaRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Track the actual pixel width of the preview wrapper
  useEffect(() => {
    if (!previewAreaRef.current) return;
    const ro = new ResizeObserver(entries => {
      setContainerWidth(entries[0].contentRect.width);
    });
    ro.observe(previewAreaRef.current);
    return () => ro.disconnect();
  }, []);

  // Framework is LOCKED to whatever the teacher configured
  const lockedFramework = question.config?.cssFramework || 'native';
  const frameworkInfo   = CSS_FRAMEWORKS.find(fw => fw.id === lockedFramework) || CSS_FRAMEWORKS[0];

  // Editor code values
  const currentVal = value || {};
  const htmlCode = currentVal.html !== undefined ? currentVal.html : (question.config?.starterHtml || '');
  const cssCode  = currentVal.css  !== undefined ? currentVal.css  : (question.config?.starterCss  || '');
  const jsCode   = currentVal.js   !== undefined ? currentVal.js   : (question.config?.starterJs   || '');

  const handleUpdate = (type, newCode) => {
    onChange(question.id, {
      html: htmlCode, css: cssCode, js: jsCode,
      cssFramework: lockedFramework,
      [type]: newCode,
    });
  };

  // Build the srcdoc once; update on code/framework change
  const srcDoc = useMemo(() => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${frameworkInfo.cdn}
    <style>
${cssCode}
    </style>
  </head>
  <body>
${htmlCode}
    <script>try { ${jsCode} } catch(e) { console.error(e); }</script>
  </body>
</html>`, [htmlCode, cssCode, jsCode, lockedFramework]);

  const getCurrentCode = () => {
    if (activeTab === 'html') return htmlCode;
    if (activeTab === 'css')  return cssCode;
    return jsCode;
  };

  // Compute scale + iframe dimensions for device simulation
  const device = DEVICES.find(d => d.id === activeDevice);
  let iframeWidth, scale, wrapperHeight;

  if (!device.width || containerWidth === 0) {
    // Fill mode — iframe fills the container naturally
    iframeWidth = '100%';
    scale = 1;
    wrapperHeight = PREVIEW_HEIGHT;
  } else {
    // Device mode — scale the device width to fit the container
    scale = Math.min(1, containerWidth / device.width);
    iframeWidth = device.width;
    // The visible height of the scaled frame inside the container
    wrapperHeight = Math.round(PREVIEW_HEIGHT / scale);
  }

  return (
    <div className="bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden flex flex-col transition-colors duration-200">

      {/* ─── LIVE PREVIEW ─────────────────────────────────────────── */}
      <div className="flex flex-col border-b border-gray-100 dark:border-white/10">

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-[#232B23] border-b border-gray-100 dark:border-white/10 shrink-0">
          <span className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300">
            <Play size={13} className="text-[#5D7C59]" />
            Live Preview
            {activeDevice !== 'fill' && (
              <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 ml-1 tabular-nums">
                {device.width}px · {Math.round(scale * 100)}%
              </span>
            )}
          </span>

          {/* Device toggles */}
          <div className="flex gap-0.5 bg-white dark:bg-[#1A211A] p-1 rounded-lg border border-gray-200 dark:border-white/10">
            {DEVICES.map(d => {
              const Icon = d.id === 'fill' ? Maximize
                         : d.id === 'desktop' ? Monitor
                         : d.id === 'tablet'  ? Tablet
                         : Smartphone;
              return (
                <button
                  key={d.id}
                  onClick={() => setActiveDevice(d.id)}
                  title={d.label}
                  className={`p-1.5 rounded transition-colors ${
                    activeDevice === d.id
                      ? 'bg-[#5D7C59] text-white'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon size={13} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Preview area — fixed height, clips overflow so the iframe can't escape */}
        <div
          ref={previewAreaRef}
          className="w-full overflow-hidden bg-[#e8eaed] dark:bg-black/30"
          style={{ height: `${PREVIEW_HEIGHT}px` }}
        >
          {device.width && containerWidth > 0 ? (
            /* ── Device simulation: scale + translate the iframe ── */
            <div
              style={{
                width: device.width,
                height: wrapperHeight,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              {/* Device chrome */}
              <div
                className="w-full h-full rounded-xl overflow-hidden shadow-2xl"
                style={{ border: '8px solid #2a2a2a', background: '#fff' }}
              >
                <iframe
                  key={`${srcDoc}-${activeDevice}`}
                  title="Live Preview"
                  className="block border-none bg-white"
                  style={{ width: '100%', height: '100%' }}
                  srcDoc={srcDoc}
                  sandbox="allow-scripts allow-modals allow-same-origin"
                />
              </div>
            </div>
          ) : (
            /* ── Fill mode: just render the iframe full width ── */
            <iframe
              key={`${srcDoc}-fill`}
              title="Live Preview"
              className="block border-none bg-white w-full h-full"
              srcDoc={srcDoc}
              sandbox="allow-scripts allow-modals allow-same-origin"
            />
          )}
        </div>
      </div>

      {/* ─── INSTRUCTIONS ─────────────────────────────────────────── */}
      <div className="border-b border-gray-100 dark:border-white/10 bg-[#FAFCFA] dark:bg-[#1A211A]">

        {/* Collapsible header */}
        <button
          onClick={() => setInstrCollapsed(v => !v)}
          className="w-full flex items-center justify-between px-4 md:px-6 py-3 cursor-pointer border-none bg-transparent group"
        >
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-[#5D7C59]" />
            <span className="text-xs font-bold text-[#5D7C59] uppercase tracking-widest">Instructions</span>
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded-md ml-1">
              {question.points} Pts
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
              <Lock size={11} className="text-gray-400" />
              <span>{frameworkInfo.name}</span>
            </div>
            {instrCollapsed
              ? <ChevronDown size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
              : <ChevronUp   size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
            }
          </div>
        </button>

        {/* Body */}
        {!instrCollapsed && (
          <div className="px-4 md:px-6 pb-5 flex flex-col gap-4">
            <div className={`grid gap-4 md:gap-6 ${question.config?.mockupUrl ? 'grid-cols-1 md:grid-cols-[1fr_240px] lg:grid-cols-[1fr_280px]' : 'grid-cols-1'}`}>
              <p className="text-[13px] md:text-[14px] text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                {question.content}
              </p>
              {question.config?.mockupUrl && (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target UI</span>
                  <img
                    src={question.config.mockupUrl}
                    alt="UI Mockup"
                    className="w-full rounded-xl border border-gray-200 dark:border-white/10 object-contain bg-white dark:bg-black/20 shadow-sm"
                  />
                </div>
              )}
            </div>
            {/* Framework pill — mobile only */}
            <div className="flex sm:hidden items-center gap-2 pt-2 border-t border-gray-200 dark:border-white/10">
              <Lock size={12} className="text-gray-400" />
              <span className="text-[11px] text-gray-500 font-semibold">Framework:</span>
              <span className="text-[11px] font-bold text-[#5D7C59] bg-[#5D7C59]/10 px-2 py-0.5 rounded-md">{frameworkInfo.name}</span>
            </div>
          </div>
        )}
      </div>

      {/* ─── CODE EDITOR ──────────────────────────────────────────── */}
      <div className="flex flex-col bg-[#1E1E1E]">

        {/* Editor toolbar */}
        <div className="flex items-center justify-between px-3 md:px-4 py-2.5 bg-[#181818] border-b border-black/40 shrink-0">
          <div className="flex gap-1 p-0.5 bg-[#252526] rounded-lg border border-white/5">
            {['html', 'css', 'js'].map(lang => (
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                className={`px-3 md:px-4 py-1.5 text-[11px] font-bold rounded-md transition-all uppercase tracking-wider ${
                  activeTab === lang
                    ? 'bg-[#5D7C59] text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest hidden md:inline">Framework</span>
            <div className="flex items-center gap-1.5 bg-[#2D2D30] border border-white/10 text-[11px] text-gray-200 py-1.5 px-3 rounded-lg">
              <Lock size={10} className="text-gray-500" />
              <span className="font-semibold">{frameworkInfo.name}</span>
            </div>
          </div>
        </div>

        {/* Monaco editor */}
        <div className="min-h-[320px] md:min-h-[380px] lg:min-h-[440px]">
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
              wordWrap: 'on',
            }}
            loading={
              <div className="flex items-center justify-center h-full text-gray-500">
                <Loader2 size={24} className="animate-spin" />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default FrontendRenderer;
