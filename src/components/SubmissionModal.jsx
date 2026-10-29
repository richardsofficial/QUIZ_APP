import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Clock, X } from 'lucide-react';
import { formatTime } from '../utils/scoring';

export default function SubmissionModal({
  isOpen,
  onClose,
  onConfirm,
  totalQuestions,
  answeredCount,
  timeLeft,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unansweredCount = Math.max(0, totalQuestions - answeredCount);
  const hasUnanswered = unansweredCount > 0;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-icon-circle">
            <CheckCircle2 size={24} className="modal-icon-brand" />
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <h3 id="modal-title" className="modal-title">
          Ready to Submit Your Quiz?
        </h3>

        <p className="modal-subtitle">
          Please review your progress before finalizing. Once submitted, your answers cannot be modified.
        </p>

        {/* Summary Tally Cards */}
        <div className="modal-tally-grid">
          <div className="modal-tally-item">
            <span className="tally-number text-brand">{answeredCount}</span>
            <span className="tally-label">Answered</span>
          </div>
          <div className={`modal-tally-item ${hasUnanswered ? 'tally-warning' : ''}`}>
            <span className="tally-number text-amber">{unansweredCount}</span>
            <span className="tally-label">Unanswered</span>
          </div>
          <div className="modal-tally-item">
            <span className="tally-number text-neutral">{formatTime(timeLeft)}</span>
            <span className="tally-label">Time Left</span>
          </div>
        </div>

        {hasUnanswered && (
          <div className="modal-alert-box">
            <AlertCircle size={18} className="alert-box-icon" />
            <div className="alert-box-text">
              <strong>Notice:</strong> You still have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}. Unanswered questions receive 0 points.
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary modal-btn"
            onClick={onClose}
          >
            Continue Quiz
          </button>
          <button
            type="button"
            className="btn btn-primary modal-btn"
            onClick={onConfirm}
          >
            Submit Now
          </button>
        </div>
      </div>
    </div>
  );
}
