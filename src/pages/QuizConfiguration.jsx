import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  HelpCircle,
  Gauge,
  Play,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import CategoryIcon from '../components/CategoryIcon';
import { formatTime } from '../utils/scoring';

const QUESTION_COUNTS = [5, 10, 15];
const DIFFICULTIES = [
  { id: 'mixed', label: 'Mixed', desc: 'A balanced blend of all difficulty levels' },
  { id: 'easy', label: 'Easy', desc: 'Fundamental concepts and direct questions' },
  { id: 'medium', label: 'Medium', desc: 'Intermediate application and logic' },
  { id: 'hard', label: 'Hard', desc: 'Advanced and detailed niche knowledge' },
];
const TIME_LIMITS = [
  { seconds: 15, label: '15s / question', pace: 'Rapid Blitz' },
  { seconds: 30, label: '30s / question', pace: 'Standard Pace' },
  { seconds: 60, label: '60s / question', pace: 'Relaxed & Deep' },
];

export default function QuizConfiguration({
  category,
  onBack,
  onStartQuiz,
  initialConfig,
}) {
  const [questionCount, setQuestionCount] = useState(initialConfig?.questionCount || 10);
  const [difficulty, setDifficulty] = useState(initialConfig?.difficulty || 'mixed');
  const [timePerQuestion, setTimePerQuestion] = useState(initialConfig?.timePerQuestion || 30);

  const totalDurationSeconds = questionCount * timePerQuestion;

  const handleStart = () => {
    onStartQuiz({
      categoryId: category.id,
      categoryName: category.name,
      questionCount,
      difficulty,
      timePerQuestion,
      totalDurationSeconds,
    });
  };

  return (
    <div className="quiz-config-page">
      <div className="page-header-row">
        <button
          className="btn-back"
          onClick={onBack}
          aria-label="Back to categories"
        >
          <ArrowLeft size={18} />
          <span>Change Category</span>
        </button>
      </div>

      <div className="config-grid-layout">
        {/* Left Column: Configuration Controls */}
        <div className="config-controls-col">
          {/* Category Banner Card */}
          <div className="config-category-header">
            <div
              className="cat-icon-container"
              style={{
                backgroundColor: category.badgeBg || '#eef2ff',
                color: category.accentColor || '#6366f1',
              }}
            >
              <CategoryIcon name={category.iconName} size={30} />
            </div>
            <div>
              <span className="config-step-tag">Selected Category</span>
              <h1 className="config-cat-title">{category.name}</h1>
              <p className="config-cat-desc">{category.description}</p>
            </div>
          </div>

          {/* Setting 1: Number of Questions */}
          <section className="config-setting-card">
            <div className="setting-header">
              <HelpCircle size={20} className="setting-icon text-brand" />
              <div>
                <h3 className="setting-title">Number of Questions</h3>
                <p className="setting-desc">Choose how many questions you want to tackle</p>
              </div>
            </div>

            <div className="pill-selector-group">
              {QUESTION_COUNTS.map((count) => {
                const isSelected = questionCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    className={`pill-select-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => setQuestionCount(count)}
                  >
                    <span className="pill-number">{count}</span>
                    <span className="pill-text">Questions</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Setting 2: Difficulty Level */}
          <section className="config-setting-card">
            <div className="setting-header">
              <Gauge size={20} className="setting-icon text-brand" />
              <div>
                <h3 className="setting-title">Difficulty Level</h3>
                <p className="setting-desc">Filter questions by target difficulty</p>
              </div>
            </div>

            <div className="difficulty-selector-grid">
              {DIFFICULTIES.map((diff) => {
                const isSelected = difficulty === diff.id;
                return (
                  <button
                    key={diff.id}
                    type="button"
                    className={`difficulty-card-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => setDifficulty(diff.id)}
                  >
                    <div className="diff-card-top">
                      <span className="diff-card-label">{diff.label}</span>
                      {isSelected && <CheckCircle2 size={16} className="diff-check-icon" />}
                    </div>
                    <span className="diff-card-desc">{diff.desc}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Setting 3: Time Limit per Question */}
          <section className="config-setting-card">
            <div className="setting-header">
              <Clock size={20} className="setting-icon text-brand" />
              <div>
                <h3 className="setting-title">Time Limit per Question</h3>
                <p className="setting-desc">Pace your challenge and test your quick thinking</p>
              </div>
            </div>

            <div className="pill-selector-group">
              {TIME_LIMITS.map((tl) => {
                const isSelected = timePerQuestion === tl.seconds;
                return (
                  <button
                    key={tl.seconds}
                    type="button"
                    className={`pill-select-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => setTimePerQuestion(tl.seconds)}
                  >
                    <span className="pill-number">{tl.seconds}s</span>
                    <span className="pill-text">{tl.pace}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Quiz Summary & Launch Card */}
        <div className="config-summary-col">
          <div className="summary-sticky-card">
            <h3 className="summary-card-title">Quiz Summary</h3>
            <p className="summary-card-desc">Review your parameters before starting the timer</p>

            <div className="summary-specs-list">
              <div className="summary-spec-item">
                <span className="spec-label">Category</span>
                <span className="spec-value">{category.name}</span>
              </div>
              <div className="summary-spec-item">
                <span className="spec-label">Total Questions</span>
                <span className="spec-value">{questionCount} Qs</span>
              </div>
              <div className="summary-spec-item">
                <span className="spec-label">Difficulty</span>
                <span className="spec-value text-capitalize">{difficulty}</span>
              </div>
              <div className="summary-spec-item">
                <span className="spec-label">Time Per Question</span>
                <span className="spec-value">{timePerQuestion} seconds</span>
              </div>
              <div className="summary-spec-item highlight-spec">
                <span className="spec-label">Total Duration</span>
                <span className="spec-value total-time-value">{formatTime(totalDurationSeconds)}</span>
              </div>
            </div>

            <div className="summary-notice">
              <AlertCircle size={16} className="notice-icon" />
              <span>Questions and answer options will be completely randomized. The timer will start immediately upon clicking Start.</span>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-large btn-block"
              onClick={handleStart}
            >
              <Play size={20} />
              <span>Start Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
