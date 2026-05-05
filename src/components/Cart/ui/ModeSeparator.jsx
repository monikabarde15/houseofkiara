import React from "react";

const LABEL_MAP = {
  rental: "Rental Booking",
  preloved: "Preloved • Buy to own",
  new: "Buy New",
};

const ModeSeparator = ({ type, variant = "d", dataRise }) => {
  const label = LABEL_MAP[type];
  if (!label) return null;

  return (
    <div
      className={`mode-separator-${variant}`}
      data-type={type}
      data-rise={dataRise}
    >
      <span className={`mode-dot-${variant}`}></span>
      <span className={`mode-label-${variant}`}>{label}</span>
    </div>
  );
};

export default ModeSeparator;