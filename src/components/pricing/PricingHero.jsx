// src/components/pricing/PricingHero.jsx
// Hero presentation band with search box and popular questions (D2, Page 9)

import React from "react";
import { PRICING_HERO } from "../../data/pricing/pricingRegistry";
import PricingSearchBox from "./PricingSearchBox";
import PricingPopularLinks from "./PricingPopularLinks";

function PricingHero({ activeSide, onSelectQuestion, onShowToast, getVal, sections }) {
  const gv = (k, fb) => (getVal ? getVal(k, fb) : fb);

  return (
    <header className="dp-hero">
      <div className="fq-eyebrow enter e1">
        <i aria-hidden="true" />
        <span>{gv("pricing_hero_eyebrow", PRICING_HERO.eyebrow)}</span>
        <i aria-hidden="true" />
      </div>

      <h1 className="dp-h1 enter e2">
        {gv("pricing_hero_title_prefix", PRICING_HERO.titlePrefix)}
        <em>{gv("pricing_hero_italic", PRICING_HERO.italicWord)}</em>
      </h1>

      <p className="dp-sub enter e2">
        {gv("pricing_hero_subtitle", PRICING_HERO.subtitle)}
      </p>

      <PricingSearchBox
        activeSide={activeSide}
        onSelectQuestion={onSelectQuestion}
        onShowToast={onShowToast}
        getVal={getVal}
        sections={sections}
      />

      <PricingPopularLinks onSelectQuestion={onSelectQuestion} getVal={getVal} />
    </header>
  );
}

export default React.memo(PricingHero);
