/* ========================================
   Promotions Module - Checkout Validation Card
   The 13 checks rendered live
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 6.10
   ======================================== */

import React from 'react';
import './styles/CheckoutValidationCard.css';
import { Card } from '../../components/UI';
import { PromoCode } from '../../types/promotions.types';
import { DEFAULT_SHOPPER_MESSAGES } from '../../utils/constants';

interface CheckoutValidationCardProps {
  code: PromoCode;
}

export const CheckoutValidationCard: React.FC<CheckoutValidationCardProps> = ({ code }) => {
  const checks = [
    { num: 1, label: 'Code exists', message: DEFAULT_SHOPPER_MESSAGES.exists },
    { num: 2, label: 'Not yet live', message: DEFAULT_SHOPPER_MESSAGES.notlive },
    { num: 3, label: 'Expired', message: DEFAULT_SHOPPER_MESSAGES.expired },
    { num: 4, label: 'Paused', message: DEFAULT_SHOPPER_MESSAGES.paused },
    { num: 5, label: 'Total cap reached', message: DEFAULT_SHOPPER_MESSAGES.capitol },
    { num: 6, label: 'Private & different account', message: DEFAULT_SHOPPER_MESSAGES.privatemis },
    { num: 7, label: 'First-order-only & returning customer', message: DEFAULT_SHOPPER_MESSAGES.firstorder },
    { num: 8, label: 'Mode not covered', message: DEFAULT_SHOPPER_MESSAGES.mode },
    { num: 9, label: 'No qualifying piece in the bag', message: DEFAULT_SHOPPER_MESSAGES.scope },
    { num: 10, label: 'Accepted-offer line', message: DEFAULT_SHOPPER_MESSAGES.offerline },
    { num: 11, label: 'Under minimum', message: DEFAULT_SHOPPER_MESSAGES.minimum },
    { num: 12, label: 'Per-customer cap reached', message: DEFAULT_SHOPPER_MESSAGES.percust },
    { num: 13, label: 'Combinability, last — so the message can honestly say the code works: policy is one-per-order', message: DEFAULT_SHOPPER_MESSAGES.apolicyone },
  ];

  const checkNotes: Record<number, string> = {
    7: '"First" is matched on the verified phone number rather than the account, so a second sign-up on the same number is still a returning customer; the per-customer cap counts the same way.',
    9: 'Scope is checked per piece: category, designer and specific-piece groups combine with AND; within a group, any match qualifies.',
    10: 'A Preloved line whose price came from an accepted offer is already a negotiated price — it is excluded from the qualifying merchandise, so a code can neither discount it again nor count it toward a minimum.',
    11: 'The minimum is measured on the qualifying merchandise only, so a scoped code can\'t ride on a bag full of other things.',
  };

  return (
    <Card header={<span className="card__title">How Checkout Validates This Code</span>}>
      <div className="checkout-validation__intro">
        Checks run in this exact order — the first one that fails is the message the shopper sees. The sequence matters: this is the behind-the-scenes mechanic, written down so the build matches it one day.
      </div>

      <ol className="checkout-validation__list">
        {checks.map(check => {
          const hasNote = checkNotes[check.num];
          const isCombinability = check.num === 13;
          
          return (
            <li key={check.num} className="checkout-validation__item" data-index={check.num}>
              {check.label}
              {' → '}
              {check.num === 1 ? (
                <>
                  else <span className="sentence">“{check.message}”</span>
                </>
              ) : isCombinability ? (
                <>
                  <span className="sentence">“{check.message}”</span>
                  {' A code joins the bag only if it is linked with every code already applied. No links at all → '}
                  <span className="sentence">“{'{code}'} doesn’t combine with other codes.”</span>
                  {' Linked with some but not all → '}
                  <span className="sentence">“{'{code}'} doesn’t combine with {'{unlinked code}'} — remove it to use {'{code}'}.”</span>
                  {' Linked with every applied code → they apply together, and the computation below governs the money.'}
                </>
              ) : (
                <span className="sentence">“{check.message}”</span>
              )}
              
              {hasNote && (
                <span className="note">{checkNotes[check.num]}</span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="checkout-validation__closing">
        <strong>How the discount computes on success.</strong>
        <br />
        Each code computes independently on the pre-discount value of its qualifying merchandise — percentage codes never compound on another code's result, so the order codes are entered in never changes the money. The discount then allocates pro-rata across the qualifying lines only, and each line's GST is charged on its discounted line value at that line's own rate (18% Rental SAC 997326, 5% Preloved HSN 6309, Buy New embedded). A free-delivery code needs at least one qualifying piece in the bag; delivery on the order is then free. Combined discounts — always codes linked with every other applied code — respect the Checkout Rules caps and can never exceed the qualifying merchandise value. The deposit is never discounted and never counts toward minimums. The order record carries the code(s) — which is exactly how the ledger on this page is derived.
      </div>
    </Card>
  );
};