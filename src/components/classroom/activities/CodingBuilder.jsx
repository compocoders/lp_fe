import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Loader2 } from 'lucide-react';

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', monaco: 'javascript' },
  { id: 'python', name: 'Python', monaco: 'python' },
  { id: 'java', name: 'Java', monaco: 'java' },
  { id: 'cpp', name: 'C++', monaco: 'cpp' },
];

const CodingBuilder = ({ questions, setQuestions }) => {
  useEffect(() => {
    if (questions.length === 0 || questions[0]?.questionType !== 'coding_problem') {
      setQuestions([{ id: Date.now().toString(), questionType: 'coding_problem', content: '', points: 100, config: { expectedOutput: '', starterCode: '// Write your starter code here\n', language: 'javascript' } }]);
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

  if (!problem.id) return null;

  return (
    <div className="bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-4 md:p-6 flex flex-col gap-3 md:gap-4 transition-colors duration-200">
      <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1 md:mb-2">Coding Challenge Details</h3>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Problem Statement</label>
        <textarea
          value={problem.content || ''}
          onChange={e => updateProblem({ content: e.target.value })}
          placeholder="Describe the coding challenge..."
          className="w-full bg-[#FAFCFA] dark:bg-[#232B23] rounded-xl px-4 py-3 text-[15px] text-gray-800 dark:text-gray-200 outline-none border border-gray-200 dark:border-white/10 focus:border-[#5D7C59] transition-colors min-h-[120px] resize-y"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Starter Code (Optional)</label>
          <select 
            value={problem.config?.language || 'javascript'}
            onChange={e => updateProblem({ config: { language: e.target.value } })}
            className="bg-gray-100 dark:bg-white/5 border-none text-sm text-gray-800 dark:text-gray-200 py-1.5 px-3 rounded-lg outline-none focus:ring-2 focus:ring-[#5D7C59]/30 transition-shadow cursor-pointer"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.id} value={lang.id} className="bg-white dark:bg-[#1A211A] text-gray-900 dark:text-gray-100">{lang.name}</option>
            ))}
          </select>
        </div>
        <div className="h-[250px] w-full rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-[#1e1e1e]">
          <Editor
            height="100%"
            language={LANGUAGES.find(l => l.id === (problem.config?.language || 'javascript'))?.monaco || 'javascript'}
            theme="vs-dark"
            value={problem.config?.starterCode || ''}
            onChange={(value) => updateProblem({ config: { starterCode: value } })}
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

export default CodingBuilder;
