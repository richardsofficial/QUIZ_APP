import React from 'react';
import { Layers } from 'lucide-react';

export default function QuestionNavigator({
  questions = [],
  currentIndex,
  userAnswers = {},
  onSelectQuestion,
}) {
  return (
    <aside className="question-nav-panel" aria-label="Question Navigation Panel">
      <div className="nav-panel-header">
        <div className="nav-panel-title">
          <Layers size={18} className="panel-icon" />
          <span>Question Navigator</span>
        </div>
      </div>

      {/* Grid of question buttons */}
      <div className="nav-buttons-grid" role="navigation" aria-label="Questions list">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== null && userAnswers[q.id] !== '';

          let statusClass = 'status-unanswered';
          if (isAnswered) statusClass = 'status-answered';
          if (isCurrent) statusClass += ' status-current';

          return (
            <button
              key={q.id}
              type="button"
              className={`nav-num-btn ${statusClass}`}
              onClick={() => onSelectQuestion(idx)}
              aria-label={`Go to Question ${idx + 1}, ${isAnswered ? 'Answered' : 'Unanswered'}${isCurrent ? ', Current Question' : ''}`}
              aria-current={isCurrent ? 'true' : undefined}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="nav-legend">
        <div className="legend-item">
          <span className="legend-dot dot-current" />
          <span className="legend-text">Current</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-answered" />
          <span className="legend-text">Answered</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-unanswered" />
          <span className="legend-text">Unanswered</span>
        </div>
      </div>
    </aside>
  );
}
