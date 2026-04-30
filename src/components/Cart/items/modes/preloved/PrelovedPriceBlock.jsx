import React from "react";
import "../../../../../styles/cart/items/price-block.css";

const PrelovedPriceBlock = ({ product }) => {
  const pricing = product?.preloved?.pricing || {};

  const resale = pricing?.price || 0;
  const retail = pricing?.originalPrice || 0;

  const savings = retail - resale;
  const percent = retail
    ? Math.round((savings / retail) * 100)
    : 0;

  return (
    <div className="preloved-price">

      {/* Eyebrow */}
      <div className="preloved-price__label">
        Resale price
      </div>

      {/* Price Row */}
      <div className="preloved-price__row">

        <span className="preloved-price__main">
          <sup>₹</sup>{resale.toLocaleString()}
        </span>

        {retail > 0 && (
          <span className="preloved-price__strike">
            ₹{retail.toLocaleString()}
          </span>
        )}

      </div>

      {/* Savings */}
      {savings > 0 && (
        <div className="preloved-price__savings">
          You save ₹{savings.toLocaleString()} · {percent}% below retail
        </div>
      )}

    </div>
  );
};

export default PrelovedPriceBlock;