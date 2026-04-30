import React from "react";
import "../../../../../styles/cart/items/price-block.css";

const NewPriceBlock = ({ product }) => {
  const pricing = product?.new?.pricing || {};

  const price = pricing?.price || 0;

  return (
    <div className="new-price">

      {/* EYEBROW */}
      <div className="new-price__label">
        PRICE · GST INCLUDED
      </div>

      {/* PRICE */}
      <div className="new-price__main">
        ₹{price.toLocaleString()}
      </div>

      {/* NOTE */}
      <div className="new-price__note">
        Standard 7-day return window applies
      </div>

    </div>
  );
};

export default NewPriceBlock;