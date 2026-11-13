// src\components\Cart\items\modes\rental\RentalPriceBlock.jsx
import React from "react";
import { useRegionalSettings } from "../../../../../hooks/useRegionalSettings";
import "../../../../../styles/cart/items/price-block.css";

const RentalPriceBlock = ({ product, booking, itemPrice }) => {
  const { currencySymbol, formatPrice } = useRegionalSettings();
  const rent = product?.rent || product?.modes?.rent;

  // DERIVE DAYS FROM WINDOW OR DATES
  let days = booking?.rentalWindowDays;
  if (!days && booking?.deliveryDate && booking?.returnDate) {
    const start = new Date(booking.deliveryDate);
    const end = new Date(booking.returnDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    if (diff > 0) days = diff;
  }
  if (!days) days = 4;

  // PER DAY PRICE
  const rentalBase = Number(String(product?.rentalPrice || "").replace(/[^\d]/g, "")) || (days === 4 ? Number(String(itemPrice || "").replace(/[^\d]/g, "")) : 0);
  const perDay =
    (rentalBase > 0 ? Math.round(rentalBase / 4) : 0) ||
    rent?.pricing?.pricePerDay ||
    product?.perDayRate ||
    (itemPrice ? Math.round(Number(String(itemPrice).replace(/[^\d]/g, "")) / days) : 0);

  // TOTAL PRICE (MAIN CALCULATION)
  let totalPrice = (days && perDay) ? days * perDay : (itemPrice || rentalBase || 0);
  if (days === 4 && rentalBase > 0) {
    totalPrice = rentalBase;
  }

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
         <sup>{currencySymbol}</sup>{formatPrice(totalPrice)}
      </div>

      {/* NOTE */}
      {perDay > 0 && (
        <div className="cart-price__note">
          {currencySymbol}{formatPrice(perDay)} per day
        </div>
      )}

    </div>
  );
};

export default RentalPriceBlock;
