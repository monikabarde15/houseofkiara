// src\components\Cart\items\modes\rental\RentalPriceBlock.jsx
import React from "react";
import "../../../../../styles/cart/items/price-block.css";

const formatPrice = (num) => new Intl.NumberFormat("en-IN").format(num);

const cleanPrice = (price) => {
  if (!price) return 0;
  return Number(String(price).replace(/[^\d]/g, ""));
};

const RentalPriceBlock = ({ item, product, booking }) => {
  const rent = product?.rent;

  let days = booking?.rentalWindowDays || 0;
  if (!days && booking?.deliveryDate && booking?.returnDate) {
    const start = new Date(booking.deliveryDate);
    const end = new Date(booking.returnDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    days = diff > 0 ? diff : 0;
  }
  if (!days) days = 4;

  // PER DAY PRICE
  const perDay = rent?.pricing?.pricePerDay || cleanPrice(item?.price) / 4 || 0;

  // TOTAL PRICE (MAIN CALCULATION)
  const totalPrice = days * perDay;

  //  Safety fallback (avoid showing ₹0 UI)
  if (!days || !perDay) return null;

  return (
    <div className="cart-price cart-price--rental">
      {/* EYEBROW */}
      <div className="cart-price__eyebrow">Rental fee · {days}-day window</div>

      {/* PRICE */}
      <div className="cart-price__value">
        <sup>₹</sup>
        {formatPrice(totalPrice)}
      </div>

      {/* NOTE */}
      <div className="cart-price__note">₹{formatPrice(perDay)} per day</div>
    </div>
  );
};

export default RentalPriceBlock;
