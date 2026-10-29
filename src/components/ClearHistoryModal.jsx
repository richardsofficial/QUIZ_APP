import React, { useEffect } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export default function ClearHistoryModal({ isOpen, onClose, onConfirm }) {
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

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="clear-title">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-icon-circle danger-circle">
            <Trash2 size={24} className="danger-icon" />
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <h3 id="clear-title" className="modal-title">
          Clear All Quiz History?
        </h3>

        <p className="modal-subtitle">
          This action will permanently delete all completed attempts, category best scores, and personal statistics stored in your browser. This action cannot be undone.
        </p>

        <div className="modal-alert-box danger-box">
          <AlertTriangle size={18} className="alert-box-icon" />
          <div className="alert-box-text">
            All stored history in browser Local Storage will be completely erased.
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary modal-btn"
            onClick={onClose}
          >
            Keep History
          </button>
          <button
            type="button"
            className="btn btn-danger modal-btn"
            onClick={onConfirm}
          >
            Yes, Clear Everything
          </button>
        </div>
      </div>
    </div>
  );
}
