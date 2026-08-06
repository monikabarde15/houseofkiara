// src/components/LYP/record/ActionsRow.tsx

import React from 'react';
import { Submission } from '../types/submission.types';
import { getLiveClockHours, getSubmissionStatus } from '../utils/derived';
import { generateWhatsAppLink, getDefaultWhatsAppMessage } from '../utils/generators';
import { getFirstName } from '../utils/formatter';
import { SUB_SLA_HOURS } from '../utils/constants';
import './styles/ActionsRow.css';

interface ActionsRowProps {
  submission: Submission;
  onApprove: () => void;
  onMoreInfo: () => void;
  onReject: () => void;
  onWithdraw: () => void;
  onExpire: () => void;
}

export const ActionsRow: React.FC<ActionsRowProps> = ({
  submission,
  onApprove,
  onMoreInfo,
  onReject,
  onWithdraw,
  onExpire,
}) => {
  const status = getSubmissionStatus(submission);
  const isAwaitingReply = status === 'Awaiting Reply';
  const isUndecided = !submission.decision;
  const liveHours = getLiveClockHours(submission);
  const isPast48 = liveHours > SUB_SLA_HOURS;
  const hasOpenAsk = !!submission.moreInfo;
  const canExpire = isUndecided && !hasOpenAsk;

  const waLink = generateWhatsAppLink('', getDefaultWhatsAppMessage(getFirstName(submission.listerID)));

  const handleApprove = () => {
    // Show confirm modal first
    onApprove();
  };

  const handleExpire = () => {
    // Show confirm modal first
    onExpire();
  };

  return (
    <div className="actions-row">
      <button className="btn btn-gold btn-sm" onClick={handleApprove}>
        Approve & Create Draft
      </button>
      <button className="btn btn-sec btn-sm" onClick={onMoreInfo}>
        Request More Info
      </button>
      <button className="btn btn-danger btn-sm" onClick={onReject}>
        Reject...
      </button>
      <button className="btn btn-wa btn-sm" disabled={!waLink}>
        <svg viewBox="0 0 24 24" width="10" height="10">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="white" strokeWidth="2" fill="none"/>
        </svg>
        WhatsApp
      </button>

      <div className="actions-row-spacer" />

      <button className="actions-withdraw" onClick={onWithdraw}>
        mark withdrawn
      </button>

      {canExpire && (
        <button className="actions-expire" onClick={handleExpire}>
          close as Expired
        </button>
      )}
    </div>
  );
};