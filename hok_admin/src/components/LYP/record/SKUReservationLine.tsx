// src/components/LYP/record/SKUReservationLine.tsx

import React from 'react';
import { Submission } from '../types/submission.types';
import './styles/SKUReservationLine.css';

interface SKUReservationLineProps {
  submission: Submission;
}

export const SKUReservationLine: React.FC<SKUReservationLineProps> = ({ submission }) => {
  // Only show for non-approved verdicts
  if (submission.decision?.what === 'Approved') {
    return null;
  }

  const sku = submission.assessment?.sku || (submission as any).sku;

  if (sku) {
    return (
      <div className="sku-reservation-line">
        Working SKU <span className="subid sku-reserved">{sku}</span> — reserved to this record forever; house numbers are never reissued, so every past analysis keyed on it stays true.
      </div>
    );
  }

  return (
    <div className="sku-reservation-line">
      No SKU was penciled before withdrawal — numbers are only reserved once written, and once written they are never reissued.
    </div>
  );
};