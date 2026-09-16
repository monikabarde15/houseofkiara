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

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    setLoading(true);
    
    try {
      const { submissionService } = await import('../services/submissionService');
      const { toast } = await import('react-hot-toast');
      await submissionService.withdrawSubmission(submission.subid, reason);
      toast.success('Submission withdrawn');
      onSuccess();
    } catch (err: any) {
      import('react-hot-toast').then(({ toast }) => toast.error(err.message || 'Failed to withdraw'));
    } finally {
      setLoading(false);
    }
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