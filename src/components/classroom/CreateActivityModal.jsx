import React, { useEffect, useState } from 'react';
import {
  ClipboardList, Plus, Circle, CheckSquare, X, Trash2,
} from 'lucide-react';

const DEFAULT_QUESTION = { id: 1, type: 'multiple_choice', question: '', options: ['Option 1'] };

const CreateActivityModal = ({ isOpen, onClose, onSave }) => {
  const [questions, setQuestions] = useState([DEFAULT_QUESTION]);

  useEffect(() => {
    if (!isOpen) setQuestions([{ ...DEFAULT_QUESTION, id: Date.now() }]);
  }, [isOpen]);

  if (!isOpen) return null;

  const updateQuestion = (qIndex, updates) => {
    const newQs = [...questions];
    Object.assign(newQs[qIndex], updates);
    setQuestions(newQs);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQs = [...questions];
    newQs[qIndex].options[oIndex] = value;
    setQuestions(newQs);
  };

  const addOption = (qIndex) => {
    const newQs = [...questions];
    newQs[qIndex].options.push(`Option ${newQs[qIndex].options.length + 1}`);
    setQuestions(newQs);
  };

  const removeOption = (qIndex, oIndex) => {
    const newQs = [...questions];
    newQs[qIndex].options.splice(oIndex, 1);
    setQuestions(newQs);
  };

  const removeQuestion = (qIndex) => {
    const newQs = questions.filter((_, i) => i !== qIndex);
    setQuestions(newQs.length ? newQs : [{ id: Date.now(), type: 'multiple_choice', question: '', options: ['Option 1'] }]);
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), type: 'multiple_choice', question: '', options: ['Option 1'] }]);
  };

  return (
    <div className="absolute inset-0 bg-[#f0f4f8] dark:bg-[#121612] flex flex-col z-[1000] overflow-y-auto transition-colors duration-200" style={{ animation: 'fadeSlideIn 0.2s ease-out' }}>
      <div className="bg-white dark:bg-[#1A211A] px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between sticky top-0 z-10 shadow-sm shrink-0 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5D7C59] to-[#4A6447] flex items-center justify-center">
            <ClipboardList size={18} className="text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-gray-900 dark:text-white">Activity Builder</span>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">Build your quiz or assignment</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors border-none bg-transparent cursor-pointer">Cancel</button>
          <button onClick={() => onSave?.(questions)} className="px-5 py-2.5 bg-gradient-to-r from-[#5D7C59] to-[#4A6447] text-white rounded-xl text-sm font-bold shadow-md hover:-translate-y-0.5 transition-all border-none cursor-pointer">Save Activity</button>
        </div>
      </div>
      <div className="max-w-2xl w-full mx-auto px-5 py-8 flex flex-col gap-4">
        <div className="bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-colors duration-200" style={{ borderTop: '6px solid #5D7C59' }}>
          <div className="px-6 py-6 flex flex-col gap-4">
            <input
              type="text"
              placeholder="Activity Title"
              className="w-full border-none text-2xl font-bold text-gray-900 dark:text-white py-2 outline-none bg-transparent"
              style={{ borderBottom: '2px solid #e5e7eb' }}
              onFocus={e => { e.currentTarget.style.borderBottomColor = '#5D7C59'; }}
              onBlur={e => { e.currentTarget.style.borderBottomColor = '#e5e7eb'; }}
            />
            <input
              type="text"
              placeholder="Activity description (optional)"
              className="w-full border-none text-sm text-gray-500 dark:text-gray-400 py-1 outline-none bg-transparent"
              style={{ borderBottom: '1px solid #e5e7eb' }}
              onFocus={e => { e.currentTarget.style.borderBottomColor = '#5D7C59'; }}
              onBlur={e => { e.currentTarget.style.borderBottomColor = '#e5e7eb'; }}
            />
          </div>
        </div>
        {questions.map((q, qIndex) => (
          <div key={q.id} className="bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden relative transition-colors duration-200">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#5D7C59] rounded-r" />
            <div className="px-6 py-5">
              <div className="flex gap-4 items-start mb-5">
                <input
                  type="text"
                  placeholder="Question text"
                  value={q.question}
                  onChange={e => updateQuestion(qIndex, { question: e.target.value })}
                  className="flex-1 bg-[#FAFCFA] dark:bg-[#232B23] rounded-t-xl px-4 py-4 text-[15px] font-medium text-gray-800 dark:text-gray-200 outline-none border-b-2 border-gray-200 dark:border-white/10 focus:border-[#5D7C59] dark:focus:border-[#7A9A7B] transition-colors"
                />
                <select
                  value={q.type}
                  onChange={e => updateQuestion(qIndex, { type: e.target.value })}
                  className="w-52 px-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm outline-none bg-white dark:bg-[#232B23] cursor-pointer focus:border-[#5D7C59] dark:focus:border-[#7A9A7B] transition-colors"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="checkboxes">Checkboxes</option>
                  <option value="short_answer">Short Answer</option>
                </select>
              </div>
              {q.type !== 'short_answer' ? (
                <div className="flex flex-col gap-3 pl-2">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      {q.type === 'multiple_choice'
                        ? <Circle size={18} className="text-[#5D7C59]/40 dark:text-[#7A9A7B]/40 shrink-0" />
                        : <CheckSquare size={18} className="text-[#5D7C59]/40 dark:text-[#7A9A7B]/40 shrink-0" />}
                      <input
                        type="text"
                        value={opt}
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
                  ))}
                  <div className="flex items-center gap-3 mt-1">
                    {q.type === 'multiple_choice'
                      ? <Circle size={18} className="text-gray-200 dark:text-white/10 shrink-0" />
                      : <CheckSquare size={18} className="text-gray-200 dark:text-white/10 shrink-0" />}
                    <button onClick={() => addOption(qIndex)} className="text-sm text-gray-400 dark:text-gray-500 hover:text-[#5D7C59] dark:hover:text-[#7A9A7B] font-medium transition-colors border-none bg-transparent cursor-pointer py-1">
                      Add option
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pl-2 mt-2">
                  <div className="text-sm text-gray-400 dark:text-gray-500 pb-2 w-2/3" style={{ borderBottom: '1px dashed #d1d5db' }}>Short answer text</div>
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
    </div>
  );
};

export default CreateActivityModal;
