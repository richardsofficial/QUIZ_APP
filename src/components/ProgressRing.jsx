import React from 'react';

export default function ProgressRing({
  percentage = 0,
  score = 0,
  maxScore = 0,
  size = 180,
  strokeWidth = 14,
  tierColor = '#6366f1',
  tierBadge = '',
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Calculate dash offset: percentage is 0..100
  const normalizedPercent = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (normalizedPercent / 100) * circumference;

  return (
    <div className="progress-ring-container" style={{ width: size, height: size }}>
      <svg
        className="progress-ring-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background track */}
        <circle
          className="progress-ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated fill circle */}
        <circle
          className="progress-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={tierColor}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      <div className="progress-ring-inner">
        <span className="ring-percentage">{percentage}%</span>
        <span className="ring-fraction">
          {score} / {maxScore} Correct
        </span>
        {tierBadge && (
          <span className="ring-tier-badge" style={{ color: tierColor, borderColor: tierColor }}>
            {tierBadge}
          </span>
        )}
      </div>
    </div>
  );
}
