/* ========================================
   Promotions Module - Detail Header
   Dark band: badge, code, meta, stats, actions
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 6.1
   ======================================== */

import React from 'react';
import './styles/DetailHeader.css';
import { PromoCode, DerivedPromoState } from '../types/promotions.types';
import { StatusBadge, Button } from '../components/UI';
import { formatValuePhrase, formatMetaLine, formatMoney } from '../utils/formatter';

interface DetailHeaderProps {
  code: PromoCode;
  derivedState: DerivedPromoState;
  redemptions: number;
  onBack: () => void;
  onPause: () => void;
  onResume: () => void;
  onShare: () => void;
  onCopy: () => void;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  code,
  derivedState,
  redemptions,
  onBack,
  onPause,
  onResume,
  onShare,
  onCopy,
}) => {
  const isPaused = derivedState === 'Paused';
  const isActive = derivedState === 'Active';
  
  // Get avatar text
  let avatarText = '';
  if (code.type === 'freedel') {
    avatarText = 'FREE';
  } else if (code.type === 'percent') {
    avatarText = `${code.value}%`;
  } else {
    avatarText = `₹${code.value}`;
  }

  // Mock stats (in production, these come from orders)
  const orderValue = redemptions * 5000;
  const discountFunded = redemptions * 500;
  const firstOrders = Math.floor(redemptions * 0.4);

  return (
    <>
      <div className="detail-header__top-nav">
        <div className="detail-header__breadcrumb">
          <button className="detail-header__back-btn" onClick={onBack}>
            &lt; Back to Promotions
          </button>
          <span className="detail-header__breadcrumb-text">
            Promotions <span className="detail-header__breadcrumb-separator">&gt;</span> <strong>{code.code}</strong>
          </span>
        </div>
        <div className="detail-header__top-actions">
          <button onClick={() => window.open('/', '_blank')} className="detail-header__live-site-btn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px', color: '#6F675D'}}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            View Live Site
          </button>
          <button className="detail-header__save-btn">
            Save Changes
          </button>
        </div>
      </div>
      <div className="detail-header">
        <div className="detail-header__avatar">
          {avatarText}
        </div>

        <div className="detail-header__info">
          <div className="detail-header__title-row">
            <h2 className="detail-header__code">{code.code}</h2>
          </div>
          <div className="detail-header__meta">
            {formatMetaLine(code)}
          </div>

          <div className="detail-header__stats">
            <div className="detail-header__stat">
              <span className="detail-header__stat-value">{redemptions}</span>
              <span className="detail-header__stat-label">Redemptions</span>
            </div>
            <div className="detail-header__stat">
              <span className="detail-header__stat-value">{formatMoney(orderValue)}</span>
              <span className="detail-header__stat-label">Order Value</span>
            </div>
            <div className="detail-header__stat">
              <span className="detail-header__stat-value">{formatMoney(discountFunded)}</span>
              <span className="detail-header__stat-label">Discount Funded</span>
            </div>
            <div className="detail-header__stat">
              <span className="detail-header__stat-value">{firstOrders || '—'}</span>
              <span className="detail-header__stat-label">First Orders</span>
            </div>
          </div>
        </div>

        <div className="detail-header__right">
          <div className="detail-header__badges">
            {code.audience === 'private' && <StatusBadge status="Private" />}
            <StatusBadge status={derivedState} />
          </div>

          <div className="detail-header__actions">
            <Button variant="secondary" size="small" onClick={onCopy}>
              Copy Code
            </Button>
            {isPaused ? (
              <Button variant="secondary" size="small" onClick={onResume}>
                Resume
              </Button>
            ) : isActive ? (
              <Button variant="secondary" size="small" onClick={onPause}>
                Pause
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};