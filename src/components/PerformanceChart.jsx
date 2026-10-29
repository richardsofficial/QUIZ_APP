import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function PerformanceChart({ history = [] }) {
  if (!history || history.length === 0) return null;

  // Take the most recent 10 attempts in chronological order (left to right)
  const recentAttempts = [...history].slice(0, 10).reverse();

  return (
    <div className="performance-chart-card">
      <div className="chart-header">
        <div className="chart-title-wrap">
          <TrendingUp size={20} className="chart-icon" />
          <h3 className="chart-title">Recent Quiz Performance Trend</h3>
        </div>
        <span className="chart-subtitle">Last {recentAttempts.length} completed attempts</span>
      </div>

      <div className="chart-body">
        <div className="chart-bars-container">
          {recentAttempts.map((attempt, index) => {
            const pct = Math.min(100, Math.max(0, attempt.percentage || 0));
            let barColor = '#ef4444'; // Red
            if (pct >= 90) barColor = '#10b981'; // Green
            else if (pct >= 75) barColor = '#3b82f6'; // Blue
            else if (pct >= 50) barColor = '#f59e0b'; // Amber

            return (
              <div key={attempt.id || index} className="chart-bar-col">
                <div className="chart-bar-track">
                  <div
                    className="chart-bar-fill"
                    style={{
                      height: `${pct}%`,
                      backgroundColor: barColor,
                    }}
                    title={`${attempt.categoryName}: ${pct}% (${attempt.score}/${attempt.totalQuestions})`}
                  >
                    <span className="chart-bar-tooltip">
                      <strong>{pct}%</strong>
                      <small>{attempt.categoryName}</small>
                    </span>
                  </div>
                </div>
                <span className="chart-bar-label">
                  #{index + 1}
                </span>
                <span className="chart-bar-category" title={attempt.categoryName}>
                  {attempt.categoryName?.slice(0, 5)}..
                </span>
              </div>
            );
          })}
        </div>

        {/* Benchmark Reference Lines */}
        <div className="chart-guidelines">
          <div className="guideline guide-90">
            <span className="guide-label">90%</span>
          </div>
          <div className="guideline guide-50">
            <span className="guide-label">50%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
