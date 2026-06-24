import React from 'react';
import { Circle, CheckSquare } from 'lucide-react';

const MultipleChoiceRenderer = ({ question, value, onChange, disabled }) => {
  const isMultiple = question.questionType === 'checkbox';
  const options = question.options || [];

  const handleSelect = (optId) => {
    if (disabled) return;

    if (isMultiple) {
      const currentSelection = value?.selectedIds || [];
      if (currentSelection.includes(optId)) {
        onChange(question.id, { selectedIds: currentSelection.filter(id => id !== optId) });
      } else {
        onChange(question.id, { selectedIds: [...currentSelection, optId] });
      }
    } else {
      onChange(question.id, { selectedId: optId });
    }
  };

  const isSelected = (optId) => {
    if (isMultiple) {
      return (value?.selectedIds || []).includes(optId);
    }
    return value?.selectedId === optId;
  };

  return (
    <div className="bg-white dark:bg-[#1A211A] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap">
          {question.content}
        </h3>
        <span className="text-[11px] font-bold text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md shrink-0">
          {question.points} Pts
        </span>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        {options.map((opt) => (
          <div 
            key={opt.id} 
            onClick={() => handleSelect(opt.id)}
            className={`flex items-center gap-3 p-3 rounded-xl border ${isSelected(opt.id) ? 'border-[#5D7C59] bg-[#5D7C59]/5' : 'border-gray-200 dark:border-white/10 hover:border-[#5D7C59]/30'} ${disabled ? 'cursor-default opacity-75' : 'cursor-pointer'} transition-all`}
          >
            <div className={`shrink-0 ${isSelected(opt.id) ? 'text-[#5D7C59]' : 'text-gray-300 dark:text-gray-600'}`}>
              {isMultiple ? (
                <CheckSquare size={20} fill={isSelected(opt.id) ? 'currentColor' : 'none'} className={isSelected(opt.id) ? 'text-white' : ''} />
              ) : (
                <Circle size={20} fill={isSelected(opt.id) ? 'currentColor' : 'none'} />
              )}
            </div>
            <span className="text-[14px] text-gray-800 dark:text-gray-200">{opt.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceRenderer;
