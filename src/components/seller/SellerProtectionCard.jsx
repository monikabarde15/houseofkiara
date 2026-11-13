/**
 * House of Kaira - Seller Protection Card Component (Component C4)
 * Section 5.4 & Appendix A of Build Specification 1.0
 */

import React from "react";
import { SELLER_PROTECTION_CARD } from "../../data/seller/sellerRegistry";

export default function SellerProtectionCard({ onScrollToProtect, getVal }) {
  const title = getVal ? getVal("seller_protect_title", SELLER_PROTECTION_CARD.title) : SELLER_PROTECTION_CARD.title;
  const line = getVal ? getVal("seller_protect_line", SELLER_PROTECTION_CARD.line) : SELLER_PROTECTION_CARD.line;

  const handleClick = (e) => {
    e.preventDefault();
    if (onScrollToProtect) {
      onScrollToProtect();
    } else {
      const target = document.getElementById("ch-protect");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", "#ch-protect");
      }
    }
  };

  return (
    <aside className="sg-shield" aria-label="Your piece, protected">
      <h2>{title}</h2>
      <p className="sub">{line}</p>

      <ul>
        {SELLER_PROTECTION_CARD.points.map((point, index) => (
          <li key={index}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <polyline points="3 8.5 6.5 12 13 4" />
            </svg>
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="more"
        onClick={handleClick}
        aria-label="Scroll to How we protect your piece section"
      >
        {SELLER_PROTECTION_CARD.link_text}
      </button>
    </aside>
  );
}
