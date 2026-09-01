// src/components/Listers/components/ApplicantCard.tsx

import React from 'react';
import { Lister, Submission } from '../types/lister.types';
import { formatDate, truncateText, pluralize } from '../utils/formatter';
import { generateWhatsAppLink, getDefaultWhatsAppMessage } from '../utils/generators';
import { CHANNEL_TAG_MAPPING } from '../utils/constants';
import useSubmissions from '../hooks/useSubmissions';
import './styles/ApplicantCard.css';

interface ApplicantCardProps {
  lister: Lister;
}

export const ApplicantCard: React.FC<ApplicantCardProps> = ({ lister }) => {
  const { submissions, getSubmissionForLister } = useSubmissions(lister.id);
  const submission = getSubmissionForLister(lister.id);

  if (!submission) {
    const waLink = generateWhatsAppLink(lister.phone, getDefaultWhatsAppMessage(lister.name.split(' ')[0]));
    return (
      <div className="applicant-card applicant-card-no-submission">
        <div className="applicant-card-row1">
          <div className="applicant-card-left">
            <span className="applicant-card-name qlnk">{lister.name}</span>
            <span className="applicant-card-separator"> · </span>
            <span className="applicant-card-city">{lister.city}</span>
            <span className="tag t-n" style={{ marginLeft: '6px' }}>No submission</span>
          </div>
        </div>
        <div className="applicant-card-no-submission-body">
          <span className="applicant-card-no-submission-text">
            No submission on file – record their piece from the profile before deciding.
          </span>
        </div>
        <div className="applicant-card-actions-row">
          <button className="btn btn-sec btn-sm">Open profile →</button>
          {waLink && (
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-sm">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
              WhatsApp
            </a>
          )}
        </div>
      </div>
    );
  }

  const channelTag = CHANNEL_TAG_MAPPING[submission.channel] || CHANNEL_TAG_MAPPING['Website'];
  const waLink = generateWhatsAppLink(lister.phone, getDefaultWhatsAppMessage(lister.name.split(' ')[0]));

  return (
    <div className="applicant-card">
      <div className="applicant-card-row1">
        <div className="applicant-card-left">
          <span className="applicant-card-name qlnk">{lister.name}</span>
          <span className="applicant-card-separator"> · </span>
          <span className="applicant-card-city">{lister.city}</span>
          <span className={`tag ${channelTag.class}`} style={{ marginLeft: '6px' }}>{submission.channel}</span>
        </div>
        <div className="applicant-card-right">
          <span className="subid-chip">{submission.subid}</span>
          <span className="applicant-card-date">Submitted {formatDate(submission.submitted)}</span>
        </div>
      </div>

      <div className="applicant-card-row2">
        <span className="applicant-card-piece">
          <strong>{submission.piece}</strong>
          <span className="applicant-card-piece-meta">
            {' — '}{submission.designer} · {submission.category}
          </span>
        </span>
      </div>

      <div className="applicant-card-row3">
        <span className="applicant-card-facts">
          {submission.intent}
          {submission.askRent && ` · Rent ${submission.askRent}`}
          {submission.askSell && ` · Outright ${submission.askSell}`}
          {submission.photos > 0 && ` · ${pluralize(submission.photos, 'photo')}`}
          {submission.videos > 0 && ` · ${pluralize(submission.videos, 'video')}`}
        </span>
      </div>

      {submission.conditionClaim && (
        <div className="applicant-card-row4">
          <span className="applicant-card-quote">
            “{truncateText(submission.conditionClaim, 76)}”
          </span>
        </div>
      )}

      <div className="applicant-card-actions-row">
        <button className="btn btn-gold btn-sm">Review submission →</button>
        {waLink && (
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-sm">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            WhatsApp
          </a>
        )}
        <span className="applicant-card-helper">
          Photos, condition & asking price live on the record — approving it verifies {lister.name.split(' ')[0]} automatically.
        </span>
      </div>
    </div>
  );
};

export default ApplicantCard;