/**
 * House of Kaira - Seller Hero Component (Component C2 & C4 Wrapper)
 * Sections 5.1, 5.2, 5.4 of Build Specification 1.0
 */

import React from "react";
import SellerBreadcrumb from "./SellerBreadcrumb";
import SellerProtectionCard from "./SellerProtectionCard";
import SellerSearchBox from "./SellerSearchBox";
import { SELLER_PAGE_CONFIG, SITE_TOKENS } from "../../data/seller/sellerSettings";

export default function SellerHero({ onScrollToProtect, onSelectQuestion }) {
  return (
    <section className="sg-hero" aria-labelledby="sg-main-heading">
      <SellerBreadcrumb items={SELLER_PAGE_CONFIG.breadcrumb} />

      <div className="sg-hero-inner">
        <div className="sg-hero-left">
          <div className="sg-eyebrow">{SELLER_PAGE_CONFIG.eyebrow}</div>

          <h1 id="sg-main-heading" className="sg-h1">
            {SELLER_PAGE_CONFIG.h1}
          </h1>

          <p className="sg-lead">{SELLER_PAGE_CONFIG.lead}</p>

          <div className="sg-meta">
            <span>Last updated {SITE_TOKENS.page_updated}</span>
            <span className="sg-meta-sep" aria-hidden="true">
              |
            </span>
            <a href={SELLER_PAGE_CONFIG.lister_terms_url}>
              {SELLER_PAGE_CONFIG.lister_terms_label}
            </a>
          </div>

          {/* Search Box Component (Step 3) */}
          <SellerSearchBox onSelectQuestion={onSelectQuestion} />
        </div>

        <div className="sg-hero-right">
          <SellerProtectionCard onScrollToProtect={onScrollToProtect} />
        </div>
      </div>
    </section>
  );
}
