import React from 'react';
import { FileText, File, Download } from 'lucide-react';

const CaseStudyRenderer = ({ question, value, onChange, disabled }) => {
  const attachments = question.config?.attachments || [];

  const handleTextChange = (e) => {
    if (disabled) return;
    onChange(question.id, { text: e.target.value });
  };

  const isImage = (fileName) => {
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName);
  };

  return (
    <div className="bg-white dark:bg-[#1A211A] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col md:flex-row">
      {/* Left Pane: Scenario & Attachments */}
      <div className="md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-gray-100 dark:border-white/10 flex flex-col gap-6 bg-[#FAFCFA] dark:bg-[#232B23]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
            <FileText size={20} className="text-indigo-600 dark:text-indigo-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Case Study Scenario</h3>
        </div>
        
        <div className="text-[15px] leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
          {question.content}
        </div>

        {attachments.length > 0 && (
          <div className="flex flex-col gap-3 mt-4">
            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Reference Materials</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {attachments.map((att, index) => (
                <a 
                  key={index}
                  href={att.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A211A] hover:border-[#5D7C59] transition-all group"
                >
                  {isImage(att.fileName) ? (
                    <div className="h-32 w-full bg-gray-100 dark:bg-black/20 relative">
                      <img src={att.fileUrl} alt={att.fileName} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-32 w-full bg-gray-50 dark:bg-black/10 flex items-center justify-center">
                      <File size={32} className="text-gray-300 dark:text-gray-600 group-hover:text-[#5D7C59] transition-colors" />
                    </div>
                  )}
                  <div className="p-3 flex items-center justify-between gap-2 border-t border-gray-100 dark:border-white/5">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{att.fileName}</span>
                    <Download size={14} className="text-gray-400 group-hover:text-[#5D7C59]" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Pane: Student Response Area */}
      <div className="md:w-1/2 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-bold text-gray-900 dark:text-white">Your Analysis</h3>
          <span className="text-[11px] font-bold text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md shrink-0">
            {question.points} Pts
          </span>
        </div>
        
        <textarea
          value={value?.text || ''}
          onChange={handleTextChange}
          disabled={disabled}
          placeholder="Write your analysis, diagnosis, or solution here..."
          className={`flex-1 w-full bg-[#FAFCFA] dark:bg-[#232B23] rounded-xl px-4 py-4 text-[15px] text-gray-800 dark:text-gray-200 outline-none border border-gray-200 dark:border-white/10 focus:border-[#5D7C59] transition-colors resize-none min-h-[300px] ${disabled ? 'opacity-75 cursor-default' : ''}`}
        />
      </div>
    </div>
  );
};

export default CaseStudyRenderer;
