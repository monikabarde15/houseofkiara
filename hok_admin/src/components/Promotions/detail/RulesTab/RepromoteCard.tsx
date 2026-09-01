/* ========================================
   Promotions Module - Repromote Card
   WhatsApp broadcast + Instagram caption
   Based on HOK_Promotions_UI_Spec_v150.pdf Section 6.11
   ======================================== */

import React from 'react';
import './styles/RepromoteCard.css';
import { Card, Button } from '../../components/UI';
import { PromoCode, DerivedPromoState } from '../../types/promotions.types';
import { formatValuePhrase, formatScopePhrase, formatMoney, formatDate } from '../../utils/formatter';

interface RepromoteCardProps {
  code: PromoCode;
}

export const RepromoteCard: React.FC<RepromoteCardProps> = ({ code }) => {
  const isPrivate = code.audience === 'private';
  const isLive = code.status === 'Active';
  const redemptions = 0; // In production, get from props

  // Generate WhatsApp broadcast text
  const valuePhrase = formatValuePhrase(code);
  const scopePhrase = formatScopePhrase(code);
  const minPhrase = code.minOrder ? ` on orders of ${formatMoney(code.minOrder)}+` : '';
  const untilPhrase = code.validUntil ? `, valid till ${formatDate(code.validUntil)}` : '';
  
  let whatPhrase = '';
  if (scopePhrase) {
    whatPhrase = scopePhrase;
    if (code.modes.length === 1 && code.modes[0] === 'Rental' && !scopePhrase.toLowerCase().includes('lehenga')) {
      whatPhrase += ' rentals'; // Wait! Spec says: "appending ' rentals' for a rental-only code"
    } else if (!scopePhrase.endsWith('piece') && !scopePhrase.endsWith('pieces')) {
      whatPhrase += ' pieces'; // Spec says: "or ' pieces' otherwise, unless the phrase already ends in 'piece'/'pieces'"
    }
  } else if (code.modes.length === 1 && code.modes[0] === 'Rental') {
    whatPhrase = 'your next rental';
  } else {
    whatPhrase = 'your next order';
  }

  const broadcastText = `House of Kaira here — a little something for your next celebration: use code ${code.code} for ${valuePhrase} on ${whatPhrase}${minPhrase}${untilPhrase}. Enter it at checkout — the good pieces go first.`;

  const instagramText = `A little sparkle for the season — ${valuePhrase} on ${whatPhrase} with code ${code.code}${minPhrase}${untilPhrase}. Link in bio. #HouseOfKaira`;

  // Private code refusal
  if (isPrivate) {
    return (
      <Card 
        header={<span className="card__title">Repromote — announce it again</span>}
        className="repromote-card"
      >
        <div className="repromote-card__refusal">
          This is a private code — broadcasting it would invite everyone to a door that only opens for {code.customerIds.length === 1 ? 'one account' : 'a few accounts'}. Share it personally instead, from the WhatsApp button in the header.
        </div>
      </Card>
    );
  }

  // Not live
  if (!isLive) {
    return (
      <Card 
        header={<span className="card__title">Repromote — announce it again</span>}
        className="repromote-card"
      >
        <div className="repromote-card__refusal">
          Repromotion is for live codes — this one is {code.status}. Fix that on the rules above first.
        </div>
      </Card>
    );
  }

  return (
    <Card 
      header={<span className="card__title">Repromote — announce it again</span>}
      className="repromote-card"
    >
      <div className="repromote-card__intro">
        The zero-cost push: the code is already live — what it needs is another announcement. Both texts derive from the rules above; change the rules and they change too. The "zero traction" attention pill points here — it appears once a public code has been Active 14+ days with no redemptions, and it clears itself on the first order.
      </div>

      <span className="repromote-card__label">WhatsApp broadcast</span>
      <div className="repromote-card__text">
        {broadcastText}
      </div>
      <Button variant="secondary" size="small">
        Open in WhatsApp
      </Button>

      <span className="repromote-card__label">Instagram caption — @house_of_kaira</span>
      <div className="repromote-card__text">
        {instagramText}
      </div>
      <Button variant="secondary" size="small">
        Copy Caption
      </Button>
    </Card>
  );
};