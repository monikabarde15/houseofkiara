// src\components\Cart\items\modes\new\NewPriceBlock.jsx
import React from "react";
import "../../../../../styles/cart/items/price-block.css";

const cleanPrice = (price) => {
  if (!price) return 0;
  return Number(String(price).replace(/[^\d]/g, ""));
};

const NewPriceBlock = ({ item, product }) => {
  const pricing = product?.new?.pricing || {};

  const price = pricing?.price || cleanPrice(product?.price) || cleanPrice(item?.price) || 0;

  return (
    <div className="new-price">
      {/* EYEBROW */}
      <div className="new-price__label">Price · GST inclusive</div>

      {/* PRICE */}
      <div className="new-price__main">
        <sup>₹</sup>
        {price.toLocaleString()}
      </div>

      {/* NOTE */}
      <div className="new-price__note">
        Standard 7-day return window applies
      </div>
    </div>
  );
};

export default NewPriceBlock;
