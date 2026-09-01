// src/components/LYP/record/AwaitingBanner.tsx

import React from 'react';
import { Submission } from '../types/submission.types';
import { formatDate, getFirstName } from '../utils/formatter';
import { getAwaitingDays } from '../utils/derived';
import { generateWhatsAppLink, getDefaultWhatsAppMessage } from '../utils/generators';
import './styles/AwaitingBanner.css';

interface AwaitingBannerProps {
  submission: Submission;
  onUpdate: () => void;
}

export const AwaitingBanner: React.FC<AwaitingBannerProps> = ({ submission, onUpdate }) => {
  const days = getAwaitingDays(submission);
  const hasNudge = submission.moreInfo?.lastNudge !== null && submission.moreInfo?.lastNudge !== undefined;

  const handleReplyReceived = () => {
    // In production, this would call the API
    onUpdate();
  };

  const handleNudge = () => {
    const firstName = getFirstName(submission.listerID);
    const message = `Hi ${firstName}! A gentle nudge on ${submission.piece} - the moment the details land, your review is straight back in motion.`;
    const link = generateWhatsAppLink('', message);
    if (link) {
      window.open(link, '_blank');
    }
    onUpdate();
  };

  const handleCloseExpired = () => {
    // In production, this would call the API
    onUpdate();
  };

  return (
    <div className="awaiting-banner">
      <div className="awaiting-banner-text">
        <strong>Awaiting lister reply - {days}d</strong> - requested {formatDate(submission.moreInfo?.on || '')}
        {hasNudge && ` - nudged ${formatDate(submission.moreInfo?.lastNudge || '')}`}
      </div>
      <div className="awaiting-banner-actions">
        <button className="btn btn-gold btn-sm" onClick={handleReplyReceived}>
          Reply received
        </button>
        <button className="btn btn-wa btn-sm" onClick={handleNudge}>
          <svg viewBox="0 0 24 24" width="10" height="10">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
          Nudge on WhatsApp
        </button>
        <button className="btn btn-sec btn-sm" onClick={handleCloseExpired}>
          Close as Expired
        </button>
      </div>
    </div>
  );
};