import React, { useEffect, useMemo, useState } from 'react';
import Spreadsheet from 'react-spreadsheet';
import { Plus, Minus, LayoutTemplate, ChevronDown } from 'lucide-react';
import { Parser } from 'hot-formula-parser';

// ─── Business & Academic Templates ──────────────────────────────────────────
const TEMPLATES = [
  { id: 'blank', label: 'Blank', category: 'General', data: [
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
  ]},

  { id: 'balance_sheet', label: 'Balance Sheet', category: 'Accounting', data: [
    [{ value: 'BALANCE SHEET' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: 'Company Name:' }, { value: '' }, { value: 'Date:' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: 'ASSETS' }, { value: 'Amount (₱)' }, { value: 'LIABILITIES & EQUITY' }, { value: 'Amount (₱)' }],
    [{ value: 'Current Assets' }, { value: '' }, { value: 'Current Liabilities' }, { value: '' }],
    [{ value: '  Cash' }, { value: '' }, { value: '  Accounts Payable' }, { value: '' }],
    [{ value: '  Accounts Receivable' }, { value: '' }, { value: '  Notes Payable (short-term)' }, { value: '' }],
    [{ value: '  Inventory' }, { value: '' }, { value: '  Accrued Liabilities' }, { value: '' }],
    [{ value: '  Prepaid Expenses' }, { value: '' }, { value: 'Total Current Liabilities' }, { value: '' }],
    [{ value: 'Total Current Assets' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: 'Long-term Liabilities' }, { value: '' }],
    [{ value: 'Non-Current Assets' }, { value: '' }, { value: '  Bank Loan' }, { value: '' }],
    [{ value: '  Property & Equipment' }, { value: '' }, { value: '  Bonds Payable' }, { value: '' }],
    [{ value: '  Less: Depreciation' }, { value: '' }, { value: 'Total Long-term Liabilities' }, { value: '' }],
    [{ value: '  Investments' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: 'Total Non-Current Assets' }, { value: '' }, { value: "Owner's Equity" }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '  Capital' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '  Retained Earnings' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: "Total Owner's Equity" }, { value: '' }],
    [{ value: 'TOTAL ASSETS' }, { value: '' }, { value: 'TOTAL LIAB. & EQUITY' }, { value: '' }],
  ]},

  { id: 'income_statement', label: 'Income Statement', category: 'Accounting', data: [
    [{ value: 'INCOME STATEMENT' }, { value: '' }],
    [{ value: 'Company:' }, { value: '' }],
    [{ value: 'Period:' }, { value: '' }],
    [{ value: '' }, { value: '' }],
    [{ value: 'REVENUES' }, { value: 'Amount (₱)' }],
    [{ value: '  Sales Revenue' }, { value: '' }],
    [{ value: '  Service Revenue' }, { value: '' }],
    [{ value: '  Other Income' }, { value: '' }],
    [{ value: 'Total Revenue' }, { value: '' }],
    [{ value: '' }, { value: '' }],
    [{ value: 'COST OF GOODS SOLD (COGS)' }, { value: '' }],
    [{ value: '  Beginning Inventory' }, { value: '' }],
    [{ value: '  Add: Purchases' }, { value: '' }],
    [{ value: '  Less: Ending Inventory' }, { value: '' }],
    [{ value: 'Total COGS' }, { value: '' }],
    [{ value: 'GROSS PROFIT' }, { value: '' }],
    [{ value: '' }, { value: '' }],
    [{ value: 'OPERATING EXPENSES' }, { value: '' }],
    [{ value: '  Salaries Expense' }, { value: '' }],
    [{ value: '  Rent Expense' }, { value: '' }],
    [{ value: '  Utilities Expense' }, { value: '' }],
    [{ value: '  Depreciation Expense' }, { value: '' }],
    [{ value: '  Other Expenses' }, { value: '' }],
    [{ value: 'Total Operating Expenses' }, { value: '' }],
    [{ value: 'OPERATING INCOME' }, { value: '' }],
    [{ value: '' }, { value: '' }],
    [{ value: '  Income Tax Expense' }, { value: '' }],
    [{ value: 'NET INCOME / (LOSS)' }, { value: '' }],
  ]},

  { id: 'cash_flow', label: 'Cash Flow Statement', category: 'Accounting', data: [
    [{ value: 'STATEMENT OF CASH FLOWS' }, { value: '' }],
    [{ value: 'Company:' }, { value: '' }],
    [{ value: 'Period:' }, { value: '' }],
    [{ value: '' }, { value: '' }],
    [{ value: 'OPERATING ACTIVITIES' }, { value: 'Amount (₱)' }],
    [{ value: '  Net Income' }, { value: '' }],
    [{ value: '  Add: Depreciation' }, { value: '' }],
    [{ value: '  Decrease/(Increase) in Accounts Receivable' }, { value: '' }],
    [{ value: '  Decrease/(Increase) in Inventory' }, { value: '' }],
    [{ value: '  Increase/(Decrease) in Accounts Payable' }, { value: '' }],
    [{ value: 'Net Cash from Operating Activities' }, { value: '' }],
    [{ value: '' }, { value: '' }],
    [{ value: 'INVESTING ACTIVITIES' }, { value: '' }],
    [{ value: '  Purchase of Equipment' }, { value: '' }],
    [{ value: '  Sale of Investments' }, { value: '' }],
    [{ value: 'Net Cash from Investing Activities' }, { value: '' }],
    [{ value: '' }, { value: '' }],
    [{ value: 'FINANCING ACTIVITIES' }, { value: '' }],
    [{ value: '  Proceeds from Loans' }, { value: '' }],
    [{ value: '  Repayment of Loans' }, { value: '' }],
    [{ value: "  Owner's Withdrawals" }, { value: '' }],
    [{ value: 'Net Cash from Financing Activities' }, { value: '' }],
    [{ value: '' }, { value: '' }],
    [{ value: 'Net Increase/(Decrease) in Cash' }, { value: '' }],
    [{ value: 'Beginning Cash Balance' }, { value: '' }],
    [{ value: 'ENDING CASH BALANCE' }, { value: '' }],
  ]},

  { id: 't_account', label: 'T-Account Ledger', category: 'Accounting', data: [
    [{ value: 'ACCOUNT NAME:' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '── DEBIT ──' }, { value: 'Amount' }, { value: '' }, { value: '── CREDIT ──' }, { value: 'Amount' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: 'Total Debits' }, { value: '' }, { value: '' }, { value: 'Total Credits' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: 'Balance (DR - CR)' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
  ]},

  { id: 'trial_balance', label: 'Trial Balance', category: 'Accounting', data: [
    [{ value: 'TRIAL BALANCE' }, { value: '' }, { value: '' }],
    [{ value: 'Company:' }, { value: '' }, { value: '' }],
    [{ value: 'Date:' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }],
    [{ value: 'Account Title' }, { value: 'Debit (₱)' }, { value: 'Credit (₱)' }],
    [{ value: 'Cash' }, { value: '' }, { value: '' }],
    [{ value: 'Accounts Receivable' }, { value: '' }, { value: '' }],
    [{ value: 'Inventory' }, { value: '' }, { value: '' }],
    [{ value: 'Equipment' }, { value: '' }, { value: '' }],
    [{ value: 'Accounts Payable' }, { value: '' }, { value: '' }],
    [{ value: 'Capital' }, { value: '' }, { value: '' }],
    [{ value: 'Sales Revenue' }, { value: '' }, { value: '' }],
    [{ value: 'Salaries Expense' }, { value: '' }, { value: '' }],
    [{ value: 'Rent Expense' }, { value: '' }, { value: '' }],
    [{ value: 'Utilities Expense' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }],
    [{ value: 'TOTALS' }, { value: '' }, { value: '' }],
  ]},

  { id: 'journal_entries', label: 'General Journal', category: 'Accounting', data: [
    [{ value: 'GENERAL JOURNAL' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: 'Company:' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: 'Date' }, { value: 'Account Title & Explanation' }, { value: 'Ref.' }, { value: 'Debit (₱)' }, { value: 'Credit (₱)' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: 'TOTALS' }, { value: '' }, { value: '' }],
  ]},

  { id: 'budget', label: 'Budget Plan', category: 'Finance', data: [
    [{ value: 'BUDGET PLAN' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: 'Period:' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: 'Category' }, { value: 'Budgeted (₱)' }, { value: 'Actual (₱)' }, { value: 'Variance (₱)' }],
    [{ value: 'INCOME' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '  Salary / Revenue' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '  Other Income' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: 'Total Income' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: 'EXPENSES' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '  Rent / Mortgage' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '  Food & Groceries' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '  Transportation' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '  Utilities' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '  Savings' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '  Other Expenses' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: 'Total Expenses' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: 'NET SURPLUS / (DEFICIT)' }, { value: '' }, { value: '' }, { value: '' }],
  ]},

  { id: 'inventory', label: 'Inventory Ledger', category: 'Finance', data: [
    [{ value: 'INVENTORY LEDGER' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: 'Product:' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: 'Date' }, { value: 'Description' }, { value: 'Unit Cost' }, { value: 'Units In' }, { value: 'Units Out' }, { value: 'Units Balance' }, { value: 'Total Value' }],
    [{ value: '' }, { value: 'Beginning Balance' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
  ]},

  { id: 'data_table', label: 'Data Table', category: 'General', data: [
    [{ value: 'Category' }, { value: 'Q1' }, { value: 'Q2' }, { value: 'Q3' }, { value: 'Q4' }, { value: 'Total' }],
    [{ value: 'Item A' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: 'Item B' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: 'Item C' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: 'Item D' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
    [{ value: 'Total' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }, { value: '' }],
  ]},
];

const CATEGORIES = ['All', ...Array.from(new Set(TEMPLATES.map(t => t.category)))];

const DEFAULT_DATA = TEMPLATES[0].data;

const SpreadsheetBuilder = ({ questions, setQuestions }) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    if (questions.length === 0 || questions[0]?.questionType !== 'spreadsheet_problem') {
      setQuestions([{
        id: Date.now().toString(),
        questionType: 'spreadsheet_problem',
        content: '',
        points: 100,
        config: { starterData: DEFAULT_DATA },
      }]);
    }
  }, []);

  const problem = questions[0] || { config: {} };
  const currentData = problem.config?.starterData || DEFAULT_DATA;

  const parser = useMemo(() => {
    const p = new Parser();
    p.on('callCellValue', (cellCoord, done) => {
      const row = cellCoord.row.index;
      const col = cellCoord.column.index;
      const cell = currentData[row]?.[col];
      let val = cell?.value;
      if (typeof val === 'string' && val.startsWith('=')) {
        val = p.parse(val.substring(1)).result;
      } else if (!isNaN(Number(val)) && val !== '') {
        val = Number(val);
      }
      done(val);
    });
    return p;
  }, [currentData]);

  const CustomDataViewer = ({ cell }) => {
    let displayValue = cell?.value;
    if (typeof displayValue === 'string' && displayValue.startsWith('=')) {
      const parsed = parser.parse(displayValue.substring(1));
      displayValue = parsed.error ? `#${parsed.error}` : parsed.result;
      if (typeof displayValue === 'number') {
        displayValue = displayValue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    }
    return <span className="text-sm px-1 truncate">{displayValue}</span>;
  };

  const updateProblem = (updates) => {
    const updatedProblem = { ...problem, ...updates };
    if (updates.config) updatedProblem.config = { ...problem.config, ...updates.config };
    setQuestions([updatedProblem]);
  };

  const applyTemplate = (template) => {
    // Deep clone so mutations don't affect the template
    const cloned = template.data.map(row => row.map(cell => ({ ...cell })));
    updateProblem({ config: { starterData: cloned } });
    setShowTemplates(false);
  };

  const handleSpreadsheetChange = (newData) => updateProblem({ config: { starterData: newData } });

  const addRow = () => {
    const colCount = currentData[0]?.length || 4;
    updateProblem({ config: { starterData: [...currentData, Array(colCount).fill({ value: '' })] } });
  };
  const removeRow = () => {
    if (currentData.length <= 1) return;
    updateProblem({ config: { starterData: currentData.slice(0, -1) } });
  };
  const addColumn = () => {
    updateProblem({ config: { starterData: currentData.map(row => [...row, { value: '' }]) } });
  };
  const removeColumn = () => {
    if (currentData[0]?.length <= 1) return;
    updateProblem({ config: { starterData: currentData.map(row => row.slice(0, -1)) } });
  };

  if (!problem.id) return null;

  const filteredTemplates = activeCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <div className="bg-white dark:bg-[#1A211A] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-4 md:p-6 flex flex-col gap-4 transition-colors duration-200">
      <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">Spreadsheet Task Details</h3>

      {/* Prompt */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Prompt / Guidelines</label>
        <textarea
          value={problem.content || ''}
          onChange={e => updateProblem({ content: e.target.value })}
          placeholder="Describe what the student needs to do in this spreadsheet..."
          className="w-full bg-[#FAFCFA] dark:bg-[#232B23] rounded-xl px-4 py-3 text-[15px] text-gray-800 dark:text-gray-200 outline-none border border-gray-200 dark:border-white/10 focus:border-[#5D7C59] transition-colors min-h-[100px] resize-y"
        />
      </div>

      {/* Template picker toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowTemplates(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#5D7C59]/10 hover:bg-[#5D7C59]/20 border border-[#5D7C59]/30 text-[#5D7C59] font-semibold text-sm rounded-xl transition-all cursor-pointer"
        >
          <LayoutTemplate size={15} />
          Use a Template
          <ChevronDown size={14} className={`transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
        </button>

        {showTemplates && (
          <div className="mt-3 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden bg-gray-50 dark:bg-[#161E16]">
            {/* Category tabs */}
            <div className="flex gap-1 p-3 border-b border-gray-200 dark:border-white/10 overflow-x-auto">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer border-none ${
                    activeCategory === cat
                      ? 'bg-[#5D7C59] text-white'
                      : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Template grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3">
              {filteredTemplates.map(tpl => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className="flex flex-col gap-1 p-3 bg-white dark:bg-white/5 hover:bg-[#5D7C59]/5 dark:hover:bg-[#5D7C59]/10 border border-gray-200 dark:border-white/10 hover:border-[#5D7C59]/50 rounded-xl text-left transition-all cursor-pointer group"
                >
                  {/* Mini grid preview */}
                  <div className="grid gap-0.5 mb-1.5" style={{ gridTemplateColumns: `repeat(${Math.min(tpl.data[0]?.length || 4, 4)}, 1fr)` }}>
                    {tpl.data.slice(0, 3).map((row, ri) =>
                      row.slice(0, 4).map((cell, ci) => (
                        <div
                          key={`${ri}-${ci}`}
                          className={`h-2 rounded-sm ${cell.value ? 'bg-[#5D7C59]/40' : 'bg-gray-200 dark:bg-white/10'}`}
                        />
                      ))
                    )}
                  </div>
                  <span className="text-[12px] font-bold text-gray-800 dark:text-gray-200 group-hover:text-[#5D7C59] transition-colors leading-tight">
                    {tpl.label}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">{tpl.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Spreadsheet editor */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Starter Data / Template
          </label>
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#2A342A] p-1 rounded-lg">
              <span className="text-xs font-semibold text-gray-500 px-1.5">Rows</span>
              <button onClick={removeRow} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors text-gray-600 dark:text-gray-300 cursor-pointer border-none bg-transparent"><Minus size={13} /></button>
              <button onClick={addRow}    className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors text-gray-600 dark:text-gray-300 cursor-pointer border-none bg-transparent"><Plus  size={13} /></button>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#2A342A] p-1 rounded-lg">
              <span className="text-xs font-semibold text-gray-500 px-1.5">Cols</span>
              <button onClick={removeColumn} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors text-gray-600 dark:text-gray-300 cursor-pointer border-none bg-transparent"><Minus size={13} /></button>
              <button onClick={addColumn}    className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors text-gray-600 dark:text-gray-300 cursor-pointer border-none bg-transparent"><Plus  size={13} /></button>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Cells pre-filled here will appear as the starter state for students. You can use formulas (e.g. <code className="bg-gray-100 dark:bg-white/10 px-1 py-0.5 rounded text-[11px]">=B2+C2</code>) — they compute automatically.
        </p>
        <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-x-auto bg-white">
          <div className="p-2 min-w-max">
            <Spreadsheet
              data={currentData}
              onChange={handleSpreadsheetChange}
              CustomComponents={{ DataViewer: CustomDataViewer }}
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-[#5D7C59]/40"></span>
          Pre-filled cells are visible to students. Leave cells blank for students to fill in.
        </p>
      </div>
    </div>
  );
};

export default SpreadsheetBuilder;
