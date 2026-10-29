import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  Check,
  X,
  Filter,
} from 'lucide-react';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function AnswerReview({ questionBreakdown = [] }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'correct' | 'incorrect' | 'unanswered'

  const counts = {
    all: questionBreakdown.length,
    correct: questionBreakdown.filter((q) => q.status === 'correct').length,
    incorrect: questionBreakdown.filter((q) => q.status === 'incorrect').length,
    unanswered: questionBreakdown.filter((q) => q.status === 'unanswered').length,
  };

  const filteredQuestions = questionBreakdown.filter((q) => {
    if (filter === 'all') return true;
    return q.status === filter;
  });

  return (
    <section className="answer-review-section" aria-label="Detailed Answer Review">
      <div className="review-section-header">
        <div>
          <h2 className="review-title">Detailed Answer Review</h2>
          <p className="review-subtitle">
            Review each question, check the correct answers, and understand the core concept through verified explanations.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="review-filter-tabs" role="tablist" aria-label="Filter questions">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({counts.all})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'correct'}
            className={`filter-tab filter-tab-correct ${filter === 'correct' ? 'active' : ''}`}
            onClick={() => setFilter('correct')}
          >
            Correct ({counts.correct})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'incorrect'}
            className={`filter-tab filter-tab-incorrect ${filter === 'incorrect' ? 'active' : ''}`}
            onClick={() => setFilter('incorrect')}
          >
            Incorrect ({counts.incorrect})
          </button>
          {counts.unanswered > 0 && (
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'unanswered'}
              className={`filter-tab filter-tab-unanswered ${filter === 'unanswered' ? 'active' : ''}`}
              onClick={() => setFilter('unanswered')}
            >
              Unanswered ({counts.unanswered})
            </button>
          )}
        </div>
      </div>

      {/* List of Review Cards */}
      <div className="review-cards-list">
        {filteredQuestions.length === 0 ? (
          <div className="review-empty-filter">
            <Filter size={32} className="empty-filter-icon" />
            <p>No questions match the "{filter}" filter.</p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const isCorrect = q.status === 'correct';
            const isIncorrect = q.status === 'incorrect';
            const isUnanswered = q.status === 'unanswered';

            return (
              <div
                key={q.id}
                className={`review-card status-border-${q.status}`}
              >
                {/* Header with question number and status badge */}
                <div className="review-card-header">
                  <span className="review-q-num">
                    Question {q.displayIndex || idx + 1}
                  </span>

                  <div className="review-status-badge-wrap">
                    {isCorrect && (
                      <span className="review-badge badge-correct">
                        <CheckCircle2 size={16} />
                        <span>Correct</span>
                      </span>
                    )}
                    {isIncorrect && (
                      <span className="review-badge badge-incorrect">
                        <XCircle size={16} />
                        <span>Incorrect</span>
                      </span>
                    )}
                    {isUnanswered && (
                      <span className="review-badge badge-unanswered">
                        <HelpCircle size={16} />
                        <span>Unanswered</span>
                      </span>
                    )}
                    <span className="review-diff-tag">{q.difficulty?.toUpperCase()}</span>
                  </div>
                </div>

                {/* Question text */}
                <h3 className="review-q-text">{q.question}</h3>

                {/* All Options list */}
                <div className="review-options-list">
                  {q.options.map((option, optIdx) => {
                    const isUserChoice = q.selectedAnswer === option;
                    const isTargetCorrect = q.correctAnswer === option;
                    const letter = OPTION_LETTERS[optIdx] || String(optIdx + 1);

                    let optionClass = 'review-option-default';
                    let optionBadge = null;

                    if (isTargetCorrect) {
                      optionClass = 'review-option-correct';
                      optionBadge = (
                        <span className="opt-tag tag-correct">
                          <Check size={14} />
                          <span>Correct Answer</span>
                        </span>
                      );
                    } else if (isUserChoice && !isTargetCorrect) {
                      optionClass = 'review-option-wrong';
                      optionBadge = (
                        <span className="opt-tag tag-wrong">
                          <X size={14} />
                          <span>Your Selection</span>
                        </span>
                      );
                    }

                    return (
                      <div key={optIdx} className={`review-option-item ${optionClass}`}>
                        <div className="review-option-left">
                          <span className="review-opt-letter">{letter}</span>
                          <span className="review-opt-text">{option}</span>
                        </div>
                        {optionBadge}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                {q.explanation && (
                  <div className="review-explanation-box">
                    <div className="explanation-title">
                      <Lightbulb size={18} className="explanation-icon" />
                      <span>Explanation:</span>
                    </div>
                    <p className="explanation-text">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
