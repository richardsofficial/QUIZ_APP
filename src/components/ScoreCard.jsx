import React from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Target,
  Clock,
  Send,
  Zap,
} from 'lucide-react';
import { formatTime } from '../utils/scoring';

export default function ScoreCard({ results }) {
  if (!results) return null;

  const {
    totalQuestions,
    attempted,
    unanswered,
    correct,
    incorrect,
    accuracy,
    timeSpentSeconds,
    submissionType,
  } = results;

  const cards = [
    {
      id: 'correct',
      label: 'Correct Answers',
      value: correct,
      sub: `${Math.round((correct / (totalQuestions || 1)) * 100)}% of total`,
      icon: CheckCircle2,
      colorClass: 'card-success',
    },
    {
      id: 'incorrect',
      label: 'Incorrect Answers',
      value: incorrect,
      sub: `${Math.round((incorrect / (totalQuestions || 1)) * 100)}% of total`,
      icon: XCircle,
      colorClass: 'card-danger',
    },
    {
      id: 'unanswered',
      label: 'Unanswered',
      value: unanswered,
      sub: unanswered > 0 ? 'Missed / Skipped' : 'None skipped',
      icon: HelpCircle,
      colorClass: 'card-warning',
    },
    {
      id: 'accuracy',
      label: 'Accuracy Rate',
      value: `${accuracy}%`,
      sub: 'Of attempted questions',
      icon: Target,
      colorClass: 'card-accent',
    },
    {
      id: 'time',
      label: 'Time Taken',
      value: formatTime(timeSpentSeconds),
      sub: 'Total elapsed time',
      icon: Clock,
      colorClass: 'card-info',
    },
    {
      id: 'submission',
      label: 'Submission Mode',
      value: submissionType === 'timeout' ? 'Auto-Submitted' : 'Manual Submit',
      sub: submissionType === 'timeout' ? 'Time expired' : 'Finished on time',
      icon: submissionType === 'timeout' ? Zap : Send,
      colorClass: submissionType === 'timeout' ? 'card-warning' : 'card-brand',
    },
  ];

  return (
    <div className="score-metrics-grid">
      {cards.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.id} className={`score-metric-card ${item.colorClass}`}>
            <div className="metric-icon-box">
              <Icon size={20} />
            </div>
            <div className="metric-info">
              <span className="metric-label">{item.label}</span>
              <span className="metric-value">{item.value}</span>
              <span className="metric-sub">{item.sub}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
