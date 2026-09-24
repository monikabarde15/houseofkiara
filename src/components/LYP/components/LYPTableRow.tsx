// src/components/LYP/components/LYPTableRow.tsx

import React from 'react';
import { Submission } from '../types/submission.types';
import { 
  formatDate, 
  getFirstName, 
  truncateText,
  getInitials
} from '../utils/formatter';
import { 
  getSubmissionStatus, 
  getStatusClass, 
  getAgeChip, 
  getChannelClass,
  getIntentClass
} from '../utils/derived';
import './styles/LYPTableRow.css';

interface LYPTableRowProps {
  submission: Submission;
  onRowClick: (submission: Submission) => void;
}

export const LYPTableRow: React.FC<LYPTableRowProps> = ({
  submission,
  onRowClick,
}) => {
  const status = getSubmissionStatus(submission);
  const statusClass = getStatusClass(status);
  const ageChip = getAgeChip(submission);
  const channelClass = getChannelClass(submission.channel);
  const intentClass = getIntentClass(submission.intent);
  const isDecided = !!submission.decision;

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't trigger if click was on an inner door
    const target = e.target as HTMLElement;
    if (target.closest('.subid') || target.closest('.qlnk') || target.closest('.btn')) {
      return;
    }
    onRowClick(submission);
  };

  const handleSubIdClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRowClick(submission);
  };

  return (
    <tr className="clickable" onClick={handleRowClick}>
      <td className="lyp-td-submission">
        <span className="subid" onClick={handleSubIdClick}>
          {submission.subid}
        </span>
        <div className="lyp-td-submitted">
          {formatDate(submission.submittedAt)}
        {!isDecided && ageChip.text && (
          <span className={`agec ${ageChip.class}`}>
            {ageChip.text}
          </span>
        )}
        </div>
      </td>

      <td className="lyp-td-piece">
        <div className="lyp-td-piece-name">{submission.piece}</div>
        <div className="lyp-td-piece-byline">
          {submission.designer ? (
            <span className="qlnk">{submission.designer}</span>
          ) : (
            <span className="lyp-td-piece-no-designer">—</span>
          )}
          {submission.designer && !submission.category && (
            <span className="tchip warn">Unmapped</span>
          )}
          {submission.category && (
            <span className="lyp-td-piece-category"> · {submission.category}</span>
          )}
        </div>
      </td>

      <td className="lyp-td-lister">
        <div className="qlnk">{getFirstName(submission.listerID)}</div>
        <div className="lyp-td-lister-meta">
          {(submission as any).phone}  {submission.city || '—'}
        </div>
      </td>

      <td className="lyp-td-intent">
        <span className={`tag ${intentClass}`}>
          {submission.intent}
        </span>
      </td>

      <td className="lyp-td-channel">
        <span className={`tag ${channelClass}`}>
          {submission.channel}
        </span>
      </td>

      <td className="lyp-td-status">
        <span className={`s-chip ${statusClass}`}>
          {status}
        </span>
      </td>

      <td className="lyp-td-action">
        {!isDecided ? (
          <button 
            className="btn btn-gold btn-xs"
            onClick={(e) => {
              e.stopPropagation();
              onRowClick(submission);
            }}
          >
            Review →
          </button>
        ) : (
          <button 
            className="btn btn-sec btn-xs"
            onClick={(e) => {
              e.stopPropagation();
              onRowClick(submission);
            }}
          >
            View →
          </button>
        )}
      </td>
    </tr>
  );
};