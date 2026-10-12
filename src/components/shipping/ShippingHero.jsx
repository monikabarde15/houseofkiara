/**
 * House of Kaira: Shipping & Delivery Policy Hero Header (D2)
 * Section 4.2 of Build Specification v2 (hok_shipping_policy_v3)
 */

import React from "react";
import { SHIPPING_HERO } from "../../data/shipping/shippingRegistry";
import ShippingSearchBox from "./ShippingSearchBox";
import ShippingPopularLinks from "./ShippingPopularLinks";

function ShippingHero({ onSelectQuestion, onShowToast }) {
  return (
    <header className="dp-hero">
      <div className="fq-eyebrow enter e1">
        <i aria-hidden="true" />
        <span>{SHIPPING_HERO.eyebrow}</span>
        <i aria-hidden="true" />
      </div>
      <h1 className="dp-h1 enter e2">
        {SHIPPING_HERO.titlePrefix}
        <em>{SHIPPING_HERO.italicWord}</em>
      </h1>
      <p className="dp-sub enter e2">{SHIPPING_HERO.subtitle}</p>
      <ShippingSearchBox onSelectQuestion={onSelectQuestion} onShowToast={onShowToast} />
      <ShippingPopularLinks onSelectQuestion={onSelectQuestion} />
    </header>
  );
}

export default React.memo(ShippingHero);
