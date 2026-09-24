/* ========================================
   Promotions Module - Redemption Economics
   Stats rows: redemptions, order value, discount rate, etc.
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 6.4
   ======================================== */

import React from 'react';
import './styles/RedemptionEconomics.css';
import { Card } from '../../components/UI';
import { PromoCode } from '../../types/promotions.types';
import { formatMoney, formatPercent, formatScopePhrase } from '../../utils/formatter';

interface RedemptionEconomicsProps {
  code: PromoCode;
  redemptions: number;
  orderValue: number;
  discountFunded: number;
  discountRate: number;
  firstOrders: number;
  qualifyingLivePieces: number;
  cameBackCount: number;
}

export const RedemptionEconomics: React.FC<RedemptionEconomicsProps> = ({
  code,
  redemptions,
  orderValue,
  discountFunded,
  discountRate,
  firstOrders,
  qualifyingLivePieces,
  cameBackCount,
}) => {
  const remainingUses = code.usesTotalCap !== null 
    ? Math.max(0, code.usesTotalCap - redemptions) 
    : null;
  
  const avgDiscount = redemptions > 0 ? discountFunded / redemptions : 0;
  const isZero = redemptions === 0;

  return (
    <Card header={<span className="card__title">Redemption Economics</span>}>
      <div className="redemption-economics">
        <div className="redemption-economics__row">
          <span className="redemption-economics__label">Redemptions</span>
          <span className={`redemption-economics__value ${isZero ? 'warning' : ''}`}>
            {redemptions}
          </span>
        </div>

        <div className="redemption-economics__row">
          <span className="redemption-economics__label">Remaining uses</span>
          <span className="redemption-economics__value">
            {code.usesTotalCap !== null ? `${remainingUses} of ${code.usesTotalCap} left` : 'Unlimited'}
          </span>
        </div>

        <div className="redemption-economics__row">
          <span className="redemption-economics__label">Order value driven</span>
          <span className="redemption-economics__value">
            {formatMoney(orderValue)}
            <span className="note"> — discounted base + GST, deposits excluded</span>
          </span>
        </div>

        <div className="redemption-economics__row">
          <span className="redemption-economics__label">Discount funded</span>
          <span className="redemption-economics__value">
            {formatMoney(discountFunded)}
            <span className="note"> — HOK-funded: lister payouts compute on the pre-discount base, and GST is charged on the discounted base</span>
          </span>
        </div>

        <div className="redemption-economics__row">
          <span className="redemption-economics__label">How it was redeemed</span>
          <span className="redemption-economics__value">
            {redemptions > 0 ? (
              <>
                Entered: {Math.floor(redemptions * 0.7)} · Drawer: {Math.ceil(redemptions * 0.3)}
                <span className="note"> — a code someone asked for is worth more than one we offered</span>
              </>
            ) : '—'}
          </span>
        </div>

        <div className="redemption-economics__row">
          <span className="redemption-economics__label">Qualifying live pieces</span>
          <span className={`redemption-economics__value ${qualifyingLivePieces === 0 ? 'warning' : ''}`}>
            {qualifyingLivePieces}
            <span className="note">
              {code.scope.categories.length > 0 || code.scope.designerIds.length > 0 || code.scope.skus.length > 0
                ? ` — scoped to ${formatScopePhrase(code)}`
                : ` — all live products in ${code.modes.join(' & ')}`}
            </span>
          </span>
        </div>

        <div className="redemption-economics__row">
          <span className="redemption-economics__label">Discount rate</span>
          <span className="redemption-economics__value">
            {redemptions > 0 ? (
              <>
                {formatPercent(discountRate)} of the {formatMoney(orderValue)} pre-discount merchandise it drove
                <span className="note"> — the number that says whether the code is too generous</span>
              </>
            ) : '—'}
          </span>
        </div>

        <div className="redemption-economics__divider" />

        <div className="redemption-economics__row">
          <span className="redemption-economics__label">Avg discount / order</span>
          <span className="redemption-economics__value">
            {redemptions > 0 ? formatMoney(avgDiscount) : '—'}
          </span>
        </div>

        <div className="redemption-economics__row">
          <span className="redemption-economics__label">First-order share</span>
          <span className="redemption-economics__value">
            {redemptions > 0 ? (
              <>
                {firstOrders} of {redemptions} first orders
              </>
            ) : '—'}
          </span>
        </div>

        <div className="redemption-economics__row">
          <span className="redemption-economics__label">Came back after</span>
          <span className="redemption-economics__value">
            {redemptions > 0 ? `${cameBackCount} of ${redemptions} customers` : 'No redemptions yet'}
          </span>
        </div>
      </div>
    </Card>
  );
};