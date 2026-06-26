import React, { useEffect } from 'react';

const GenericBuilder = ({ typeLabel, defaultQuestionType, questions, setQuestions }) => {
  useEffect(() => {
    if (questions.length === 0 || questions[0]?.questionType !== defaultQuestionType) {
      setQuestions([{ id: Date.now().toString(), questionType: defaultQuestionType, content: '', points: 100 }]);
    }
  }, []);

  const problem = questions[0] || {};

  const updateProblem = (content) => {
    setQuestions([{ ...problem, content }]);
  };

  if (!problem.id) return null;

  return (
    <div className="bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-4 md:p-6 flex flex-col gap-3 md:gap-4 transition-colors duration-200">
      <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1 md:mb-2">{typeLabel} Instructions</h3>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Prompt / Guidelines</label>
        <textarea
          value={problem.content || ''}
          onChange={e => updateProblem(e.target.value)}
          placeholder="Provide clear instructions for the students..."
          className="w-full bg-[#FAFCFA] dark:bg-[#232B23] rounded-xl px-4 py-3 text-[15px] text-gray-800 dark:text-gray-200 outline-none border border-gray-200 dark:border-white/10 focus:border-[#5D7C59] transition-colors min-h-[160px] resize-y"
        />
      </div>
    </div>
  );
};

export default GenericBuilder;
