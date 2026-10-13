// src/components/pricing/PricingHero.jsx
// Hero presentation band with search box and popular questions (D2, Page 9)

import React from "react";
import { PRICING_HERO } from "../../data/pricing/pricingRegistry";
import PricingSearchBox from "./PricingSearchBox";
import PricingPopularLinks from "./PricingPopularLinks";

function PricingHero({ activeSide, onSelectQuestion, onShowToast }) {
  return (
    <header className="dp-hero">
      <div className="fq-eyebrow enter e1">
        <i aria-hidden="true" />
        <span>{PRICING_HERO.eyebrow}</span>
        <i aria-hidden="true" />
      </div>

      <h1 className="dp-h1 enter e2">
        {PRICING_HERO.titlePrefix}
        <em>{PRICING_HERO.italicWord}</em>
      </h1>

      <p className="dp-sub enter e2">{PRICING_HERO.subtitle}</p>

      <PricingSearchBox
        activeSide={activeSide}
        onSelectQuestion={onSelectQuestion}
        onShowToast={onShowToast}
      />

      <PricingPopularLinks onSelectQuestion={onSelectQuestion} />
    </header>
  );
}

export default React.memo(PricingHero);
