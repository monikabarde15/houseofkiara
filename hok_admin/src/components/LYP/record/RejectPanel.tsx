// src/components/LYP/record/RejectPanel.tsx

import React, { useState } from 'react';
import { Submission } from '../types/submission.types';
import { REJECT_REASON_CODES } from '../utils/constants';
import { getFirstName } from '../utils/formatter';
import './styles/RejectPanel.css';

interface RejectPanelProps {
  submission: Submission;
  onSuccess: () => void;
  onCancel: () => void;
}

export const RejectPanel: React.FC<RejectPanelProps> = ({
  submission,
  onSuccess,
  onCancel,
}) => {
  const [reasonCode, setReasonCode] = useState<string>('');
  const [optionalNote, setOptionalNote] = useState('');
  const [loading, setLoading] = useState(false);

  const firstName = getFirstName(submission.listerID);

  const getPreviewMessage = () => {
    const code = reasonCode || '[reason code]';
    const note = optionalNote ? ` — ${optionalNote}` : '';
    return `Hi ${firstName}, thank you for offering ${submission.piece} to House of Kaira. We took a careful look — ${code}${note}. We'd truly love to see the next one.`;
  };

  const handleConfirm = () => {
    if (!reasonCode) return;
    setLoading(true);
    
    // In production, this would call the API
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 500);
  };

  return (
    <div className="reject-panel">
      <div className="reject-grid g2">
        <div className="fld">
          <label className="fld-label">Reason code - drives the note & reports</label>
          <select
            className="fld-input"
            value={reasonCode}
            onChange={(e) => setReasonCode(e.target.value)}
          >
            <option value="">Pick a reason...</option>
            {REJECT_REASON_CODES.map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>

        <div className="fld">
          <label className="fld-label">Add a line (optional)</label>
          <input
            type="text"
            className="fld-input"
            value={optionalNote}
            onChange={(e) => setOptionalNote(e.target.value)}
            placeholder="Kept warm and specific - the lister reads this"
          />
        </div>
      </div>

      <div className="reject-preview">
        <span className="reject-preview-label">WhatsApp will open with:</span>
        <span className="reject-preview-text">“{getPreviewMessage()}”</span>
      </div>

      <div className="reject-actions">
        <button 
          className="btn btn-danger btn-sm" 
          onClick={handleConfirm}
          disabled={!reasonCode || loading}
        >
          {loading ? 'Processing...' : 'Confirm Reject'}
        </button>
        <button 
          className="btn btn-sec btn-sm" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};