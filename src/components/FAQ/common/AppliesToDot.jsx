// src/components/FAQ/common/AppliesToDot.jsx
// Small dots used next to Renting, Preloved and Rent & preloved labels per section B10
import React from "react";

export default function AppliesToDot({ type = "both" }) {
  // type can be 'rent', 'pre', or 'both'
  return <span className={`dot dot-${type}`} aria-hidden="true" />;
}
