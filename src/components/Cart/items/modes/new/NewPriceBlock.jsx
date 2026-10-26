// src\components\Cart\items\modes\new\NewPriceBlock.jsx
import React from "react";
import "../../../../../styles/cart/items/price-block.css";

const NewPriceBlock = ({ product }) => {
  const pricing = product?.new?.pricing || product?.modes?.buy?.pricing || {};

  const price = pricing?.price || product?.listingPrice || product?.price || 0;

  if (!price) return null;

  return (
    <div className="new-price">

      {/* EYEBROW */}
      <div className="new-price__label">
        Price · GST inclusive
      </div>

      {/* PRICE */}
      <div className="new-price__main">
       <sup>₹</sup>{price.toLocaleString()}
      </div>

      {/* NOTE */}
      <div className="new-price__note">
        Standard 7-day return window applies
      </div>

    </div>
  );
};

export default NewPriceBlock;