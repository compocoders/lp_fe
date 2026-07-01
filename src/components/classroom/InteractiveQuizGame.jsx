import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Award, Lightbulb } from 'lucide-react';

const InteractiveQuizGame = ({ quizData, quizId }) => {
  const getInitialState = (key, defaultVal) => {
    if (!quizId) return defaultVal;
    try {
      const saved = localStorage.getItem(`quiz_${quizId}_${key}`);
      return saved ? JSON.parse(saved) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  };

  const [currentIndex, setCurrentIndex] = useState(() => getInitialState('currentIndex', 0));
  const [userAnswers, setUserAnswers] = useState(() => getInitialState('userAnswers', {}));
  const [showResult, setShowResult] = useState(() => getInitialState('showResult', false));
  const [isFinished, setIsFinished] = useState(() => getInitialState('isFinished', false));

  useEffect(() => {
    if (quizId) {
      localStorage.setItem(`quiz_${quizId}_currentIndex`, JSON.stringify(currentIndex));
      localStorage.setItem(`quiz_${quizId}_userAnswers`, JSON.stringify(userAnswers));
      localStorage.setItem(`quiz_${quizId}_showResult`, JSON.stringify(showResult));
      localStorage.setItem(`quiz_${quizId}_isFinished`, JSON.stringify(isFinished));
    }
  }, [quizId, currentIndex, userAnswers, showResult, isFinished]);

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return <div className="text-gray-500">Failed to load quiz data.</div>;
  }

  const questions = quizData.questions;
  const currentQuestion = questions[currentIndex];
  
  const handleOptionClick = (optionIndex) => {
    if (showResult) return; // Prevent changing answer after selection
    
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setShowResult(false);
    setIsFinished(false);
  };

  if (isFinished) {
    const score = questions.reduce((acc, q, i) => {
      return acc + (userAnswers[i] === q.correctAnswer ? 1 : 0);
    }, 0);

    return (
      <div className="flex flex-col h-full bg-white dark:bg-[#1A211A] rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100 dark:border-white/10 animate-fade-in-up">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <div className="w-20 h-20 bg-[#FFC700]/10 rounded-full flex items-center justify-center mb-4">
            <Award size={40} className="text-[#B88F00] dark:text-[#FFC700]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">Quiz Completed!</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            You scored <span className="font-bold text-[#5D7C59]">{score}</span> out of {questions.length}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-6 scrollbar-thin">
          {questions.map((q, i) => {
            const isCorrect = userAnswers[i] === q.correctAnswer;
            return (
              <div key={i} className="p-5 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
                <div className="flex items-start gap-3 mb-4">
                  <div className="mt-0.5">
                    {isCorrect ? (
                      <CheckCircle2 size={20} className="text-green-500" />
                    ) : (
                      <XCircle size={20} className="text-red-500" />
                    )}
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-gray-800 dark:text-gray-200 leading-relaxed">
                    {q.question}
                  </h3>
                </div>

                <div className="flex flex-col gap-2 pl-8 mb-4">
                  {q.options.map((opt, optIdx) => {
                    let optClass = "text-sm px-4 py-2.5 rounded-xl border ";
                    if (optIdx === q.correctAnswer) {
                      optClass += "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 font-semibold";
                    } else if (optIdx === userAnswers[i] && !isCorrect) {
                      optClass += "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300";
                    } else {
                      optClass += "bg-white dark:bg-[#232B23] border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 opacity-60";
                    }
                    return (
                      <div key={optIdx} className={optClass}>
                        {opt}
                      </div>
                    );
                  })}
                </div>

                <div className="pl-8">
                  <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
                    <Lightbulb size={16} className="text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-xs md:text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10 flex justify-center shrink-0">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-6 py-3 bg-[#5D7C59] hover:bg-[#4A6447] text-white rounded-xl font-bold transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw size={18} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1A211A] rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100 dark:border-white/10 animate-fade-in-up">
      {/* Progress Bar */}
      <div className="mb-8 shrink-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-xs font-bold text-[#5D7C59]">
            {Math.round(((currentIndex) / questions.length) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#5D7C59] transition-all duration-500 rounded-full"
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8 flex-1 overflow-y-auto pr-2 scrollbar-hide">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white leading-relaxed mb-8">
          {currentQuestion.question}
        </h2>

        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((option, idx) => {
            let btnClass = "w-full text-left px-5 py-4 rounded-xl border transition-all cursor-pointer text-sm md:text-base font-medium relative overflow-hidden ";
            
            if (!showResult) {
              btnClass += "bg-white dark:bg-[#232B23] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:border-[#5D7C59]/40 hover:shadow-sm";
            } else {
              if (idx === currentQuestion.correctAnswer) {
                btnClass += "bg-green-50 dark:bg-green-900/20 border-green-500/50 text-green-700 dark:text-green-300";
              } else if (idx === userAnswers[currentIndex]) {
                btnClass += "bg-red-50 dark:bg-red-900/20 border-red-500/50 text-red-700 dark:text-red-300";
              } else {
                btnClass += "bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-400 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={showResult}
                className={btnClass}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Explanation area */}
        {showResult && (
          <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex items-start gap-3 animate-fade-in-up">
            <Lightbulb size={18} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer / Next Button */}
      <div className="mt-4 pt-6 border-t border-gray-100 dark:border-white/10 flex justify-end shrink-0 min-h-[70px]">
        {showResult && (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-[#5D7C59] hover:bg-[#4A6447] text-white rounded-xl font-bold transition-colors shadow-sm cursor-pointer animate-fade-in-up"
          >
            {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default InteractiveQuizGame;
