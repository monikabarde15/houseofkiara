import React from "react";
import "../../../../../styles/cart/items/price-block.css";

const formatPrice = (num) =>
  new Intl.NumberFormat("en-IN").format(num);

const RentalPriceBlock = ({ product, booking }) => {
  const rent = product?.rent;

  // SOURCE OF TRUTH
  const days = booking?.rentalWindowDays || 0;

  // PER DAY PRICE
  const perDay = rent?.pricing?.pricePerDay || 0;

  // TOTAL PRICE (MAIN CALCULATION)
  const totalPrice = days * perDay;

  //  Safety fallback (avoid showing ₹0 UI)
  if (!days || !perDay) return null;

  return (
    <div className="cart-price cart-price--rental">

      {/* EYEBROW */}
      <div className="cart-price__eyebrow">
        Rental fee · {days}-DAY WINDOW
      </div>

      {/* PRICE */}
      <div className="cart-price__value">
        ₹{formatPrice(totalPrice)}
      </div>

      {/* NOTE */}
      <div className="cart-price__note">
        ₹{formatPrice(perDay)} / day
      </div>

    </div>
  );
};

export default RentalPriceBlock;