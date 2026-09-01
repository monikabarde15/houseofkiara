// src/components/LYP/record/VerdictBlock.tsx

import React from 'react';
import { Submission } from '../types/submission.types';
import { formatDate } from '../utils/formatter';
import './styles/VerdictBlock.css';

interface VerdictBlockProps {
  submission: Submission;
}

export const VerdictBlock: React.FC<VerdictBlockProps> = ({ submission }) => {
  const { decision } = submission;
  if (!decision) return null;

  const renderApproved = () => {
    const sku = submission.assessment?.sku || (submission as any).sku || '—';
    const productStatus = 'Draft - pricing pending'; // Would check product status

    return (
      <div className="verdict-strip verdict-sage">
        <div className="verdict-left">
          <span className="verdict-label">Approved</span>
          <span className="verdict-details">
            {formatDate(decision.on)} by {decision.by}
          </span>
          <span className="verdict-sku">
            created <span className="subid">{sku}</span>
          </span>
          <span className="verdict-status">currently {productStatus}</span>
        </div>
        <button className="btn btn-sec btn-xs">Open Product →</button>
      </div>
    );
  };

  const renderRejected = () => {
    return (
      <div className="verdict-strip verdict-terra">
        <span className="verdict-label">Rejected</span>
        <span className="verdict-details">
          {formatDate(decision.on)} by {decision.by}
          {decision.reasonCode && ` — ${decision.reasonCode}`}
          {decision.reason && <span className="verdict-reason-note"> — {decision.reason}</span>}
          <span className="verdict-notification"> · Lister notified on WhatsApp.</span>
        </span>
      </div>
    );
  };

  const renderWithdrawn = () => {
    return (
      <div className="verdict-strip verdict-muted">
        <span className="verdict-label">Withdrawn by the lister</span>
        <span className="verdict-details">
          {formatDate(decision.on)}
          {decision.reason && <span className="verdict-reason-note"> — {decision.reason}</span>}
        </span>
      </div>
    );
  };

  const renderExpired = () => {
    return (
      <div className="verdict-strip verdict-muted">
        <span className="verdict-label">Expired</span>
        <span className="verdict-details">
          no response {formatDate(decision.on)}
          {decision.reason && <span className="verdict-reason-note"> — {decision.reason}</span>}
          <span className="verdict-door-open"> · The door stays open for a fresh submission</span>
        </span>
      </div>
    );
  };

  const renderVerdict = () => {
    switch (decision.what) {
      case 'Approved':
        return renderApproved();
      case 'Rejected':
        return renderRejected();
      case 'Withdrawn':
        return renderWithdrawn();
      case 'Expired':
        return renderExpired();
      default:
        return null;
    }
  };

  return <div className="verdict-block">{renderVerdict()}</div>;
};