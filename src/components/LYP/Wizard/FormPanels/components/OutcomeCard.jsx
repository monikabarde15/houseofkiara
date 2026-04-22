import React from "react";

const OutcomeCard = ({
  icon,
  title,
  desc,
  selected,
  variant,
  onClick,
}) => {
  return (
    <div
      className={`lyp-outcome-card 
        ${selected ? `lyp-outcome-card--active-${variant}` : ""}
      `}
      onClick={onClick}
    >
      <div className="lyp-outcome-card__icon">{icon}</div>

      <div className="lyp-outcome-card__title">{title}</div>

      <div className="lyp-outcome-card__desc">{desc}</div>
    </div>
  );
};

export default OutcomeCard;