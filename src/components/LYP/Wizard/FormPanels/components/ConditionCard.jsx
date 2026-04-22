import React from "react";

const ConditionCard = ({ label, desc, color, selected, onClick }) => {
  return (
    <div
      className={`lyp-condition-card ${
        selected ? "lyp-condition-card--selected" : ""
      }`}
      onClick={onClick}
    >
      <div
        className="lyp-condition-card__dot"
        style={{ background: color }}
      ></div>

      <div className="lyp-condition-card__content">
        <div className="lyp-condition-card__title">{label}</div>
        <div className="lyp-condition-card__desc">{desc}</div>
      </div>
    </div>
  );
};

export default ConditionCard;