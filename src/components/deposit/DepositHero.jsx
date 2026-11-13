/**
 * House of Kaira - Deposit Policy Hero Component (D2 & D3)
 * Section 5 (D2 & D3), 6.1 & 7.1 of Build Specification v2.0 (hok_deposit_policy_v2)
 */

import React from 'react';
import DepositSearchBox from './DepositSearchBox.jsx';
import DepositPopularLinks from './DepositPopularLinks.jsx';

const DepositHero = ({ onSelectQuestion, onShowToast, getVal }) => {
  const eyebrow = getVal ? getVal('deposit_hero_eyebrow', 'Our promise to you') : 'Our promise to you';
  const heading = getVal ? getVal('deposit_hero_heading', null) : null;
  const lead = getVal
    ? getVal(
        'deposit_hero_lead',
        'Every rental is protected by a fully refundable deposit, held in safekeeping while the piece is with you. Here is everything you need to know, from the day you pay it to the day it returns to you.'
      )
    : 'Every rental is protected by a fully refundable deposit, held in safekeeping while the piece is with you. Here is everything you need to know, from the day you pay it to the day it returns to you.';

  return (
    <section className="dp-hero" aria-labelledby="deposit-hero-title">
      {/* Eyebrow: "Our promise to you" with 32px gold lines */}
      <div className="fq-eyebrow dp-enter dp-e0">
        <i aria-hidden="true" />
        <span>{eyebrow}</span>
        <i aria-hidden="true" />
      </div>

      {/* Page Title: "Your security deposit" ("deposit" in gold italic) */}
      <h1 id="deposit-hero-title" className="dp-h1 dp-enter dp-e1">
        {heading ? (
          heading
        ) : (
          <>
            Your security <em>deposit</em>
          </>
        )}
      </h1>

      {/* Subtitle paragraph */}
      <p className="dp-sub dp-enter dp-e2">
        {lead}
      </p>

      {/* D3 Page Search Box */}
      <DepositSearchBox
        onSelectQuestion={onSelectQuestion}
        onShowToast={onShowToast}
      />

      {/* D3 Popular Searches Row */}
      <DepositPopularLinks
        onSelectQuestion={onSelectQuestion}
      />
    </section>
  );
};

export default React.memo(DepositHero);
