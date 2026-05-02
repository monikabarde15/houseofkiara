import React from "react";
import "../../../styles/cart/ui/mode-separator.css";

const LABEL_MAP = {
  rental: "Rental Booking",
  preloved: "Preloved • Buy to own",
  new: "Buy New",
};

const ModeSeparator = ({ type }) => {
  const label = LABEL_MAP[type] || "";

  if (!label) return null; // safety

  return (
    <div className="mode-separator" data-type={type}>
      <span className="mode-dot"></span>
      <span className="mode-label">{label}</span>
    </div>
  );
};

export default ModeSeparator;