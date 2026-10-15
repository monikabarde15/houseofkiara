// src\components\Cart\items\modes\rental\RentalPriceBlock.jsx
import React from "react";
import "../../../../../styles/cart/items/price-block.css";

const formatPrice = (num) =>
  new Intl.NumberFormat("en-IN").format(num);

const RentalPriceBlock = ({ product, booking }) => {
  const rent = product?.rent || product?.modes?.rent;

  // SOURCE OF TRUTH
  const days = booking?.rentalWindowDays || 4;

  // PER DAY PRICE
  const perDay =
    rent?.pricing?.pricePerDay ||
    product?.perDayRate ||
    (product?.rentalPrice ? Math.round(product.rentalPrice / 4) : 0);

  // TOTAL PRICE (MAIN CALCULATION)
  const totalPrice = (days && perDay) ? days * perDay : (product?.rentalPrice || 0);

  // Safety fallback (avoid showing ₹0 UI)
  if (!totalPrice) return null;

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
      {perDay > 0 && (
        <div className="cart-price__note">
          ₹{formatPrice(perDay)} per day
        </div>
      )}

    </div>
  );
};

export default RentalPriceBlock;