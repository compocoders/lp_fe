import React, { useEffect, useState, useRef } from 'react';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';
import api from '../../../api/axios';

const CaseStudyBuilder = ({ questions, setQuestions }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (questions.length === 0 || questions[0]?.questionType !== 'case_study_problem') {
      setQuestions([{ id: Date.now().toString(), questionType: 'case_study_problem', content: '', points: 100, config: { attachments: [] } }]);
    }
  }, []);

  const problem = questions[0] || { config: { attachments: [] } };
  const attachments = problem.config?.attachments || [];

  const updateProblem = (updates) => {
    const updatedProblem = { ...problem, ...updates };
    if (updates.config) {
      updatedProblem.config = { ...problem.config, ...updates.config };
    }
    setQuestions([updatedProblem]);
  };

  const handleFileChange = async (e) => {
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
      
      const newAttachments = [...attachments, { fileUrl, fileName }];
      updateProblem({ config: { attachments: newAttachments } });
    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    updateProblem({ config: { attachments: newAttachments } });
  };

  if (!problem.id) return null;

  return (
    <div className="bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-4 md:p-6 flex flex-col gap-4 md:gap-6 transition-colors duration-200">
      <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1 md:mb-2">Interactive Case Study Details</h3>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Case Scenario / Prompt</label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Provide the medical, engineering, or business scenario. Be as detailed as needed.</p>
        <textarea
          value={problem.content || ''}
          onChange={e => updateProblem({ content: e.target.value })}
          placeholder="A 45-year-old male presents to the ER with..."
          className="w-full bg-[#FAFCFA] dark:bg-[#232B23] rounded-xl px-4 py-3 text-[15px] text-gray-800 dark:text-gray-200 outline-none border border-gray-200 dark:border-white/10 focus:border-[#5D7C59] transition-colors min-h-[160px] resize-y"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reference Materials & Attachments</label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Upload files that students need to analyze (X-Rays, CAD blueprints, Dataset PDFs).</p>
        
        <div className="flex flex-col gap-3">
          {attachments.map((att, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-[#FAFCFA] dark:bg-[#232B23] rounded-xl border border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-3 overflow-hidden">
                <File size={18} className="text-[#5D7C59] shrink-0" />
                <a href={att.fileUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-[#5D7C59] hover:underline truncate">
                  {att.fileName}
                </a>
              </div>
              <button 
                onClick={() => removeAttachment(index)}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5 border-none cursor-pointer bg-transparent shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          <div 
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all
              ${isUploading ? 'border-gray-200 dark:border-white/5 opacity-50' : 'border-gray-300 dark:border-white/10 hover:border-[#5D7C59] hover:bg-[#5D7C59]/5 cursor-pointer'}
            `}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              disabled={isUploading}
            />
            
            {isUploading ? (
              <div className="flex items-center gap-2">
                <Loader2 size={18} className="text-[#5D7C59] animate-spin" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Uploading file...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-center text-gray-500 dark:text-gray-400">
                <UploadCloud size={20} />
                <span className="text-sm font-medium">Click to attach a file</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyBuilder;
