import React from 'react';
import { Check } from 'lucide-react';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
}) {
  if (!question) return null;

  const difficultyColors = {
    easy: { text: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
    medium: { text: '#b45309', bg: '#fffbeb', border: '#fde68a' },
    hard: { text: '#b91c1c', bg: '#fef2f2', border: '#fecaca' },
  };

  const diffStyle = difficultyColors[question.difficulty?.toLowerCase()] || difficultyColors.medium;

  return (
    <article className="question-card" aria-labelledby={`question-heading-${question.id}`}>
      {/* Question Header */}
      <div className="question-card-header">
        <span className="question-badge">
          Question #{questionNumber}
        </span>
        <span
          className="difficulty-pill"
          style={{
            color: diffStyle.text,
            backgroundColor: diffStyle.bg,
            borderColor: diffStyle.border,
          }}
        >
          {question.difficulty ? question.difficulty.toUpperCase() : 'MIXED'}
        </span>
      </div>

      {/* Question Text */}
      <h2 id={`question-heading-${question.id}`} className="question-text">
        {question.question}
      </h2>

      {/* Answer Options */}
      <div
        className="options-grid"
        role="radiogroup"
        aria-label={`Options for question ${questionNumber}`}
      >
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const letter = OPTION_LETTERS[idx] || String(idx + 1);
          const optionId = `opt-${question.id}-${idx}`;

          return (
            <button
              key={optionId}
              type="button"
              id={optionId}
              role="radio"
              aria-checked={isSelected}
              className={`option-button ${isSelected ? 'option-selected' : ''}`}
              onClick={() => onSelectAnswer(question.id, option)}
            >
              <span className="option-letter">{letter}</span>
              <span className="option-label">{option}</span>
              <span className="option-selection-indicator" aria-hidden="true">
                {isSelected ? <Check size={16} /> : null}
              </span>
            </button>
          );
        })}
      </div>
    </article>
  );
}
