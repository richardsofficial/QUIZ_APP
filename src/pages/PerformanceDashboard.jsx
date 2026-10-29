import React, { useState } from 'react';
import {
  Trophy,
  Target,
  Clock,
  RotateCcw,
  Trash2,
  Play,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Zap,
  BarChart3,
  Award,
} from 'lucide-react';
import CategoryIcon from '../components/CategoryIcon';
import PerformanceChart from '../components/PerformanceChart';
import ClearHistoryModal from '../components/ClearHistoryModal';
import { CATEGORIES } from '../data/categories';
import { formatTime } from '../utils/scoring';

export default function PerformanceDashboard({
  stats,
  history,
  onClearHistory,
  onStartCategory,
  onBack,
}) {
  const [showClearModal, setShowClearModal] = useState(false);

  const totalAttempts = stats?.totalAttempts || 0;
  const overallBestPercentage = stats?.overallBestPercentage || 0;
  const categoryBests = stats?.categoryBests || {};

  // Calculate average percentage across all history
  const averagePercentage =
    history.length > 0
      ? Math.round((history.reduce((sum, item) => sum + (item.percentage || 0), 0) / history.length) * 10) / 10
      : 0;

  const handleConfirmClear = () => {
    onClearHistory();
    setShowClearModal(false);
  };

  return (
    <div className="dashboard-page-container">
      {/* Top Header */}
      <div className="page-header-row">
        <button
          className="btn-back"
          onClick={onBack}
          aria-label="Back to home"
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </button>

        {totalAttempts > 0 && (
          <button
            type="button"
            className="btn btn-danger-outline"
            onClick={() => setShowClearModal(true)}
            aria-label="Clear all quiz history"
          >
            <Trash2 size={16} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      <div className="dashboard-intro">
        <h1 className="page-main-title">Performance Dashboard</h1>
        <p className="page-main-desc">
          Track your progress, historical quiz records, and personal best scores across all categories.
        </p>
      </div>

      {totalAttempts === 0 ? (
        /* Empty State */
        <div className="dashboard-empty-card">
          <div className="empty-icon-wrap">
            <Trophy size={48} className="empty-trophy-icon" />
          </div>
          <h2 className="empty-title">No Quizzes Completed Yet</h2>
          <p className="empty-desc">
            Your quiz attempts, category best scores, and accuracy trends will appear right here once you complete your first challenge.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-large"
            onClick={() => onStartCategory()}
          >
            <Play size={18} />
            <span>Take Your First Quiz</span>
          </button>
        </div>
      ) : (
        /* Full Dashboard View */
        <>
          {/* Key Stat Cards */}
          <div className="dashboard-stats-grid">
            <div className="dash-stat-card card-trophy">
              <div className="stat-card-icon">
                <Trophy size={24} />
              </div>
              <div className="stat-card-content">
                <span className="stat-card-label">Overall Best Score</span>
                <span className="stat-card-val">{overallBestPercentage}%</span>
                <span className="stat-card-sub">Highest percentage achieved</span>
              </div>
            </div>

            <div className="dash-stat-card card-target">
              <div className="stat-card-icon">
                <Target size={24} />
              </div>
              <div className="stat-card-content">
                <span className="stat-card-label">Quizzes Completed</span>
                <span className="stat-card-val">{totalAttempts}</span>
                <span className="stat-card-sub">Total finished attempts</span>
              </div>
            </div>

            <div className="dash-stat-card card-chart">
              <div className="stat-card-icon">
                <BarChart3 size={24} />
              </div>
              <div className="stat-card-content">
                <span className="stat-card-label">Average Accuracy</span>
                <span className="stat-card-val">{averagePercentage}%</span>
                <span className="stat-card-sub">Across all attempts</span>
              </div>
            </div>

            <div className="dash-stat-card card-award">
              <div className="stat-card-icon">
                <Award size={24} />
              </div>
              <div className="stat-card-content">
                <span className="stat-card-label">Categories Mastered</span>
                <span className="stat-card-val">
                  {Object.keys(categoryBests).length} / {CATEGORIES.length}
                </span>
                <span className="stat-card-sub">Categories attempted</span>
              </div>
            </div>
          </div>

          {/* Performance Chart of recent attempts */}
          <PerformanceChart history={history} />

          {/* Category Best Scores Grid */}
          <section className="dash-section">
            <h2 className="dash-section-title">Best Scores by Category</h2>
            <div className="category-bests-grid">
              {CATEGORIES.map((cat) => {
                const best = categoryBests[cat.id];
                return (
                  <div key={cat.id} className="category-best-card">
                    <div className="cat-best-top">
                      <div
                        className="cat-best-icon"
                        style={{
                          backgroundColor: cat.badgeBg || '#eef2ff',
                          color: cat.accentColor || '#6366f1',
                        }}
                      >
                        <CategoryIcon name={cat.iconName} size={20} />
                      </div>
                      <span className="cat-best-name">{cat.name}</span>
                    </div>

                    <div className="cat-best-middle">
                      {best ? (
                        <>
                          <div className="cat-best-score-row">
                            <span className="cat-best-pct">{best.percentage}%</span>
                            <span className="cat-best-fraction">
                              ({best.score} / {best.totalQuestions})
                            </span>
                          </div>
                          <span className="cat-best-date">
                            Achieved {best.formattedDate || 'recently'}
                          </span>
                        </>
                      ) : (
                        <div className="cat-not-taken">
                          <span>Not attempted yet</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      className="cat-best-action-btn"
                      onClick={() => onStartCategory(cat)}
                    >
                      <span>{best ? 'Retake Quiz' : 'Start Quiz'}</span>
                      <Play size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recent Quiz Attempts Table */}
          <section className="dash-section">
            <h2 className="dash-section-title">Recent Quiz Attempts</h2>
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Date & Time</th>
                    <th>Difficulty</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Accuracy</th>
                    <th>Time Spent</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id}>
                      <td className="table-cat-cell">
                        <strong>{item.categoryName}</strong>
                      </td>
                      <td className="table-date-cell">
                        <span className="date-text">{item.formattedDate || item.date}</span>
                      </td>
                      <td className="table-diff-cell">
                        <span className="diff-pill-small text-capitalize">
                          {item.difficulty || 'Mixed'}
                        </span>
                      </td>
                      <td className="table-score-cell">
                        {item.score} / {item.totalQuestions}
                      </td>
                      <td className="table-pct-cell">
                        <span
                          className={`pct-badge ${
                            item.percentage >= 75
                              ? 'pct-high'
                              : item.percentage >= 50
                              ? 'pct-mid'
                              : 'pct-low'
                          }`}
                        >
                          {item.percentage}%
                        </span>
                      </td>
                      <td className="table-accuracy-cell">{item.accuracy}%</td>
                      <td className="table-time-cell">
                        {formatTime(item.timeSpentSeconds)}
                      </td>
                      <td className="table-status-cell">
                        {item.submissionType === 'timeout' ? (
                          <span className="status-tag tag-timeout" title="Time expired">
                            <Clock size={12} />
                            <span>Timeout</span>
                          </span>
                        ) : (
                          <span className="status-tag tag-manual" title="Submitted on time">
                            <CheckCircle2 size={12} />
                            <span>Completed</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* Clear Confirmation Modal */}
      <ClearHistoryModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleConfirmClear}
      />
    </div>
  );
}
