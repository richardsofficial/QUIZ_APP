import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { formatTime } from '../utils/scoring';

export default function CountdownTimer({ timeLeft, totalTime, isWarning }) {
  const formatted = formatTime(timeLeft);
  const percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;

  return (
    <div
      className={`countdown-timer-box ${isWarning ? 'timer-warning' : ''}`}
      role="timer"
      aria-live="polite"
      aria-label={`Time remaining: ${formatted}`}
    >
      <div className="timer-icon-wrapper">
        {isWarning ? (
          <AlertTriangle size={18} className="timer-warning-icon" />
        ) : (
          <Clock size={18} className="timer-normal-icon" />
        )}
      </div>

      <div className="timer-content">
        <span className="timer-label">Time Remaining</span>
        <span className="timer-digits">{formatted}</span>
      </div>

      {isWarning && <span className="warning-badge">Low Time!</span>}
    </div>
  );
}
