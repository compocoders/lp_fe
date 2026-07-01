const fs = require('fs');

const content = fs.readFileSync('src/components/classroom/CreateActivityModal.jsx', 'utf8');

const newContent = `            {/* Scrollable form */}
            <div className="overflow-y-auto flex-1 px-4 sm:px-6 pb-4">
              <div className="flex flex-col gap-5">

                {/* Topic */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Topic / Subject</label>
                  <input
                    type="text"
                    placeholder="e.g., Photosynthesis, Python For Loops"
                    value={aiForm.topic}
                    onChange={e => setAiForm({ ...aiForm, topic: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#5D7C59] transition-colors"
                  />
                </div>

                {/* Grade level */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Grade Level</label>
                  <input
                    type="text"
                    placeholder="e.g., 5th Grade, High School, College"
                    value={aiForm.gradeLevel}
                    onChange={e => setAiForm({ ...aiForm, gradeLevel: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#5D7C59] transition-colors"
                  />
                </div>

                {/* Activity Format */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Activity Format</label>
                  <div className="relative">
                    <select
                      value={aiForm.type}
                      onChange={e => setAiForm({ ...aiForm, type: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-[#5D7C59] transition-colors appearance-none"
                    >
                      <option value="QUIZ">Quiz / Multiple Choice</option>
                      <option value="PROBLEM_SET">Problem Set / Short Answer</option>
                      <option value="ESSAY">Essay Prompt</option>
                      <option value="CODING">Coding Challenge</option>
                      <option value="SPREADSHEET">Spreadsheet Task</option>
                      <option value="FRONTEND">Frontend UI Task</option>
                      <option value="CASE_STUDY">Case Study Scenario</option>
                      <option value="PRESENTATION">File Submission Prompt</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                {/* ── QUIZ settings ─────────────────────────────────────── */}
                {aiForm.type === 'QUIZ' && (
                  <div className="flex flex-col gap-4 p-4 sm:p-5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl">
                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quiz Settings</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">No. of Questions</label>
                        <div className="flex items-center gap-3 bg-white dark:bg-black/20 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10">
                          <input
                            type="range" min="3" max="20" step="1"
                            value={aiForm.quizCount}
                            onChange={e => setAiForm({ ...aiForm, quizCount: +e.target.value })}
                            className="flex-1 accent-[#5D7C59]"
                          />
                          <span className="text-sm font-bold text-[#5D7C59] w-6 text-right tabular-nums">{aiForm.quizCount}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Difficulty</label>
                        <div className="relative">
                          <select
                            value={aiForm.difficulty}
                            onChange={e => setAiForm({ ...aiForm, difficulty: e.target.value })}
                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#5D7C59] appearance-none"
                          >
                            <option value="easy">Easy</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="hard">Hard</option>
                            <option value="mixed">Mixed</option>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Question Type</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { id: 'multiple_choice', label: 'Multiple Choice' },
                          { id: 'true_false',      label: 'True / False' },
                          { id: 'mixed',           label: 'Mixed' },
                        ].map(qt => (
                          <button key={qt.id} type="button"
                            onClick={() => setAiForm({ ...aiForm, quizType: qt.id })}
                            className={\`px-3 py-2.5 rounded-xl border text-[11px] font-bold transition-all text-center \${
                              aiForm.quizType === qt.id
                                ? 'bg-[#5D7C59]/10 border-[#5D7C59] text-[#5D7C59] shadow-sm'
                                : 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#5D7C59]/40 hover:bg-gray-50'
                            }\`}
                          >{qt.label}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── PROBLEM_SET settings ───────────────────────────────── */}
                {aiForm.type === 'PROBLEM_SET' && (
                  <div className="flex flex-col gap-4 p-4 sm:p-5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl">
                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Problem Set Settings</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">No. of Problems</label>
                        <div className="flex items-center gap-3 bg-white dark:bg-black/20 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10">
                          <input
                            type="range" min="2" max="10" step="1"
                            value={aiForm.problemCount}
                            onChange={e => setAiForm({ ...aiForm, problemCount: +e.target.value })}
                            className="flex-1 accent-[#5D7C59]"
                          />
                          <span className="text-sm font-bold text-[#5D7C59] w-6 text-right tabular-nums">{aiForm.problemCount}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Difficulty</label>
                        <div className="relative">
                          <select
                            value={aiForm.difficulty}
                            onChange={e => setAiForm({ ...aiForm, difficulty: e.target.value })}
                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#5D7C59] appearance-none"
                          >
                            <option value="easy">Easy</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="hard">Hard</option>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── ESSAY settings ─────────────────────────────────────── */}
                {aiForm.type === 'ESSAY' && (
                  <div className="flex flex-col gap-4 p-4 sm:p-5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl">
                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Essay Settings</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Target Word Count</label>
                        <div className="flex items-center gap-3 bg-white dark:bg-black/20 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10">
                          <input
                            type="range" min="100" max="1500" step="50"
                            value={aiForm.wordCount}
                            onChange={e => setAiForm({ ...aiForm, wordCount: +e.target.value })}
                            className="flex-1 accent-[#5D7C59]"
                          />
                          <span className="text-[11px] font-bold text-[#5D7C59] w-10 text-right tabular-nums">{aiForm.wordCount}w</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Difficulty</label>
                        <div className="relative">
                          <select
                            value={aiForm.difficulty}
                            onChange={e => setAiForm({ ...aiForm, difficulty: e.target.value })}
                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#5D7C59] appearance-none"
                          >
                            <option value="easy">Introductory</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="hard">Advanced</option>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── CODING settings ────────────────────────────────────── */}
                {aiForm.type === 'CODING' && (
                  <div className="flex flex-col gap-4 p-4 sm:p-5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl">
                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Coding Settings</p>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Programming Language</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          { id: 'javascript', label: 'JavaScript' },
                          { id: 'python',     label: 'Python' },
                          { id: 'java',       label: 'Java' },
                          { id: 'cpp',        label: 'C++' },
                        ].map(lang => (
                          <button key={lang.id} type="button"
                            onClick={() => setAiForm({ ...aiForm, codingLanguage: lang.id })}
                            className={\`px-4 py-3 rounded-xl border text-sm font-semibold transition-all text-left \${
                              aiForm.codingLanguage === lang.id
                                ? 'bg-[#5D7C59]/10 border-[#5D7C59] text-[#5D7C59] shadow-sm'
                                : 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-[#5D7C59]/50 hover:bg-gray-50'
                            }\`}
                          >{lang.label}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Difficulty</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {['easy', 'intermediate', 'hard'].map(d => (
                          <button key={d} type="button"
                            onClick={() => setAiForm({ ...aiForm, difficulty: d })}
                            className={\`flex-1 py-3 rounded-xl border text-[11px] font-bold capitalize transition-all \${
                              aiForm.difficulty === d
                                ? 'bg-[#5D7C59]/10 border-[#5D7C59] text-[#5D7C59] shadow-sm'
                                : 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#5D7C59]/40 hover:bg-gray-50'
                            }\`}
                          >{d}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── FRONTEND settings ──────────────────────────────────── */}
                {aiForm.type === 'FRONTEND' && (
                  <div className="flex flex-col gap-4 p-4 sm:p-5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl">
                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Frontend Settings</p>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">CSS Framework</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { id: 'native',    label: 'Native CSS',  desc: 'Vanilla' },
                          { id: 'tailwind',  label: 'Tailwind',    desc: 'Utility-first' },
                          { id: 'bootstrap', label: 'Bootstrap 5', desc: 'Components' },
                        ].map(fw => (
                          <button key={fw.id} type="button"
                            onClick={() => setAiForm({ ...aiForm, cssFramework: fw.id })}
                            className={\`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border text-center transition-all \${
                              aiForm.cssFramework === fw.id
                                ? 'bg-[#5D7C59]/10 border-[#5D7C59] text-[#5D7C59] shadow-sm'
                                : 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-[#5D7C59]/50 hover:bg-gray-50'
                            }\`}
                          >
                            <span className="text-xs font-bold">{fw.label}</span>
                            <span className="text-[10px] opacity-60">{fw.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Difficulty</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {['beginner', 'intermediate', 'advanced'].map(d => (
                          <button key={d} type="button"
                            onClick={() => setAiForm({ ...aiForm, difficulty: d })}
                            className={\`flex-1 py-3 rounded-xl border text-[11px] font-bold capitalize transition-all \${
                              aiForm.difficulty === d
                                ? 'bg-[#5D7C59]/10 border-[#5D7C59] text-[#5D7C59] shadow-sm'
                                : 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#5D7C59]/40 hover:bg-gray-50'
                            }\`}
                          >{d}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── SPREADSHEET settings ───────────────────────────────── */}
                {aiForm.type === 'SPREADSHEET' && (
                  <div className="flex flex-col gap-4 p-4 sm:p-5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl">
                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Spreadsheet Settings</p>

                    {/* Tab switcher */}
                    <div className="flex flex-col sm:flex-row gap-1 bg-white dark:bg-black/20 p-1.5 rounded-xl border border-gray-200 dark:border-white/10">
                      {[{ id: 'general', label: 'General' }, { id: 'business', label: 'Business / Accounting' }].map(tab => (
                        <button key={tab.id} type="button"
                          onClick={() => setAiForm({ ...aiForm, spreadsheetTab: tab.id })}
                          className={\`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all \${
                            aiForm.spreadsheetTab === tab.id
                              ? 'bg-[#5D7C59] text-white shadow-sm'
                              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                          }\`}
                        >{tab.label}</button>
                      ))}
                    </div>

                    {aiForm.spreadsheetTab === 'general' && (
                      <div className="flex flex-col gap-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Number of Columns</label>
                          <div className="flex items-center gap-3 bg-white dark:bg-black/20 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10">
                            <input
                              type="range" min="2" max="8" step="1"
                              value={aiForm.spreadsheetColumns}
                              onChange={e => setAiForm({ ...aiForm, spreadsheetColumns: +e.target.value })}
                              className="flex-1 accent-[#5D7C59]"
                            />
                            <span className="text-sm font-bold text-[#5D7C59] w-6 text-right tabular-nums">{aiForm.spreadsheetColumns}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Task Type</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {[
                              { id: 'data_entry', label: 'Data Entry' },
                              { id: 'formulas',   label: 'Formulas' },
                              { id: 'charts',     label: 'Analysis / Charts' },
                              { id: 'mixed',      label: 'Mixed' },
                            ].map(t => (
                              <button key={t.id} type="button"
                                onClick={() => setAiForm({ ...aiForm, spreadsheetTask: t.id })}
                                className={\`py-3 px-4 rounded-xl border text-xs font-semibold transition-all text-left \${
                                  aiForm.spreadsheetTask === t.id
                                    ? 'bg-[#5D7C59]/10 border-[#5D7C59] text-[#5D7C59] shadow-sm'
                                    : 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#5D7C59]/40 hover:bg-gray-50'
                                }\`}
                              >{t.label}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {aiForm.spreadsheetTab === 'business' && (
                      <div>
                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Document Type</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {[
                            { id: 'balance_sheet',    label: 'Balance Sheet',       icon: <Scale size={14} /> },
                            { id: 'income_statement', label: 'Income Statement',    icon: <BarChart2 size={14} /> },
                            { id: 'cash_flow',        label: 'Cash Flow Statement', icon: <Coins size={14} /> },
                            { id: 't_account',        label: 'T-Account Ledger',    icon: <Layout size={14} /> },
                            { id: 'trial_balance',    label: 'Trial Balance',       icon: <ClipboardList size={14} /> },
                            { id: 'journal_entries',  label: 'General Journal',     icon: <BookOpen size={14} /> },
                            { id: 'budget',           label: 'Budget Plan',         icon: <Wallet size={14} /> },
                            { id: 'inventory',        label: 'Inventory Ledger',    icon: <Package size={14} /> },
                          ].map(t => (
                            <button key={t.id} type="button"
                              onClick={() => setAiForm({ ...aiForm, spreadsheetTask: t.id })}
                              className={\`flex items-center gap-3 py-3 px-4 rounded-xl border text-xs font-semibold transition-all text-left \${
                                aiForm.spreadsheetTask === t.id
                                  ? 'bg-[#5D7C59]/10 border-[#5D7C59] text-[#5D7C59] shadow-sm'
                                  : 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#5D7C59]/40 hover:bg-gray-50'
                              }\`}
                            >
                              <span className="opacity-70 text-[#5D7C59]">{t.icon}</span> {t.label}
                            </button>
                          ))}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-3 leading-relaxed">AI will generate a pre-structured accounting document with proper rows, labels, and formulas.</p>
                      </div>
                    )}
                  </div>
                )}


                {/* ── CASE_STUDY settings ────────────────────────────────── */}
                {aiForm.type === 'CASE_STUDY' && (
                  <div className="flex flex-col gap-4 p-4 sm:p-5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl">
                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Case Study Settings</p>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Complexity</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {['simple', 'moderate', 'complex'].map(d => (
                          <button key={d} type="button"
                            onClick={() => setAiForm({ ...aiForm, difficulty: d })}
                            className={\`flex-1 py-3 rounded-xl border text-[11px] font-bold capitalize transition-all \${
                              aiForm.difficulty === d
                                ? 'bg-[#5D7C59]/10 border-[#5D7C59] text-[#5D7C59] shadow-sm'
                                : 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#5D7C59]/40 hover:bg-gray-50'
                            }\`}
                          >{d}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Specific Instructions */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Additional Instructions <span className="font-normal text-gray-400">(Optional)</span></label>
                  <textarea
                    placeholder="e.g. Focus on real-world examples, add a bonus question..."
                    value={aiForm.instructions}
                    onChange={e => setAiForm({ ...aiForm, instructions: e.target.value })}
                    className="w-full h-24 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#5D7C59] transition-colors resize-none"
                  />
                </div>

              </div>
            </div>

            {/* Error */}
            {aiError && (
              <div className="mx-4 sm:mx-6 mt-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" /> {aiError}
              </div>
            )}

            {/* Actions */}
            <div className="px-4 sm:px-6 py-4 flex items-center gap-3 border-t border-gray-100 dark:border-white/10 shrink-0 bg-white dark:bg-[#1A211A] rounded-b-2xl mt-auto">
              <button
                onClick={() => setShowAIModal(false)}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-3.5 text-gray-600 dark:text-gray-400 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer border-none"
              >
                Cancel
              </button>
              <button
                onClick={handleAIGenerate}
                disabled={isAIGenerating || isTokensExhausted() || !hasEnough || !aiForm.topic.trim()}
                className="flex-[2] sm:flex-none px-4 sm:px-8 py-3.5 bg-gradient-to-r from-[#5D7C59] to-[#4A6447] text-white font-bold text-sm rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-none whitespace-nowrap"
              >
                {isAIGenerating ? (
                  <><Loader2 size={16} className="animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles size={16} /> Generate Activity</>
                )}
              </button>
            </div>`;

const startIndex = content.indexOf('{/* Scrollable form */}');
const endIndex = content.indexOf('          </div>\n        </div>\n      )}\n    </div>');

if (startIndex === -1 || endIndex === -1) {
  console.log('Could not find markers');
  process.exit(1);
}

const newFileContent = content.substring(0, startIndex) + newContent + '\n' + content.substring(endIndex);
fs.writeFileSync('src/components/classroom/CreateActivityModal.jsx', newFileContent, 'utf8');
console.log('UI Replace Success');
