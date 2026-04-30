// src/components/Cart/summary/SummaryRow.jsx

import React from "react";
import "../../../styles/cart/summary/order-summary.css";

const SummaryRow = ({
  title,
  subtitle,
  value,
  type = "normal",
  layout = "column"   // 👈 NEW
}) => {
  return (
    <div className={`summary-row ${type}`}>

      <div className={`summary-left ${layout}`}>

        <div className="summary-title">{title}</div>

        {subtitle && (
          <div className="summary-sub">{subtitle}</div>
        )}

      </div>

      <div className="summary-value">
        {typeof value === "number"
          ? `₹${value.toLocaleString()}`
          : value}
      </div>

    </div>
  );
};

export default SummaryRow;