import React from "react";

const HowStepCard = ({
  number,
  icon: Icon,
  title,
  description,
}) => {
  return (
    <article className="desk-how-card">
      <div className="desk-how-card-number">
        {number}
      </div>

      <div className="desk-how-card-icon-circle">
        <Icon className="desk-how-card-icon" />
      </div>

      <h3 className="desk-how-card-title">
        {title}
      </h3>

      <p className="desk-how-card-description">
        {description}
      </p>
    </article>
  );
};

export default HowStepCard;