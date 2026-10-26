// src/components/pricing/PricingWayAcross.jsx
// D12 The Way Across: perspective switcher at the end of the policy questions

import React from "react";
import { scrollToPricingTarget } from "../../utils/pricing/pricingScroll";

export default function PricingWayAcross({ activeSide, onSideChange }) {
  const isPay = activeSide === "pay";
  const targetSide = isPay ? "earn" : "pay";

  const questionLine = isPay
    ? "Listing a piece of your own?"
    : "Renting or buying with us?";

  const actionText = isPay
    ? "See what you earn"
    : "See what you pay";

  const handleClick = () => {
    if (onSideChange) {
      onSideChange(targetSide);
    }
    setTimeout(() => {
      scrollToPricingTarget("ledger", { flash: false });
    }, 100);
  };

  return (
    <div className="xside" aria-label="Switch policy perspective">
      <p>{questionLine}</p>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`${actionText}, view the price ledger`}
      >
        <span>{actionText}</span>
        <svg
          viewBox="0 0 10 10"
          aria-hidden="true"
        >
          <polyline points="3 1 7 5 3 9" />
        </svg>
      </button>
    </div>
  );
}
