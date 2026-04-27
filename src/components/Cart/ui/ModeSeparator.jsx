import React from "react";
import "../../../styles/cart/ui/mode-separator.css";

const ModeSeparator = ({ label, type }) => {
  return (
    <div className="mode-separator" data-type={type}>
      <span className="mode-dot"></span>
      <span className="mode-label">{label}</span>
    </div>
  );
};

export default ModeSeparator;