import React from "react";
import "../../../styles/cart/ui/mode-separator.css"
const LABEL_MAP = {
  rental: "Rental Booking",
  rent: "Rental Booking",
  preloved: "Preloved • Buy to own",
  new: "Buy New",
};

const ModeSeparator = ({ type, dataRise }) => {
  const normalizedType = type === "rent" ? "rental" : type;
  const label = LABEL_MAP[normalizedType];
  if (!label) return null;

  return (
    <div
      className="mode-separator"
      data-type={type}
      data-rise={dataRise}
    >
      <span className="mode-separator-dot"></span>
      <span className="mode-separator-label">{label}</span>
    </div>
  );
};

export default ModeSeparator;