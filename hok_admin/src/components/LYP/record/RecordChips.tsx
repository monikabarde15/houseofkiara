// src/components/LYP/record/RecordChips.tsx

import React from 'react';
import { Submission } from '../types/submission.types';
import { formatDate, getFirstName } from '../utils/formatter';
import { getChannelClass } from '../utils/derived';
import './styles/RecordChips.css';

interface RecordChipsProps {
  submission: Submission;
}

export const RecordChips: React.FC<RecordChipsProps> = ({ submission }) => {
  const channelClass = getChannelClass(submission.channel);
  const status = submission.decision ? submission.decision.what : 'Pending';
  const statusClass = submission.decision 
    ? (submission.decision.what === 'Approved' ? 's-live' : 
       submission.decision.what === 'Rejected' ? 's-sold' : 's-draft')
    : 's-pend';

  // Terms chip logic
  const hasTerms = !!submission.terms;
  const termsVersion = submission.terms?.version || 'LST-2026-01';
  const termsDate = submission.terms?.acceptedAt ? formatDate(submission.terms.acceptedAt) : '';
  const isTermsCurrent = hasTerms && submission.terms?.version === 'LST-2026-01';
  const isDecided = !!submission.decision;

  const renderTermsChip = () => {
    if (isTermsCurrent) {
      return (
        <span className="tchip ok">
          Terms {termsVersion} · {termsDate}
          {submission.terms?.ownership && ' · ownership confirmed'}
        </span>
      );
    }
    
    if (hasTerms) {
      // Outdated
      const chipClass = isDecided ? 'tchip' : 'tchip warn clickable';
      const text = isDecided 
        ? `Terms ${termsVersion} · ${termsDate} — re-acceptance pending (LST-2026-01)`
        : `Terms ${termsVersion} · ${termsDate} — request LST-2026-01 →`;
      return (
        <span 
          className={chipClass}
          title={!isDecided ? "One click — the ask opens in WhatsApp, pre-filled" : ""}
        >
          {text}
        </span>
      );
    }
    
    // No terms
    const chipClass = isDecided ? 'tchip bad' : 'tchip bad clickable';
    const text = isDecided 
      ? 'Terms not accepted'
      : 'Terms not accepted — send the ask on WhatsApp →';
    return (
      <span 
        className={chipClass}
        title={!isDecided ? "One click — the ask opens in WhatsApp, pre-filled" : ""}
      >
        {text}
      </span>
    );
  };

  // City chip
  const isExpansionCity = false; // Would check against serviceable cities
  const cityClass = isExpansionCity ? 'tchip warn' : 'tchip ok';

  // Identity chip (Also a customer)
  const isAlsoCustomer = false; // Would check lister customer status

  return (
    <div className="record-chips">
      <span className="subid">{submission.subid}</span>
      <span className={`tag ${channelClass}`}>{submission.channel}</span>
      <span className={`s-chip ${statusClass}`}>{status}</span>
      {renderTermsChip()}
      <span className={cityClass}>
        {isExpansionCity ? `${submission.city} — expansion city, flag before approving` : `Pickup ${submission.city}`}
      </span>
      {isAlsoCustomer && (
        <span className="tchip ok qlnk">
          Also a customer - LTV X →
        </span>
      )}
    </div>
  );
};