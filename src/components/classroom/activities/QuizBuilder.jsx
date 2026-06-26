import React from 'react';
import { Plus, Circle, CheckSquare, X, Trash2 } from 'lucide-react';

const QuizBuilder = ({ questions, setQuestions }) => {
  const updateQuestion = (qIndex, updates) => {
    const newQs = [...questions];
    Object.assign(newQs[qIndex], updates);
    setQuestions(newQs);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQs = [...questions];
    newQs[qIndex].options[oIndex].text = value;
    setQuestions(newQs);
  };

  const addOption = (qIndex) => {
    const newQs = [...questions];
    newQs[qIndex].options.push({ text: `Option ${newQs[qIndex].options.length + 1}` });
    setQuestions(newQs);
  };

  const removeOption = (qIndex, oIndex) => {
    const newQs = [...questions];
    newQs[qIndex].options.splice(oIndex, 1);
    setQuestions(newQs);
  };

  const removeQuestion = (qIndex) => {
    const newQs = questions.filter((_, i) => i !== qIndex);
    setQuestions(newQs.length ? newQs : [{ id: Date.now().toString(), questionType: 'multiple_choice', content: '', options: [{ text: 'Option 1' }], points: 10 }]);
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now().toString(), questionType: 'multiple_choice', content: '', options: [{ text: 'Option 1' }], points: 10 }]);
  };

  const setCorrectAnswer = (qIndex, optionId) => {
    const newQs = [...questions];
    const q = newQs[qIndex];
    if (q.questionType === 'multiple_choice') {
      q.correctAnswer = optionId;
    } else if (q.questionType === 'checkbox') {
      const current = Array.isArray(q.correctAnswer) ? q.correctAnswer : [];
      if (current.includes(optionId)) {
        q.correctAnswer = current.filter(id => id !== optionId);
      } else {
        q.correctAnswer = [...current, optionId];
      }
    }
    setQuestions(newQs);
  };

  return (
    <div className="flex flex-col gap-4">
      {questions.map((q, qIndex) => (
        <div key={q.id || qIndex} className="bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden relative transition-colors duration-200">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#5D7C59] rounded-r" />
          <div className="px-4 md:px-6 py-4 md:py-5">
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-start sm:items-center mb-4 md:mb-5">
              <input
                type="text"
                placeholder="Question text"
                value={q.content}
                onChange={e => updateQuestion(qIndex, { content: e.target.value })}
                className="flex-1 bg-[#FAFCFA] dark:bg-[#232B23] rounded-t-xl px-4 py-4 text-[15px] font-medium text-gray-800 dark:text-gray-200 outline-none border-b-2 border-gray-200 dark:border-white/10 focus:border-[#5D7C59] dark:focus:border-[#7A9A7B] transition-colors"
              />
              <div className="flex flex-col gap-2">
                  <select
                    value={q.questionType}
                    onChange={e => updateQuestion(qIndex, { questionType: e.target.value, correctAnswer: null })}
                    className="w-48 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm outline-none bg-white dark:bg-[#232B23] cursor-pointer focus:border-[#5D7C59] dark:focus:border-[#7A9A7B] transition-colors"
                  >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="checkbox">Checkboxes</option>
                    <option value="short_answer">Short Answer</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Pts"
                    value={q.points}
                    onChange={e => updateQuestion(qIndex, { points: parseInt(e.target.value) || 0 })}
                    className="w-48 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm outline-none bg-white dark:bg-[#232B23]"
                    min="0"
                  />
              </div>
            </div>

            {q.questionType !== 'short_answer' ? (
              <div className="flex flex-col gap-3 pl-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Select the circle/checkbox to mark the correct answer.</p>
                {q.options?.map((opt, oIndex) => {
                  const optId = opt.id || `opt-${qIndex}-${oIndex}`;
                  // Ensure option has an ID for correctness tracking
                  if (!opt.id) opt.id = optId;
                  
                  const isCorrect = q.questionType === 'multiple_choice' 
                    ? q.correctAnswer === optId 
                    : (Array.isArray(q.correctAnswer) && q.correctAnswer.includes(optId));

                  return (
                    <div key={optId} className="flex items-center gap-3">
                      <button 
                        onClick={() => setCorrectAnswer(qIndex, optId)}
                        className={`shrink-0 cursor-pointer p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${isCorrect ? 'text-[#5D7C59] dark:text-[#7A9A7B]' : 'text-gray-300 dark:text-gray-600'}`}
                      >
                        {q.questionType === 'multiple_choice'
                          ? <Circle size={18} fill={isCorrect ? 'currentColor' : 'none'} />
                          : <CheckSquare size={18} fill={isCorrect ? 'currentColor' : 'none'} />}
                      </button>
                      
                      <input
                        type="text"
                        value={opt.text}
                        onChange={e => updateOption(qIndex, oIndex, e.target.value)}
                        className="flex-1 border-none text-sm text-gray-700 dark:text-gray-300 py-1 outline-none bg-transparent"
                        style={{ borderBottom: '1px solid transparent' }}
                        onFocus={e => { e.currentTarget.style.borderBottomColor = '#5D7C59'; }}
                        onBlur={e => { e.currentTarget.style.borderBottomColor = 'transparent'; }}
                      />
                      {q.options.length > 1 && (
                        <button onClick={() => removeOption(qIndex, oIndex)} className="text-gray-300 dark:text-gray-500 hover:text-red-400 dark:hover:text-red-450 transition-colors border-none bg-transparent cursor-pointer p-1">
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  );
                })}
                <div className="flex items-center gap-3 mt-1 pl-1">
                  {q.questionType === 'multiple_choice'
                    ? <Circle size={18} className="text-gray-200 dark:text-white/10 shrink-0" />
                    : <CheckSquare size={18} className="text-gray-200 dark:text-white/10 shrink-0" />}
                  <button onClick={() => addOption(qIndex)} className="text-sm text-gray-400 dark:text-gray-500 hover:text-[#5D7C59] dark:hover:text-[#7A9A7B] font-medium transition-colors border-none bg-transparent cursor-pointer py-1">
                    Add option
                  </button>
                </div>
              </div>
            ) : (
              <div className="pl-2 mt-2">
                <input
                    type="text"
                    placeholder="Enter the correct short answer (students must match this text)"
                    value={q.correctAnswer || ''}
                    onChange={e => updateQuestion(qIndex, { correctAnswer: e.target.value })}
                    className="w-2/3 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent py-2 text-sm text-gray-800 dark:text-gray-200 outline-none focus:border-[#5D7C59] dark:focus:border-[#7A9A7B] transition-colors"
                />
              </div>
            )}
            
            <div className="flex justify-end mt-5 pt-4 border-t border-gray-100 dark:border-white/10">
              <button onClick={() => removeQuestion(qIndex)} className="p-2 rounded-full text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all border-none bg-transparent cursor-pointer">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addQuestion}
        className="bg-white dark:bg-[#1A211A] border border-gray-200 dark:border-white/10 rounded-2xl py-4 flex items-center justify-center gap-2 text-[#5D7C59] dark:text-[#7A9A7B] text-sm font-bold hover:bg-[#FAFCFA] dark:hover:bg-[#232B23] hover:border-[#5D7C59]/40 transition-all shadow-sm cursor-pointer"
      >
        <Plus size={17} strokeWidth={2.5} /> Add Question
      </button>
    </div>
  );
};

export default QuizBuilder;
