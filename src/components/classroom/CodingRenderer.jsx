import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Loader2, Code2, Terminal } from 'lucide-react';
import api from '../../api/axios';

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', version: '18.15.0', monaco: 'javascript' },
  { id: 'python', name: 'Python', version: '3.10.0', monaco: 'python' },
  { id: 'java', name: 'Java', version: '15.0.2', monaco: 'java' },
  { id: 'cpp', name: 'C++', version: '10.2.0', monaco: 'cpp' },
];

const CodingRenderer = ({ question, value, onChange, disabled }) => {
  const [code, setCode] = useState(value?.code || question?.config?.starterCode || '// Write your code here\n');
  const [language, setLanguage] = useState(value?.language || question?.config?.language || 'javascript');
  const [output, setOutput] = useState(value?.output || '');
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    onChange(question.id, { code, language: newLang, output });
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    onChange(question.id, { code: newCode, language, output });
  };

  const runCode = async () => {
    if (!code.trim()) return;
    setIsRunning(true);
    setOutput('Running code...');
    try {
      const response = await api.post('/compiler/run', {
        language: language,
        sourceCode: code,
        stdin: ''
      });
      
      const runResult = response.data;
      // Handle the local backend response format
      let finalOutput = '';
      if (runResult.status === 'error') {
        finalOutput = runResult.error || runResult.stderr || 'Execution failed with an error.';
      } else {
        finalOutput = runResult.stdout || runResult.stderr || 'Code executed successfully with no output.';
      }
      
      setOutput(finalOutput);
      onChange(question.id, { code, language, output: finalOutput });
    } catch (err) {
      console.error('Execution error', err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to execute code. Please try again.';
      setOutput(errorMsg);
      onChange(question.id, { code, language, output: errorMsg });
    } finally {
      setIsRunning(false);
    }
  };

  const currentLangConfig = LANGUAGES.find(l => l.id === language);

  return (
    <div className="bg-white dark:bg-[#1A211A] rounded-2xl p-3 sm:p-4 md:p-6 shadow-sm border border-gray-100 dark:border-white/10 flex flex-col gap-3 md:gap-4">
      <div className="flex items-start justify-between gap-3 md:gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#5D7C59]/10 flex items-center justify-center shrink-0">
            <Code2 size={20} className="text-[#5D7C59]" />
          </div>
          <h3 className="text-sm md:text-[15px] font-bold text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap">
            {question.content}
          </h3>
        </div>
        <span className="text-[10px] md:text-[11px] font-bold text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md shrink-0">
          {question.points} Pts
        </span>
      </div>

      <div className="flex flex-col border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden mt-2">
        {/* Editor Header */}
        <div className="bg-[#FAFCFA] dark:bg-[#232B23] px-3 py-2 md:px-4 md:py-2 flex items-center justify-between border-b border-gray-200 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 dark:bg-white/5 rounded-md">
            <span className="text-[12px] font-bold text-gray-700 dark:text-gray-300">
              {currentLangConfig?.name || 'JavaScript'}
            </span>
          </div>

          <button
            onClick={runCode}
            disabled={disabled || isRunning}
            className="flex items-center gap-1.5 px-2.5 py-1.5 md:px-3 md:py-1.5 bg-[#5D7C59] hover:bg-[#4A6447] text-white text-[11px] md:text-[12px] font-bold rounded-lg transition-colors border-none cursor-pointer disabled:opacity-50"
          >
            {isRunning ? <Loader2 size={12} className="animate-spin md:w-3.5 md:h-3.5" /> : <Play size={12} fill="currentColor" className="md:w-3.5 md:h-3.5" />}
            <span className="hidden sm:inline">Run Code</span>
            <span className="sm:hidden">Run</span>
          </button>
        </div>

        {/* Monaco Editor */}
        <div className="h-[300px] w-full relative">
          <Editor
            height="100%"
            language={currentLangConfig?.monaco || 'javascript'}
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16 },
              readOnly: disabled,
              scrollBeyondLastLine: false,
              roundedSelection: false,
            }}
          />
        </div>

        {/* Terminal Output */}
        <div className="bg-[#1e1e1e] border-t border-white/10 p-4 shrink-0 max-h-[200px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <Terminal size={14} className="text-gray-400" />
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Output</span>
          </div>
          <pre className="text-[13px] font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
            {output || <span className="text-gray-600 italic">No output yet. Click 'Run Code' to test your solution.</span>}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodingRenderer;
