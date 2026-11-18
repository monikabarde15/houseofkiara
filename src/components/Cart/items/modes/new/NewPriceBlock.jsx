// src\components\Cart\items\modes\new\NewPriceBlock.jsx
import React from "react";
import { useRegionalSettings } from "../../../../../hooks/useRegionalSettings";
import "../../../../../styles/cart/items/price-block.css";

const NewPriceBlock = ({ product, itemPrice, quantity = 1 }) => {
  const { currencySymbol, formatPrice } = useRegionalSettings();
  const pricing = product?.new?.pricing || product?.modes?.buy?.pricing || {};

  const unitPrice = itemPrice || pricing?.price || product?.listingPrice || product?.price || 0;
  const qty = Math.max(1, Number(quantity) || 1);
  const price = unitPrice * qty;

  if (!price) return null;

  return (
    <div className="new-price">

      {/* EYEBROW */}
      <div className="new-price__label">
        Price · GST inclusive
      </div>

      {/* PRICE */}
      <div className="new-price__main">
       <sup>{currencySymbol}</sup>{formatPrice(price)}
      </div>

      {/* NOTE */}
      <div className="new-price__note">
        Standard 7-day return window applies
      </div>

    </div>
  );
};

export default NewPriceBlock;
