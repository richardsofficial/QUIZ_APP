import React, { useState, useCallback, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Send,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import CountdownTimer from '../components/CountdownTimer';
import QuestionCard from '../components/QuestionCard';
import QuestionNavigator from '../components/QuestionNavigator';
import SubmissionModal from '../components/SubmissionModal';
import { useQuizTimer } from '../hooks/useQuizTimer';

export default function QuizScreen({
  questions = [],
  categoryName,
  totalDurationSeconds,
  onSubmitQuiz,
  onExitQuiz,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safety ref to guarantee only a single submission happens
  const hasSubmittedRef = useRef(false);

  // Calculate answered count
  const answeredCount = Object.keys(userAnswers).filter(
    (key) => userAnswers[key] !== undefined && userAnswers[key] !== null && userAnswers[key] !== ''
  ).length;

  const currentQuestion = questions[currentIndex] || null;
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;

  // Handle auto-submit on timeout
  const handleTimeout = useCallback(() => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    setIsSubmitting(true);
    setShowSubmitModal(false);

    // Stop timer and submit with 'timeout' mode
    const finalElapsed = timerResult.stopTimer();
    onSubmitQuiz({
      answers: userAnswers,
      timeSpentSeconds: finalElapsed || totalDurationSeconds,
      submissionType: 'timeout',
    });
  }, [userAnswers, totalDurationSeconds, onSubmitQuiz]);

  // Hook up timer
  const timerResult = useQuizTimer({
    totalDurationSeconds,
    onTimeout: handleTimeout,
    isRunning: !isSubmitting,
  });

  // Handle answer selection
  const handleSelectAnswer = useCallback((questionId, option) => {
    if (hasSubmittedRef.current) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  }, []);

  // Navigation handlers
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleJumpToQuestion = (targetIndex) => {
    if (targetIndex >= 0 && targetIndex < questions.length) {
      setCurrentIndex(targetIndex);
    }
  };

  // Open submit confirmation modal
  const handleOpenSubmit = () => {
    setShowSubmitModal(true);
  };

  // Confirm manual submission
  const handleConfirmSubmit = () => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    setIsSubmitting(true);
    setShowSubmitModal(false);

    const finalElapsed = timerResult.stopTimer();
    onSubmitQuiz({
      answers: userAnswers,
      timeSpentSeconds: finalElapsed,
      submissionType: 'manual',
    });
  };

  return (
    <div className="quiz-screen-container">
      {/* Top Bar with Category, Timer, and Fast Submit */}
      <div className="quiz-topbar">
        <div className="topbar-left">
          <button
            type="button"
            className="topbar-exit-btn"
            onClick={onExitQuiz}
            title="Exit quiz and return to categories"
            aria-label="Exit quiz"
          >
            <ArrowLeft size={16} />
            <span>Exit</span>
          </button>
          <span className="topbar-category-title">{categoryName}</span>
        </div>

        <div className="topbar-center">
          <CountdownTimer
            timeLeft={timerResult.timeLeft}
            totalTime={totalDurationSeconds}
            isWarning={timerResult.isWarning}
          />
        </div>

        <div className="topbar-right">
          <button
            type="button"
            className="btn btn-primary topbar-submit-btn"
            onClick={handleOpenSubmit}
            aria-label="Submit quiz now"
          >
            <Send size={16} />
            <span>Submit Quiz</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        categoryName={categoryName}
      />

      {/* Main Quiz Area Layout */}
      <div className="quiz-main-layout">
        {/* Left Column: Active Question & Bottom Navigation Controls */}
        <main className="quiz-question-column">
          {currentQuestion ? (
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              selectedAnswer={userAnswers[currentQuestion.id]}
              onSelectAnswer={handleSelectAnswer}
            />
          ) : (
            <div className="empty-quiz-state">
              <AlertTriangle size={36} className="text-amber" />
              <h3>No question found</h3>
              <p>Please check category questions.</p>
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="quiz-bottom-actions">
            <button
              type="button"
              className="btn btn-secondary btn-nav"
              onClick={handlePrev}
              disabled={isFirstQuestion}
              aria-label="Previous question"
            >
              <ArrowLeft size={18} />
              <span>Previous</span>
            </button>

            <div className="bottom-mid-info">
              <span>
                {answeredCount} of {questions.length} Answered
              </span>
            </div>

            {isLastQuestion ? (
              <button
                type="button"
                className="btn btn-primary btn-nav btn-submit-accent"
                onClick={handleOpenSubmit}
                aria-label="Finish and submit quiz"
              >
                <span>Submit Quiz</span>
                <Send size={18} />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-nav"
                onClick={handleNext}
                aria-label="Next question"
              >
                <span>Next Question</span>
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </main>

        {/* Right Column: Question Navigator Palette */}
        <aside className="quiz-sidebar-column">
          <QuestionNavigator
            questions={questions}
            currentIndex={currentIndex}
            userAnswers={userAnswers}
            onSelectQuestion={handleJumpToQuestion}
          />
        </aside>
      </div>

      {/* Submission Confirmation Modal */}
      <SubmissionModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleConfirmSubmit}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        timeLeft={timerResult.timeLeft}
      />
    </div>
  );
}
