import React, { useState, useEffect, useRef } from 'react';
import type { QuizAttempt, QuizQuestion } from '../types/index.ts';
import { QUIZ_CATEGORIES, QUIZ_QUESTIONS } from '../data/quizDatabase.ts';

interface QuizZoneViewProps {
  initialCategory?: string;
  onQuizCompleted: (attempt: QuizAttempt) => void;
  quizHistory: QuizAttempt[];
  onNavigateToSkillGap: () => void;
}

export const QuizZoneView: React.FC<QuizZoneViewProps> = ({
  initialCategory,
  onQuizCompleted,
  quizHistory,
  onNavigateToSkillGap,
}) => {
  // Quiz configuration state
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || 'Data Structures and Algorithms'
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [timerMode, setTimerMode] = useState<'none' | 'question_30' | 'total_10m'>('none');
  const [quizState, setQuizState] = useState<'config' | 'in_progress' | 'results'>('config');

  // Active quiz session state
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);

  // Results tracking
  const [userAnswers, setUserAnswers] = useState<
    { questionId: string; selectedIndex: number; correctIndex: number; isCorrect: boolean }[]
  >([]);
  const [showReviewList, setShowReviewList] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  // Sync category if passed via prop
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Start a new quiz session
  const handleStartQuiz = () => {
    let pool = QUIZ_QUESTIONS.filter((q) => {
      const matchCat =
        selectedCategory === 'All' ||
        q.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes(q.category.toLowerCase());
      const matchDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
      return matchCat && matchDiff;
    });

    if (pool.length === 0) {
      // Fallback to all questions if none match strict filter
      pool = QUIZ_QUESTIONS;
    }

    // Shuffle and pick up to 8 questions
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 8);
    setActiveQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedAnswerIndex(null);
    setIsAnswerSubmitted(false);
    setUserAnswers([]);
    setSessionStartTime(Date.now());
    setQuizState('in_progress');

    // Timer setup
    if (timerMode === 'question_30') {
      setTimeLeft(30);
    } else if (timerMode === 'total_10m') {
      setTimeLeft(600);
    }
  };

  // Timer loop
  useEffect(() => {
    if (quizState !== 'in_progress' || timerMode === 'none') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired
          if (!isAnswerSubmitted) {
            handleAutoSubmitOnTimeout();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizState, timerMode, isAnswerSubmitted, currentIndex]);

  const handleAutoSubmitOnTimeout = () => {
    const currentQ = activeQuestions[currentIndex];
    if (!currentQ) return;

    setIsAnswerSubmitted(true);
    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selectedIndex: -1,
        correctIndex: currentQ.answerIndex,
        isCorrect: false,
      },
    ]);
  };

  // User selects an option
  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswerIndex(idx);
    setIsAnswerSubmitted(true);

    const currentQ = activeQuestions[currentIndex];
    const isCorrect = idx === currentQ.answerIndex;

    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selectedIndex: idx,
        correctIndex: currentQ.answerIndex,
        isCorrect,
      },
    ]);
  };

  // Next Question or Finish
  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswerIndex(null);
      setIsAnswerSubmitted(false);
      if (timerMode === 'question_30') {
        setTimeLeft(30);
      }
    } else {
      finishQuiz();
    }
  };

  // Finish quiz and calculate metrics
  const finishQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const durationSeconds = Math.max(1, Math.round((Date.now() - sessionStartTime) / 1000));
    const total = activeQuestions.length;
    const score = userAnswers.filter((a) => a.isCorrect).length;
    const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

    // Topic breakdown
    const topicBreakdown: Record<string, { correct: number; total: number }> = {};
    activeQuestions.forEach((q, idx) => {
      const ans = userAnswers[idx];
      const tag = q.topicTag || q.category;
      if (!topicBreakdown[tag]) {
        topicBreakdown[tag] = { correct: 0, total: 0 };
      }
      topicBreakdown[tag].total += 1;
      if (ans && ans.isCorrect) {
        topicBreakdown[tag].correct += 1;
      }
    });

    const attempt: QuizAttempt = {
      id: `att-${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: selectedCategory,
      difficulty: selectedDifficulty,
      score,
      total,
      accuracy,
      timeSpentSeconds: durationSeconds,
      topicBreakdown,
      userAnswers,
    };

    onQuizCompleted(attempt);
    setQuizState('results');
  };

  const currentQ = activeQuestions[currentIndex];

  return (
    <div className="wrap max-w-[1180px] mx-auto py-6 space-y-8">
      {/* Quiz Screen Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#150F2B] via-[#241348] to-[#150F2B] border border-[#2B2052] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED] text-xs font-semibold text-[#5EEAD4] mb-2">
            ⚡ INTERACTIVE TESTING SUITE
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Placement Technical Quiz Zone
          </h1>
          <p className="text-xs text-[#A096C8] mt-1">
            Multiple-choice drills with immediate explanations, difficulty levels, and performance telemetry.
          </p>
        </div>

        {quizState !== 'config' && (
          <button
            onClick={() => setQuizState('config')}
            className="btn ghost text-xs whitespace-nowrap"
          >
            ← Exit to Quiz Menu
          </button>
        )}
      </div>

      {/* VIEW 1: CONFIGURATION & HISTORY */}
      {quizState === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Quiz Launcher (2 cols) */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#150F2B] border border-[#2B2052] space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🎯</span> Select Your Quiz Topic & Format
            </h2>

            {/* Category selection */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#A096C8] mb-2 block">
                Technical Subject Category:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUIZ_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'border-[#5EEAD4] bg-[#5EEAD4]/10 text-[#5EEAD4]'
                        : 'border-[#2B2052] bg-[#100B20] text-[#A096C8] hover:text-white hover:border-[#A78BFA]/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty selection */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#A096C8] mb-2 block">
                Difficulty Level:
              </label>
              <div className="flex flex-wrap gap-2">
                {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      selectedDifficulty === diff
                        ? 'border-[#A78BFA] bg-[#A78BFA]/20 text-white'
                        : 'border-[#2B2052] bg-[#100B20] text-[#A096C8] hover:border-[#A78BFA]/40'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer mode */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#A096C8] mb-2 block">
                Timer Mode:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'none', label: 'Untimed Practice', desc: 'No timer pressure' },
                  { id: 'question_30', label: '30s Per Question', desc: 'Fast reflex drill' },
                  { id: 'total_10m', label: '10-Min Quiz Timer', desc: 'Simulated assessment' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setTimerMode(mode.id as any)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      timerMode === mode.id
                        ? 'border-[#E879F9] bg-[#E879F9]/10 text-white'
                        : 'border-[#2B2052] bg-[#100B20] text-[#A096C8] hover:border-[#A78BFA]/40'
                    }`}
                  >
                    <div className="font-bold text-xs">{mode.label}</div>
                    <div className="text-[11px] text-[#A096C8] mt-0.5">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-4 border-t border-[#2B2052]">
              <button
                onClick={handleStartQuiz}
                className="btn w-full py-3.5 text-base font-extrabold bg-gradient-to-r from-[#5EEAD4] via-[#A78BFA] to-[#E879F9] text-[#07050D]"
              >
                Start Quiz Now →
              </button>
            </div>
          </div>

          {/* Past Attempts History (1 col) */}
          <div className="p-6 rounded-2xl bg-[#150F2B] border border-[#2B2052] space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>📊 Quiz History</span>
                <span className="text-xs text-[#A096C8]">{quizHistory.length} total attempts</span>
              </h3>

              <div className="mt-4 space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {quizHistory.length === 0 ? (
                  <div className="text-xs text-[#A096C8] text-center py-8">
                    No completed quizzes yet. Take your first quiz to begin tracking performance!
                  </div>
                ) : (
                  quizHistory.slice(0, 6).map((att) => (
                    <div
                      key={att.id}
                      className="p-3 rounded-xl bg-[#100B20] border border-[#2B2052] text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between font-bold text-white">
                        <span className="truncate max-w-[150px]">{att.category}</span>
                        <span
                          className={`font-mono text-xs ${
                            att.accuracy >= 75
                              ? 'text-[#5EEAD4]'
                              : att.accuracy >= 50
                              ? 'text-[#A78BFA]'
                              : 'text-[#E879F9]'
                          }`}
                        >
                          {att.score}/{att.total} ({att.accuracy}%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#A096C8]">
                        <span>Diff: {att.difficulty}</span>
                        <span>{att.timeSpentSeconds}s spent</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={onNavigateToSkillGap}
              className="btn ghost text-xs w-full text-center text-[#5EEAD4] border-[#5EEAD4]/30 hover:border-[#5EEAD4]"
            >
              View Skill Gap Diagnosis →
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: ACTIVE QUIZ QUESTION */}
      {quizState === 'in_progress' && currentQ && (
        <div className="p-6 md:p-8 rounded-2xl bg-[#150F2B] border border-[#2B2052] space-y-6">
          {/* Progress bar & Timer header */}
          <div className="flex items-center justify-between gap-4 border-b border-[#2B2052] pb-4">
            <div className="space-y-1">
              <div className="text-xs text-[#A096C8]">
                Question {currentIndex + 1} of {activeQuestions.length} ·{' '}
                <span className="text-[#A78BFA] font-semibold">{currentQ.category}</span>
              </div>
              <div className="w-48 h-2 rounded-full bg-[#100B20] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#A78BFA] to-[#5EEAD4] transition-all"
                  style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {timerMode !== 'none' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#100B20] border border-[#2B2052]">
                <span className="text-xs">⏱️</span>
                <span
                  className={`font-mono font-bold text-sm ${
                    timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-[#5EEAD4]'
                  }`}
                >
                  {timeLeft}s
                </span>
              </div>
            )}
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <div className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#2B2052] text-[#A78BFA]">
              {currentQ.difficulty} Difficulty
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white leading-snug">
              {currentQ.question}
            </h2>
            {currentQ.codeSnippet && (
              <pre className="p-4 rounded-xl bg-[#07050D] text-xs font-mono text-[#5EEAD4] overflow-x-auto border border-[#2B2052]">
                <code>{currentQ.codeSnippet}</code>
              </pre>
            )}
          </div>

          {/* 4 Multiple Choice Options */}
          <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswerIndex === idx;
              const isCorrectAnswer = idx === currentQ.answerIndex;

              let btnStyle = 'bg-[#100B20] border-[#2B2052] text-[#F1ECFF] hover:border-[#A78BFA]';

              if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-[#5EEAD4]/20 border-[#5EEAD4] text-[#5EEAD4] font-bold shadow-md shadow-[#5EEAD4]/10';
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = 'bg-red-500/20 border-red-500 text-red-300 font-bold';
                } else {
                  btnStyle = 'bg-[#100B20]/40 border-[#2B2052] text-[#A096C8]/60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-xl border text-left text-sm transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#07050D] flex items-center justify-center text-xs font-bold border border-[#2B2052]">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswerSubmitted && isCorrectAnswer && (
                    <span className="text-xs font-bold text-[#5EEAD4]">✓ Correct</span>
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                    <span className="text-xs font-bold text-red-400">✗ Incorrect</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box (Visible instantly after answer is selected) */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-xl bg-[#100B20] border border-[#2B2052] space-y-2 animate-fadeIn">
              <div className="text-xs font-bold uppercase tracking-wider text-[#5EEAD4] flex items-center gap-1.5">
                <span>💡</span> Technical Explanation:
              </div>
              <p className="text-xs text-[#F1ECFF] leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Next / Submit Button */}
          {isAnswerSubmitted && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="btn py-2.5 px-6 font-bold bg-gradient-to-r from-[#A78BFA] to-[#5EEAD4] text-[#07050D]"
              >
                {currentIndex + 1 < activeQuestions.length ? 'Next Question →' : 'View Final Results 🏆'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: RESULTS & REVIEW */}
      {quizState === 'results' && (
        <div className="p-6 md:p-8 rounded-2xl bg-[#150F2B] border border-[#2B2052] space-y-8">
          {/* Top Banner */}
          <div className="text-center space-y-3">
            <div className="inline-block text-4xl">
              {userAnswers.filter((a) => a.isCorrect).length >= activeQuestions.length * 0.75
                ? '🎉'
                : '📈'}
            </div>
            <h2 className="text-2xl font-extrabold text-white">Quiz Completed!</h2>
            <div className="text-sm text-[#A096C8]">
              Subject: <b className="text-white">{selectedCategory}</b> · Difficulty: {selectedDifficulty}
            </div>

            {/* Score & Accuracy Badges */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#100B20] border border-[#2B2052] min-w-[130px]">
                <div className="text-xs text-[#A096C8]">Final Score</div>
                <div className="text-2xl font-extrabold text-[#5EEAD4]">
                  {userAnswers.filter((a) => a.isCorrect).length} / {activeQuestions.length}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#100B20] border border-[#2B2052] min-w-[130px]">
                <div className="text-xs text-[#A096C8]">Accuracy Rate</div>
                <div className="text-2xl font-extrabold text-[#A78BFA]">
                  {Math.round((userAnswers.filter((a) => a.isCorrect).length / activeQuestions.length) * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleStartQuiz()}
              className="btn bg-gradient-to-r from-[#5EEAD4] to-[#A78BFA] text-[#07050D] font-bold"
            >
              🔄 Retry This Quiz
            </button>
            <button
              onClick={() => setShowReviewList(!showReviewList)}
              className="btn ghost text-xs"
            >
              {showReviewList ? 'Hide Detailed Review' : '📝 Review All Answers'}
            </button>
            <button
              onClick={onNavigateToSkillGap}
              className="btn ghost text-xs text-[#E879F9] border-[#E879F9]/40 hover:border-[#E879F9]"
            >
              Analyze Skill Gaps →
            </button>
          </div>

          {/* Review List */}
          {showReviewList && (
            <div className="space-y-4 pt-4 border-t border-[#2B2052]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Question Review & Misconceptions:
              </h3>
              {activeQuestions.map((q, qIdx) => {
                const userAns = userAnswers[qIdx];
                const isCorrect = userAns && userAns.isCorrect;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border space-y-2 ${
                      isCorrect ? 'bg-[#100B20] border-[#5EEAD4]/40' : 'bg-[#100B20] border-red-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">Question {qIdx + 1}</span>
                      <span className={isCorrect ? 'text-[#5EEAD4] font-bold' : 'text-red-400 font-bold'}>
                        {isCorrect ? '✓ Correct' : '✗ Missed'}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-[#F1ECFF]">{q.question}</div>
                    <div className="text-xs text-[#A096C8]">
                      Your answer: <b>{userAns && userAns.selectedIndex >= 0 ? q.options[userAns.selectedIndex] : 'Timed Out'}</b>
                    </div>
                    {!isCorrect && (
                      <div className="text-xs text-[#5EEAD4]">
                        Correct answer: <b>{q.options[q.answerIndex]}</b>
                      </div>
                    )}
                    <div className="text-xs text-[#A096C8] bg-[#07050D] p-3 rounded-lg border border-[#2B2052]">
                      <span className="text-white font-semibold">Explanation:</span> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
