import React from 'react';
import {
  RotateCcw,
  Grid,
  Home,
  BarChart3,
  Award,
  Sparkles,
} from 'lucide-react';
import ProgressRing from '../components/ProgressRing';
import ScoreCard from '../components/ScoreCard';
import AnswerReview from '../components/AnswerReview';

export default function ResultsPage({
  results,
  quizConfig,
  isNewBest,
  onRetryQuiz,
  onChooseCategory,
  onGoHome,
  onGoDashboard,
}) {
  if (!results) return null;

  const {
    score,
    maxScore,
    percentage,
    tier,
    tierBadge,
    tierMessage,
    tierColor,
    questionBreakdown,
  } = results;

  return (
    <div className="results-page-container">
      {/* Top Banner / Celebration */}
      <section className="results-hero-card">
        {isNewBest && (
          <div className="new-best-banner">
            <Sparkles size={18} className="new-best-icon" />
            <span>New Personal Best Score in {quizConfig?.categoryName}!</span>
          </div>
        )}

        <div className="results-hero-grid">
          {/* Left: Circular progress ring */}
          <div className="results-ring-col">
            <ProgressRing
              percentage={percentage}
              score={score}
              maxScore={maxScore}
              tierColor={tierColor}
              tierBadge={tierBadge}
              size={190}
              strokeWidth={14}
            />
          </div>

          {/* Right: Message & Actions */}
          <div className="results-info-col">
            <div className="results-tier-header">
              <span className="results-cat-name">{quizConfig?.categoryName} Quiz</span>
              <h1 className="results-tier-title" style={{ color: tierColor }}>
                {tier}!
              </h1>
              <p className="results-tier-message">{tierMessage}</p>
            </div>

            {/* Quick Action Buttons */}
            <div className="results-actions-group">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onRetryQuiz}
              >
                <RotateCcw size={18} />
                <span>Retry Quiz</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={onChooseCategory}
              >
                <Grid size={18} />
                <span>Choose Another Category</span>
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={onGoDashboard}
              >
                <BarChart3 size={18} />
                <span>View Dashboard</span>
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={onGoHome}
              >
                <Home size={18} />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Breakdown Grid */}
      <section className="results-metrics-section">
        <h2 className="section-title">Performance Breakdown</h2>
        <ScoreCard results={results} />
      </section>

      {/* Complete Answer Review Section */}
      <AnswerReview questionBreakdown={questionBreakdown} />
    </div>
  );
}
