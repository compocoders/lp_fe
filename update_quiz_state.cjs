const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'classroom', 'InteractiveQuizGame.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Add useEffect import
if (!content.includes('useEffect')) {
  content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';");
}

// Replace the signature
if (content.includes("const InteractiveQuizGame = ({ quizData }) => {")) {
  content = content.replace("const InteractiveQuizGame = ({ quizData }) => {", "const InteractiveQuizGame = ({ quizData, quizId }) => {");
}

// Replace the state hooks
const oldHooks = `  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);`;

const newHooks = `  const getInitialState = (key, defaultVal) => {
    if (!quizId) return defaultVal;
    try {
      const saved = localStorage.getItem(\`quiz_\${quizId}_\${key}\`);
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
      localStorage.setItem(\`quiz_\${quizId}_currentIndex\`, JSON.stringify(currentIndex));
      localStorage.setItem(\`quiz_\${quizId}_userAnswers\`, JSON.stringify(userAnswers));
      localStorage.setItem(\`quiz_\${quizId}_showResult\`, JSON.stringify(showResult));
      localStorage.setItem(\`quiz_\${quizId}_isFinished\`, JSON.stringify(isFinished));
    }
  }, [quizId, currentIndex, userAnswers, showResult, isFinished]);`;

if (content.includes(oldHooks)) {
  content = content.replace(oldHooks, newHooks);
} else {
  console.log("Hooks not found. Maybe already replaced?");
}

fs.writeFileSync(filePath, content);
console.log("InteractiveQuizGame updated for state persistence.");
