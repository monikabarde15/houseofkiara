import React from "react";
import "../../../styles/cart/ui/mode-separator.css";
const LABEL_MAP = {
  rental: "Rental Booking",
  preloved: "Preloved • Buy to own",
  new: "Buy New",
};

const ModeSeparator = ({ type, dataRise, source }) => {
  let label = LABEL_MAP[type];
  
  if (type === "rental" && source === "rentandpreloved") {
    label = "Rent & Preloved";
  }
  if (!label) return null;

  return (
    <div className="mode-separator" data-type={type} data-rise={dataRise}>
      <span className="mode-separator-dot"></span>
      <span className="mode-separator-label">{label}</span>
    </div>
  );
};

export default ModeSeparator;
