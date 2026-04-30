import React from "react";
import "../../../../../styles/cart/items/disclosure-notice.css";

const PrelovedDisclosure = ({ product }) => {
  const disclosure = product?.preloved?.disclosure;

  if (!disclosure) return null;

  return (
    <div className="preloved-disclosure">

      <span className="preloved-disclosure__label">
        Condition disclosure:
      </span>

      <span className="preloved-disclosure__body">
        {disclosure}
      </span>

    </div>
  );
};

export default PrelovedDisclosure;