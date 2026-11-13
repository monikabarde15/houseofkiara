/**
 * House of Kaira - Seller Hero Component (Component C2 & C4 Wrapper)
 * Sections 5.1, 5.2, 5.4 of Build Specification 1.0
 */

import React from "react";
import SellerBreadcrumb from "./SellerBreadcrumb";
import SellerProtectionCard from "./SellerProtectionCard";
import SellerSearchBox from "./SellerSearchBox";
import { SELLER_PAGE_CONFIG, SITE_TOKENS } from "../../data/seller/sellerSettings";

export default function SellerHero({ onScrollToProtect, onSelectQuestion, getVal }) {
  const eyebrow = getVal ? getVal("seller_hero_eyebrow", SELLER_PAGE_CONFIG.eyebrow) : SELLER_PAGE_CONFIG.eyebrow;
  const heading = getVal ? getVal("seller_hero_title", getVal("seller_hero_heading", SELLER_PAGE_CONFIG.h1)) : SELLER_PAGE_CONFIG.h1;
  const lead = getVal ? getVal("seller_hero_lead", SELLER_PAGE_CONFIG.lead) : SELLER_PAGE_CONFIG.lead;

  return (
    <section className="sg-hero" aria-labelledby="sg-main-heading">
      <SellerBreadcrumb items={SELLER_PAGE_CONFIG.breadcrumb} />

      <div className="sg-hero-inner">
        <div className="sg-hero-left">
          <div className="sg-eyebrow">{eyebrow}</div>

          <h1 id="sg-main-heading" className="sg-h1">
            {heading}
          </h1>

          <p className="sg-lead">{lead}</p>

          <SellerSearchBox onSelectQuestion={onSelectQuestion} />
        </div>

        <div className="sg-hero-right">
          <SellerProtectionCard onScrollToProtect={onScrollToProtect} getVal={getVal} />
        </div>
      </div>
    </section>
  );
}
