// src\components\Cart\items\modes\preloved\PrelovedPriceBlock.jsx
import React from "react";
import { useRegionalSettings } from "../../../../../hooks/useRegionalSettings";
import "../../../../../styles/cart/items/price-block.css";

const PrelovedPriceBlock = ({ product, itemPrice }) => {
  const { currencySymbol, formatPrice } = useRegionalSettings();
  const pricing = product?.preloved?.pricing || product?.modes?.preloved?.pricing || {};

  const resale = itemPrice || pricing?.price || product?.listingPrice || product?.price || 0;
  const retail = pricing?.originalPrice || product?.originalRetailPrice || product?.oldPrice || 0;

  const savings = retail > resale ? retail - resale : 0;
  const percent = retail && savings > 0
    ? Math.round((savings / retail) * 100)
    : 0;

  if (!resale) return null;

  return (
    <div className="preloved-price">

      {/* Eyebrow */}
      <div className="preloved-price__label">
        Resale price
      </div>

      {/* Price Row */}
      <div className="preloved-price__row">

        <span className="preloved-price__main">
          <sup>{currencySymbol}</sup>{formatPrice(resale)}
        </span>

        {retail > 0 && (
          <span className="preloved-price__strike">
            {currencySymbol}{formatPrice(retail)}
          </span>
        )}

      </div>

      {/* Savings */}
      {savings > 0 && (
        <div className="preloved-price__savings">
          You save {currencySymbol}{formatPrice(savings)} · {percent}% below retail
        </div>
      )}

    </div>
  );
};

export default PrelovedPriceBlock;
