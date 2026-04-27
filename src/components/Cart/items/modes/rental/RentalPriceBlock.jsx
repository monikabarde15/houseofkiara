import React from "react";
import "../../../../../styles/cart/items/price-block.css";

const formatPrice = (num) =>
  new Intl.NumberFormat("en-IN").format(num);

const RentalPriceBlock = ({ product, booking }) => {
  const rent = product?.rent;

  const window = rent?.pricing?.windows?.[0];

  const totalPrice = window?.price || 0;
  const perDay = rent?.pricing?.pricePerDay || 0;
  const days = window?.days || 0;

  return (
    <div className="cart-price cart-price--rental">

      {/* EYEBROW */}
      <div className="cart-price__eyebrow">
        Rental fee · {days}-day window
      </div>

      {/* PRICE */}
      <div className="cart-price__value">
        <sup>₹</sup>{formatPrice(totalPrice)}
      </div>

      {/* NOTE */}
      <div className="cart-price__note">
        ₹{formatPrice(perDay)} per day
      </div>

    </div>
  );
};

export default RentalPriceBlock;