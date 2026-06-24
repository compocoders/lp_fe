import React, { useEffect } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { Plus, Minus } from 'lucide-react';

const DEFAULT_DATA = [
  [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
  [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
  [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
  [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
  [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
];

const SpreadsheetBuilder = ({ questions, setQuestions }) => {
  useEffect(() => {
    if (questions.length === 0 || questions[0]?.questionType !== 'spreadsheet_problem') {
      setQuestions([{ id: Date.now().toString(), questionType: 'spreadsheet_problem', content: '', points: 100, config: { starterData: DEFAULT_DATA } }]);
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

  const handleSpreadsheetChange = (newData) => {
    updateProblem({ config: { starterData: newData } });
  };

  const currentData = problem.config?.starterData || DEFAULT_DATA;

  const addRow = () => {
    const colCount = currentData[0]?.length || 4;
    const newRow = Array(colCount).fill({ value: '' });
    updateProblem({ config: { starterData: [...currentData, newRow] } });
  };

  const removeRow = () => {
    if (currentData.length <= 1) return;
    updateProblem({ config: { starterData: currentData.slice(0, -1) } });
  };

  const addColumn = () => {
    const newData = currentData.map(row => [...row, { value: '' }]);
    updateProblem({ config: { starterData: newData } });
  };

  const removeColumn = () => {
    if (currentData[0]?.length <= 1) return;
    const newData = currentData.map(row => row.slice(0, -1));
    updateProblem({ config: { starterData: newData } });
  };

  if (!problem.id) return null;

  return (
    <div className="bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6 flex flex-col gap-4 transition-colors duration-200">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Spreadsheet Task Details</h3>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Prompt / Guidelines</label>
        <textarea
          value={problem.content || ''}
          onChange={e => updateProblem({ content: e.target.value })}
          placeholder="Describe what the student needs to do..."
          className="w-full bg-[#FAFCFA] dark:bg-[#232B23] rounded-xl px-4 py-3 text-[15px] text-gray-800 dark:text-gray-200 outline-none border border-gray-200 dark:border-white/10 focus:border-[#5D7C59] transition-colors min-h-[120px] resize-y"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Starter Data / Template (Optional)</label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fill out the cells below. Students will receive this exact layout.</p>
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#2A342A] p-1 rounded-lg">
            <span className="text-xs font-semibold text-gray-500 px-2">Rows:</span>
            <button onClick={removeRow} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors text-gray-600 dark:text-gray-300"><Minus size={14} /></button>
            <button onClick={addRow} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors text-gray-600 dark:text-gray-300"><Plus size={14} /></button>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#2A342A] p-1 rounded-lg">
            <span className="text-xs font-semibold text-gray-500 px-2">Columns:</span>
            <button onClick={removeColumn} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors text-gray-600 dark:text-gray-300"><Minus size={14} /></button>
            <button onClick={addColumn} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors text-gray-600 dark:text-gray-300"><Plus size={14} /></button>
          </div>
        </div>
        <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-x-auto bg-white p-2 min-w-max">
          <Spreadsheet 
            data={currentData} 
            onChange={handleSpreadsheetChange} 
          />
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetBuilder;
