import React, { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Loader2, UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import api from '../../../api/axios'; // Adjust path if needed, usually it's in src/api/axios

const CSS_FRAMEWORKS = [
  { id: 'native', name: 'Native CSS' },
  { id: 'tailwind', name: 'Tailwind CSS' },
  { id: 'bootstrap', name: 'Bootstrap 5' },
];

const FrontendBuilder = ({ questions, setQuestions }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('html');

  useEffect(() => {
    if (questions.length === 0 || questions[0]?.questionType !== 'frontend_problem') {
      setQuestions([{
        id: Date.now().toString(),
        questionType: 'frontend_problem',
        content: 'Build the UI based on the instructions or mockup provided.',
        points: 100,
        config: {
          mockupUrl: '',
          cssFramework: 'native',
          starterHtml: '<!-- Write your HTML here -->\n<div class="container">\n  <h1>Hello World</h1>\n</div>',
          starterCss: '/* Write your CSS here */\n.container {\n  text-align: center;\n  padding: 2rem;\n}',
          starterJs: '// Write your JavaScript here\nconsole.log("Ready!");'
        }
      }]);
    }
  }, []);

  const problem = questions[0] || { config: {} };

  const updateProblem = (updates) => {
    const updatedProblem = { ...problem, ...updates };
    if (updates.config) {
      updatedProblem.config = { ...problem.config, ...updates.config };
    }
    setQuestions([updatedProblem]);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/s3/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const fileUrl = response.data.fileUrl || response.data.url;
      updateProblem({ config: { mockupUrl: fileUrl } });
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload mockup image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!problem.id) return null;

  const currentCode = problem.config?.[`starter${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`] || '';

  return (
    <div className="bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-4 md:p-6 flex flex-col gap-4 md:gap-5 transition-colors duration-200">
      <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1 md:mb-2">Frontend UI Details</h3>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Instructions / Problem Statement</label>
        <textarea
          value={problem.content || ''}
          onChange={e => updateProblem({ content: e.target.value })}
          placeholder="Describe what the student should build..."
          className="w-full bg-[#FAFCFA] dark:bg-[#232B23] rounded-xl px-4 py-3 text-[15px] text-gray-800 dark:text-gray-200 outline-none border border-gray-200 dark:border-white/10 focus:border-[#5D7C59] transition-colors min-h-[100px] resize-y"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">UI Mockup Image (Optional)</label>
        
        {problem.config?.mockupUrl ? (
          <div className="relative inline-block w-fit">
            <img 
              src={problem.config.mockupUrl} 
              alt="Mockup" 
              className="max-h-[200px] rounded-xl border border-gray-200 dark:border-white/10 object-contain bg-gray-50 dark:bg-black/20"
            />
            <button
              onClick={() => updateProblem({ config: { mockupUrl: '' } })}
              className="absolute -top-2 -right-2 w-7 h-7 bg-white dark:bg-gray-800 text-red-500 rounded-full shadow-md flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-gray-100 dark:border-white/10"
              title="Remove Mockup"
            >
              <X size={14} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-2 bg-[#FAFCFA] dark:bg-[#232B23] border border-gray-200 dark:border-white/10 hover:border-[#5D7C59] text-gray-700 dark:text-gray-300 rounded-xl transition-colors disabled:opacity-50"
            >
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
              <span className="text-sm font-medium">{isUploading ? 'Uploading...' : 'Upload Image'}</span>
            </button>
            <span className="text-xs text-gray-500">Provide a reference image for the students.</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CSS Framework Support</label>
          <select 
            value={problem.config?.cssFramework || 'native'}
            onChange={e => updateProblem({ config: { cssFramework: e.target.value } })}
            className="bg-gray-100 dark:bg-white/5 border-none text-sm text-gray-800 dark:text-gray-200 py-1.5 px-3 rounded-lg outline-none focus:ring-2 focus:ring-[#5D7C59]/30 transition-shadow cursor-pointer"
          >
            {CSS_FRAMEWORKS.map(fw => (
              <option key={fw.id} value={fw.id} className="bg-white dark:bg-[#1A211A] text-gray-900 dark:text-gray-100">{fw.name}</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-gray-500 mb-1">Select the default styling framework available in the student's environment.</p>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Starter Code</label>
          <div className="flex bg-gray-100 dark:bg-[#232B23] rounded-lg p-1">
            {['html', 'css', 'js'].map(lang => (
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                className={`px-4 py-1 text-xs font-bold rounded-md transition-colors ${
                  activeTab === lang 
                    ? 'bg-white dark:bg-[#3A453A] text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[250px] w-full rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-[#1e1e1e]">
          <Editor
            height="100%"
            language={activeTab === 'js' ? 'javascript' : activeTab}
            theme="vs-dark"
            value={currentCode}
            onChange={(value) => {
              const key = `starter${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`;
              updateProblem({ config: { [key]: value } });
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
              roundedSelection: false,
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              scrollbar: { vertical: 'hidden' },
              lineNumbersMinChars: 3
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

export default FrontendBuilder;
