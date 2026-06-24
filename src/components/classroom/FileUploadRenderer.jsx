import React, { useState, useRef } from 'react';
import { UploadCloud, File, Loader2, X, Download } from 'lucide-react';
import api from '../../api/axios';

const FileUploadRenderer = ({ question, value, onChange, disabled }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const currentFile = value?.fileUrl || null;
  const currentFileName = value?.fileName || null;

  const handleFileChange = async (e) => {
    if (disabled || isUploading) return;
    
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert("File is too large. Maximum size is 25MB.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/s3/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const fileUrl = response.data.fileUrl;
      const fileName = file.name;
      
      onChange(question.id, { fileUrl, fileName });
    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    if (disabled) return;
    onChange(question.id, null); // Clear answer
  };

  return (
    <div className="bg-white dark:bg-[#1A211A] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
            <UploadCloud size={20} className="text-red-600 dark:text-red-500" />
          </div>
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap">
            {question.content}
          </h3>
        </div>
        <span className="text-[11px] font-bold text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md shrink-0">
          {question.points} Pts
        </span>
      </div>

      <div className="mt-2">
        {currentFile ? (
          <div className="flex items-center justify-between p-4 bg-[#FAFCFA] dark:bg-[#232B23] rounded-xl border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 overflow-hidden">
              <File size={20} className="text-[#5D7C59] shrink-0" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{currentFileName || 'Uploaded File'}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a 
                href={currentFile} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 text-gray-400 hover:text-[#5D7C59] transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                title="Download / View"
              >
                <Download size={18} />
              </a>
              {!disabled && (
                <button 
                  onClick={handleRemove}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5 border-none cursor-pointer bg-transparent"
                  title="Remove file"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div 
            onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all
              ${disabled ? 'border-gray-200 dark:border-white/5 opacity-50' : 'border-gray-300 dark:border-white/10 hover:border-[#5D7C59] hover:bg-[#5D7C59]/5 cursor-pointer'}
            `}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              disabled={disabled || isUploading}
            />
            
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 size={24} className="text-[#5D7C59] animate-spin" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Uploading securely...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-[#232B23] rounded-full flex items-center justify-center mb-1">
                  <UploadCloud size={24} className="text-gray-400" />
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {disabled ? 'No file uploaded' : 'Click to upload a file'}
                </span>
                {!disabled && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 max-w-[250px]">
                    Supports PDF, DOCX, PPTX, ZIP, etc. (Max 25MB)
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadRenderer;
