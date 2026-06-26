import React, { useState, useMemo } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { Grid, Plus, Minus } from 'lucide-react';
import { Parser } from 'hot-formula-parser';

const DEFAULT_DATA = [
  [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
  [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
  [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
  [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
  [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
];

const SpreadsheetRenderer = ({ question, value, onChange, disabled }) => {
  const [data, setData] = useState(value?.data || question?.config?.starterData || DEFAULT_DATA);

  // Initialize parser and bind to data
  const parser = useMemo(() => {
    const p = new Parser();
    p.on('callCellValue', (cellCoord, done) => {
      const row = cellCoord.row.index;
      const col = cellCoord.column.index;
      const cell = data[row]?.[col];
      let val = cell?.value;
      if (typeof val === 'string' && val.startsWith('=')) {
        val = p.parse(val.substring(1)).result;
      } else if (!isNaN(Number(val)) && val !== '') {
        val = Number(val);
      }
      done(val);
    });
    return p;
  }, [data]);

  const CustomDataViewer = ({ cell }) => {
    let displayValue = cell?.value;
    if (typeof displayValue === 'string' && displayValue.startsWith('=')) {
      const parsed = parser.parse(displayValue.substring(1));
      displayValue = parsed.error ? `#${parsed.error}` : parsed.result;
    }
    return <span className="text-sm px-1 truncate">{displayValue}</span>;
  };

  const handleSpreadsheetChange = (newData) => {
    if (disabled) return;
    setData(newData);
    onChange(question.id, { data: newData });
  };

  const addRow = () => {
    if (disabled) return;
    const colCount = data[0]?.length || 4;
    const newRow = Array(colCount).fill({ value: '' });
    handleSpreadsheetChange([...data, newRow]);
  };

  const removeRow = () => {
    if (disabled || data.length <= 1) return;
    handleSpreadsheetChange(data.slice(0, -1));
  };

  const addColumn = () => {
    if (disabled) return;
    const newData = data.map(row => [...row, { value: '' }]);
    handleSpreadsheetChange(newData);
  };

  const removeColumn = () => {
    if (disabled || data[0]?.length <= 1) return;
    const newData = data.map(row => row.slice(0, -1));
    handleSpreadsheetChange(newData);
  };

  return (
    <div className="bg-white dark:bg-[#1A211A] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Grid size={20} className="text-emerald-600 dark:text-emerald-500" />
          </div>
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap">
            {question.content}
          </h3>
        </div>
        <span className="text-[11px] font-bold text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md shrink-0">
          {question.points} Pts
        </span>
      </div>

      <div className={`mt-2 border border-gray-200 dark:border-white/10 rounded-xl overflow-x-auto bg-white ${disabled ? 'opacity-75 pointer-events-none' : ''}`}>
        {!disabled && (
          <div className="flex items-center gap-4 p-2 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1A211A]">
            <div className="flex items-center gap-2 bg-white dark:bg-[#2A342A] p-1 rounded-lg border border-gray-200 dark:border-white/5">
              <span className="text-xs font-semibold text-gray-500 px-2">Rows:</span>
              <button onClick={removeRow} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors text-gray-600 dark:text-gray-300 border-none bg-transparent cursor-pointer"><Minus size={14} /></button>
              <button onClick={addRow} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors text-gray-600 dark:text-gray-300 border-none bg-transparent cursor-pointer"><Plus size={14} /></button>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-[#2A342A] p-1 rounded-lg border border-gray-200 dark:border-white/5">
              <span className="text-xs font-semibold text-gray-500 px-2">Columns:</span>
              <button onClick={removeColumn} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors text-gray-600 dark:text-gray-300 border-none bg-transparent cursor-pointer"><Minus size={14} /></button>
              <button onClick={addColumn} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors text-gray-600 dark:text-gray-300 border-none bg-transparent cursor-pointer"><Plus size={14} /></button>
            </div>
          </div>
        )}
        <div className="p-2 min-w-max">
          <Spreadsheet 
            data={data} 
            onChange={handleSpreadsheetChange}
            CustomComponents={{
              DataViewer: CustomDataViewer
            }}
          />
        </div>
      </div>
      {disabled && <p className="text-xs text-gray-400 italic">Spreadsheet is read-only.</p>}
    </div>
  );
};

export default SpreadsheetRenderer;
