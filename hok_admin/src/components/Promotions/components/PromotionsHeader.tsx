/* ========================================
   Promotions Module - Promotions Header
   Module header with subtitle & action buttons
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 5.1
   ======================================== */

import React from 'react';
import './styles/PromotionsHeader.css';
import { Button } from './UI';

interface PromotionsHeaderProps {
  onDigestClick?: () => void;
  onCreateClick?: () => void;
  composerOpen: boolean;
}

export const PromotionsHeader: React.FC<PromotionsHeaderProps> = ({
  onDigestClick,
  onCreateClick,
  composerOpen,
}) => {
  return (
    <div className="promotions-header">
      <div className="promotions-header__left">
        <div className="promotions-header__eyebrow">Growth</div>
        <h1 className="promotions-header__title">Promotions</h1>
        <p className="promotions-header__subtitle">
          Every promo code, what it costs, and what it brings in. Codes are HOK-funded — lister payouts always compute on the pre-discount price, GST is charged on the discounted base, and the security deposit is never discounted.
        </p>
      </div>
      <div className="promotions-header__right">
        <Button variant="secondary" size="small" onClick={onDigestClick}>
          Digest on WhatsApp
        </Button>
        <Button variant="primary" size="small" onClick={onCreateClick}>
          {composerOpen ? 'Close Composer' : '+ Create Promo Code'}
        </Button>
      </div>
    </div>
  );
};