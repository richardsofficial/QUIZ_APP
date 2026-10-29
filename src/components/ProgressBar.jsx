import React from 'react';

export default function ProgressBar({
  currentIndex,
  totalQuestions,
  answeredCount,
  categoryName,
}) {
  const currentStep = currentIndex + 1;
  const progressPercent = totalQuestions > 0 ? (currentStep / totalQuestions) * 100 : 0;
  const answeredPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div className="quiz-progress-wrapper" role="region" aria-label="Quiz progress">
      <div className="progress-meta">
        <div className="meta-left">
          <span className="question-counter">
            Question <strong>{currentStep}</strong> of <strong>{totalQuestions}</strong>
          </span>
          {categoryName && <span className="progress-category-tag">{categoryName}</span>}
        </div>
        <div className="meta-right">
          <span className="answered-tally">
            <strong>{answeredCount}</strong> / {totalQuestions} answered
          </span>
        </div>
      </div>

      <div className="progress-track" aria-valuenow={Math.round(progressPercent)} aria-valuemin="0" aria-valuemax="100">
        {/* Layer for current step position */}
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
