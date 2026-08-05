// src/components/LYP/record/WithdrawRow.tsx

import React, { useState } from 'react';
import { Submission } from '../types/submission.types';
import './styles/WithdrawRow.css';

interface WithdrawRowProps {
  submission: Submission;
  onSuccess: () => void;
  onCancel: () => void;
}

export const WithdrawRow: React.FC<WithdrawRowProps> = ({
  submission,
  onSuccess,
  onCancel,
}) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    if (!reason.trim()) return;
    setLoading(true);
    
    // In production, this would call the API
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 500);
  };

  return (
    <div className="withdraw-row">
      <input
        type="text"
        className="fld-input"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Why is it coming off the table? Goes on the record."
      />
      <button 
        className="btn btn-sec btn-sm" 
        onClick={handleConfirm}
        disabled={!reason.trim() || loading}
      >
        {loading ? 'Processing...' : 'Confirm Withdrawn'}
      </button>
      <button 
        className="btn btn-sec btn-sm" 
        onClick={onCancel}
        disabled={loading}
      >
        Cancel
      </button>
    </div>
  );
};