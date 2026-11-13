/**
 * House of Kaira: Shipping & Delivery Policy Hero Header (D2)
 * Section 4.2 of Build Specification v2 (hok_shipping_policy_v3)
 */

import React from "react";
import { SHIPPING_HERO } from "../../data/shipping/shippingRegistry";
import ShippingSearchBox from "./ShippingSearchBox";
import ShippingPopularLinks from "./ShippingPopularLinks";

function ShippingHero({ onSelectQuestion, onShowToast, getVal }) {
  const eyebrow = getVal ? getVal("shipping_hero_eyebrow", SHIPPING_HERO.eyebrow) : SHIPPING_HERO.eyebrow;
  const prefix = getVal ? getVal("shipping_hero_prefix", SHIPPING_HERO.titlePrefix) : SHIPPING_HERO.titlePrefix;
  const italic = getVal ? getVal("shipping_hero_italic", SHIPPING_HERO.italicWord) : SHIPPING_HERO.italicWord;
  const lead = getVal ? getVal("shipping_hero_lead", SHIPPING_HERO.subtitle) : SHIPPING_HERO.subtitle;

  return (
    <header className="dp-hero">
      <div className="fq-eyebrow enter e1">
        <i aria-hidden="true" />
        <span>{eyebrow}</span>
        <i aria-hidden="true" />
      </div>
      <h1 className="dp-h1 enter e2">
        {prefix}{" "}
        <em>{italic}</em>
      </h1>
      <p className="dp-sub enter e2">{lead}</p>
      <ShippingSearchBox onSelectQuestion={onSelectQuestion} onShowToast={onShowToast} />
      <ShippingPopularLinks onSelectQuestion={onSelectQuestion} />
    </header>
  );
}

export default React.memo(ShippingHero);
