import React, { useState, useEffect } from 'react';
import {
  X, Download, FileText, Image, Presentation, FileSpreadsheet,
  File, ExternalLink, Loader2, AlertCircle, ZoomIn, ZoomOut,
  Maximize2, RefreshCw,
} from 'lucide-react';

/* ─── helpers ─── */
const getExtension = (url = '') => {
  try {
    const pathname = new URL(url).pathname;
    return pathname.split('.').pop().toLowerCase();
  } catch {
    return url.split('.').pop().split('?')[0].toLowerCase();
  }
};

const getFileType = (url = '') => {
  const ext = getExtension(url);
  if (['pdf'].includes(ext)) return 'pdf';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) return 'image';
  if (['ppt', 'pptx', 'pps', 'ppsx', 'ppsm'].includes(ext)) return 'ppt';
  if (['doc', 'docx'].includes(ext)) return 'doc';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'sheet';
  return 'other';
};

const FILE_TYPE_META = {
  pdf:   { icon: FileText,         label: 'PDF Document',       color: '#E53E3E' },
  image: { icon: Image,            label: 'Image',              color: '#5D7C59' },
  ppt:   { icon: Presentation,     label: 'Presentation',       color: '#DD6B20' },
  doc:   { icon: FileText,         label: 'Word Document',      color: '#3182CE' },
  sheet: { icon: FileSpreadsheet,  label: 'Spreadsheet',        color: '#38A169' },
  other: { icon: File,             label: 'File',               color: '#718096' },
};

/* ─── Preview renderers ─── */

const PdfPreview = ({ url }) => {
  const [loading, setLoading] = useState(true);
  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#FAFCFA] dark:bg-[#121612] z-10">
          <Loader2 size={28} className="text-[#5D7C59] animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading PDF…</p>
        </div>
      )}
      <iframe
        src={`${url}#toolbar=1&navpanes=1&scrollbar=1`}
        title="PDF Preview"
        className="w-full h-full border-0"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};

const ImagePreview = ({ url, title }) => {
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white/90 dark:bg-[#1A211A]/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10 shadow-md p-1">
        <button onClick={() => setZoom(z => Math.max(0.25, +(z - 0.25).toFixed(2)))}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer border-none bg-transparent text-gray-600 dark:text-gray-300">
          <ZoomOut size={14} />
        </button>
        <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300 min-w-[36px] text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.min(4, +(z + 0.25).toFixed(2)))}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer border-none bg-transparent text-gray-600 dark:text-gray-300">
          <ZoomIn size={14} />
        </button>
        <button onClick={() => setZoom(1)}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer border-none bg-transparent text-gray-500 dark:text-gray-400">
          <RefreshCw size={12} />
        </button>
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#FAFCFA] dark:bg-[#121612] z-10">
          <Loader2 size={28} className="text-[#5D7C59] animate-spin" />
        </div>
      )}
      <div className="flex-1 overflow-auto flex items-center justify-center bg-[#F0F4F0] dark:bg-[#0D110D] cursor-zoom-in" style={{ minHeight: 0 }}>
        <img
          src={url}
          alt={title}
          onLoad={() => setLoading(false)}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.2s ease' }}
          className="max-w-none shadow-xl rounded-lg"
        />
      </div>
    </div>
  );
};

const OfficePreview = ({ url, title, type }) => {
  const [loading, setLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);

  // Microsoft Office Online Viewer - works with publicly accessible URLs
  const msViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;

  // Start a 12-second timeout: if the iframe hasn't loaded by then, show fallback
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
      setTimedOut(true);
    }, 12000);
    return () => clearTimeout(t);
  }, [url]);

  if (timedOut) return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5 bg-[#FAFCFA] dark:bg-[#121612] p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
        <AlertCircle size={28} className="text-amber-500" />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1.5">Preview couldn't load</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed max-w-xs mx-auto">
          Office file preview requires the file to be publicly accessible. Your file may be behind authentication. Download it to view the contents.
        </p>
      </div>
      <a
        href={url}
        download
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#5D7C59] to-[#4A6447] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline"
      >
        <Download size={15} /> Download File
      </a>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-[#5D7C59] dark:text-[#7A9A7B] underline cursor-pointer"
      >
        Or open in new tab
      </a>
    </div>
  );

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#FAFCFA] dark:bg-[#121612] z-10">
          <Loader2 size={28} className="text-[#5D7C59] animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading preview…</p>
          <p className="text-xs text-gray-300 dark:text-gray-600">Using Microsoft Office Viewer</p>
        </div>
      )}
      <iframe
        src={msViewerUrl}
        title={title}
        className="w-full h-full border-0"
        onLoad={() => { setLoading(false); setTimedOut(false); }}
      />
    </div>
  );
};

const UnsupportedPreview = ({ url, ext }) => (
  <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-[#FAFCFA] dark:bg-[#121612] p-8 text-center">
    <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
      <File size={36} className="text-gray-300 dark:text-gray-600" />
    </div>
    <div>
      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Preview not available</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
        <span className="font-semibold uppercase">.{ext}</span> files can't be previewed in the browser.<br />
        Download it to view the contents.
      </p>
    </div>
    <a
      href={url}
      download
      className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#5D7C59] to-[#4A6447] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline"
    >
      <Download size={15} /> Download File
    </a>
  </div>
);

/* ════════ Main Modal ════════ */
const MaterialPreviewModal = ({ isOpen, onClose, material }) => {
  const [key, setKey] = useState(0); // force iframe reload

  useEffect(() => {
    if (isOpen) {
      setKey(k => k + 1);
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!isOpen || !material) return null;

  const { fileUrl, title, description } = material;
  const fileType = getFileType(fileUrl);
  const ext = getExtension(fileUrl);
  const meta = FILE_TYPE_META[fileType] || FILE_TYPE_META.other;
  const MetaIcon = meta.icon;

  const renderPreview = () => {
    switch (fileType) {
      case 'pdf':   return <PdfPreview key={key} url={fileUrl} />;
      case 'image': return <ImagePreview key={key} url={fileUrl} title={title} />;
      case 'ppt':
      case 'doc':
      case 'sheet': return <OfficePreview key={key} url={fileUrl} title={title} type={fileType} />;
      default:      return <UnsupportedPreview key={key} url={fileUrl} ext={ext} />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-stretch"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.18s ease-out' }}
    >
      {/* Modal container */}
      <div
        className="relative flex flex-col w-full h-full"
        style={{ animation: 'slideUpIn 0.22s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {/* ── Top bar ── */}
        <div className="shrink-0 flex items-center gap-3 px-4 py-3 bg-white/95 dark:bg-[#1A211A]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10 shadow-sm">
          {/* File type badge */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ background: `${meta.color}18` }}
          >
            <MetaIcon size={18} style={{ color: meta.color }} />
          </div>

          {/* Title + description */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate leading-tight">{title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ background: `${meta.color}15`, color: meta.color }}
              >
                {meta.label}
              </span>
              {description && (
                <span className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{description}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Reload */}
            <button
              onClick={() => setKey(k => k + 1)}
              title="Reload preview"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 text-[12px] font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw size={13} /> Reload
            </button>
            {/* Open in new tab */}
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              title="Open in new tab"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 text-[12px] font-semibold transition-colors cursor-pointer no-underline"
            >
              <ExternalLink size={13} /> Open
            </a>
            {/* Download */}
            <a
              href={fileUrl}
              download
              title="Download"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#5D7C59] to-[#4A6447] text-white text-[12px] font-bold transition-all hover:shadow-md hover:-translate-y-px cursor-pointer no-underline"
            >
              <Download size={13} /> Download
            </a>
            {/* Close */}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer border-none bg-transparent ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Preview content ── */}
        <div className="flex-1 overflow-hidden bg-[#FAFCFA] dark:bg-[#0D110D]" style={{ minHeight: 0 }}>
          {renderPreview()}
        </div>
      </div>

      {/* Keyframe definitions */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUpIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default MaterialPreviewModal;
