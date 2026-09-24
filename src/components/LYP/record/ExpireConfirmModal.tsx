// src/components/LYP/record/ExpireConfirmModal.tsx

import React from 'react';
import './styles/ExpireConfirmModal.css';

interface ExpireConfirmModalProps {
  subid: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ExpireConfirmModal: React.FC<ExpireConfirmModalProps> = ({
  subid,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <div className="expire-overlay" onClick={onCancel}>
      <div className="expire-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="expire-modal-header">
          <h3 className="expire-modal-title">Please Confirm</h3>
          <button className="expire-modal-close" onClick={onCancel} aria-label="Close">
            ×
          </button>
        </div>

        {/* Divider */}
        <div className="expire-modal-divider" />

        {/* Body */}
        <div className="expire-modal-body">
          <p>
            Close <strong>{subid}</strong> as Expired — no response? If this carried an application,
            the application closes with it. The door stays open for a fresh submission any time.
          </p>
        </div>

        {/* Divider */}
        <div className="expire-modal-divider" />

        {/* Footer */}
        <div className="expire-modal-footer">
          <button
            className="expire-btn-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="expire-btn-confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Closing…' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
