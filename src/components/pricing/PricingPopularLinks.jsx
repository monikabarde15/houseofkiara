// src/components/pricing/PricingPopularLinks.jsx
// Popular questions under the search (D4, Page 11-12)

import React from "react";
import { PRICING_POPULAR_QUERIES } from "../../data/pricing/pricingRegistry";

function PricingPopularLinks({ onSelectQuestion, getVal }) {
  const handleClick = (item) => {
    if (onSelectQuestion) {
      onSelectQuestion(item.id, item.side);
    }
  };
  const label = getVal ? getVal("pricing_popular_label", "Popular:") : "Popular:";

  return (
    <div className="ch-pop enter e4" aria-label="Popular questions">
      <span className="pop-lbl">{label}</span>
      {PRICING_POPULAR_QUERIES.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => handleClick(item)}
        >
          {item.text || item.label}
        </button>
      ))}
    </div>
  );
}

export default React.memo(PricingPopularLinks);
