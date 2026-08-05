// src/components/LYP/record/ReviewHistory.tsx

import React from 'react';
import { HistoryEntry } from '../types/submission.types';
import { formatDateTime } from '../utils/formatter';
import './styles/ReviewHistory.css';

interface ReviewHistoryProps {
  history: HistoryEntry[];
}

export const ReviewHistory: React.FC<ReviewHistoryProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="review-history-card card">
        <div className="review-history-header">
          <span className="review-history-title">Review history</span>
        </div>
        <div className="card-bd">
          <div className="review-history-empty">No history recorded yet.</div>
        </div>
      </div>
    );
  }

  // History is already newest-first from the spec
  const sortedHistory = [...history];

  const getDotClass = (color: string) => {
    const mapping: Record<string, string> = {
      'gold': 'tl-dot-gold',
      'sage': 'tl-dot-sage',
      'terra': 'tl-dot-terra',
      'muted': 'tl-dot-muted',
    };
    return mapping[color] || 'tl-dot-muted';
  };

  return (
    <div className="review-history-card card">
      <div className="review-history-header">
        <span className="review-history-title">Review history</span>
      </div>
      <div className="card-bd">
        <div className="review-history-list">
          {sortedHistory.map((entry, index) => (
            <div key={index} className="tl-item">
              <div className={`tl-dot ${getDotClass(entry.c)}`} />
              <div className="tl-content">
                <div className="tl-event">{entry.e}</div>
                <div className="tl-time">{formatDateTime(entry.t)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};