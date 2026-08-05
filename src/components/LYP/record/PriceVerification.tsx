// src/components/LYP/record/PriceVerification.tsx

import React from 'react';
import { Submission } from '../types/submission.types';
import { inr } from '../utils/formatter';
import './styles/PriceVerification.css';

interface PriceVerificationProps {
  submission: Submission;
  onUpdate: () => void;
}

export const PriceVerification: React.FC<PriceVerificationProps> = ({ 
  submission, 
  onUpdate 
}) => {
  const isDecided = !!submission.decision;
  const retailPrice = submission.assessment?.retailPrice || 0;
  const verifiedVia = submission.assessment?.retailVerifiedVia;
  const originalPrice = parseFloat(submission.originalPrice?.replace(/[^0-9.]/g, '') || '0');
  const isVerified = retailPrice > 0 && verifiedVia;

  if (isDecided && !isVerified) {
    return null;
  }

  if (isVerified) {
    const diff = retailPrice - originalPrice;
    const diffAbs = Math.abs(diff);
    const threshold = Math.max(1000, originalPrice * 0.1);
    const showDiff = diffAbs >= threshold;

    return (
      <div className="price-verification">
        <span className="tchip ok">
          Verified — {inr(retailPrice)} — {verifiedVia}
        </span>
        {showDiff && (
          <span className={`tchip ${diff > 0 ? 'warn' : 'bad'}`}>
            {diff > 0 ? '+' : '-'}{inr(diffAbs)} vs claim
          </span>
        )}
      </div>
    );
  }

  if (!isDecided) {
    return (
      <div className="price-verification">
        <span className="tchip warn clickable" title="Jump to the worksheet">
          Unverified — record it in the worksheet →
        </span>
      </div>
    );
  }

  return null;
};