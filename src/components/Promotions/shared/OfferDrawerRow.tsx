/* ========================================
   Promotions Module - Offer Drawer Row
   Drawer row component (ready/near-miss)
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 6.14
   ======================================== */

import React from 'react';
import './styles/OfferDrawerRow.css';

interface OfferDrawerRowProps {
  code: string;
  publicDesc: string;
  discount: number | 'free';
  isCurrent: boolean;
  isNearMiss: boolean;
  gapMessage?: string;
  onClick?: () => void;
}

export const OfferDrawerRow: React.FC<OfferDrawerRowProps> = ({
  code,
  publicDesc,
  discount,
  isCurrent,
  isNearMiss,
  gapMessage,
  onClick,
}) => {
  const discountDisplay = discount === 'free' 
    ? 'Free delivery' 
    : `₹${discount.toLocaleString('en-IN')}`;

  return (
    <div
      className={`offer-drawer-row ${isCurrent ? 'current' : ''} ${isNearMiss ? 'near-miss' : ''}`}
      onClick={onClick}
    >
      <div className="offer-drawer-row__left">
        <span className="offer-drawer-row__code">{code}</span>
        <span className="offer-drawer-row__desc">{publicDesc}</span>
        {isNearMiss && gapMessage && (
          <span className="offer-drawer-row__gap">{gapMessage}</span>
        )}
        {isCurrent && (
          <span className="offer-drawer-row__tag">this code</span>
        )}
      </div>
      <div className={`offer-drawer-row__right ${isNearMiss ? 'locked' : ''}`}>
        {isNearMiss ? 'Locked' : discountDisplay}
      </div>
    </div>
  );
};