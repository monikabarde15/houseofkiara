// src/components/Listers/tabs/PayoutHistory/TaxStrip.tsx

import React from 'react';
import { Lister } from '../../types/lister.types';
import './styles/TaxStrip.css';

interface TaxStripProps {
  lister: Lister | null;
}

export const TaxStrip: React.FC<TaxStripProps> = ({ lister }) => {
  if (!lister) {
    return (
      <div className="tax-strip tax-strip-empty">
        No tax information available
      </div>
    );
  }

  const hasPan = lister.pan && lister.pan.length > 0;
  const isPanVerified = lister.panVerified;

  if (hasPan) {
    return (
      <div className="tax-strip tax-strip-pan">
        <span className="tax-strip-label">PAN on file:</span>
        <span className="tax-strip-pan">{lister.pan}</span>
        <span className={`tax-strip-verified ${isPanVerified ? 'tax-verified' : 'tax-unverified'}`}>
          {isPanVerified ? '✓ verified' : '· unverified'}
        </span>
        <span className="tax-strip-detail">
          · TDS u/s 194-O @1% of gross transaction value is deducted at payment and shown on each payout advice.
        </span>
        {lister.gstReg && lister.gstin && (
          <span className="tax-strip-detail">
            · GST on HOK's commission is invoiced separately against GSTIN {lister.gstin}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="tax-strip tax-strip-warning">
      <span className="tax-strip-label">No PAN on file</span>
      <span className="tax-strip-detail">
        – collect before the next payout cycle. Without PAN, TDS u/s 194-O falls back to 5% u/s 206AA and the credit never reaches the lister's 26AS.
      </span>
    </div>
  );
};

export default TaxStrip;