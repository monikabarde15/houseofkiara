import React from "react";
import "../../../../styles/checkout/mobile/cta/mobile-error-summary.css";

const MobileErrorSummary = ({ errors = [], onClose }) => {
  if (errors.length === 0) return null;

  return (
    <div className="mobile-error-summary visible">
      <div className="mobile-error-summary__title">
        Please complete the following required fields.
      </div>
      <ul className="mobile-error-summary__list">
        {errors.map((error, index) => (
          <li key={index} className="mobile-error-summary__item">
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MobileErrorSummary;