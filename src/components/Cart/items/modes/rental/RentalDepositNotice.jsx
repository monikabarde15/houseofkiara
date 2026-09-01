// src\components\Cart\items\modes\rental\RentalDepositNotice.jsx
import React from "react";
import "../../../../../styles/cart/items/disclosure-notice.css";

const DepositNotice = ({ product }) => {

  
    const deposit = product?.rent?.deposit;

    const amount = deposit?.amount;
    const returnDays = deposit?.returnDays;

  return (
    <div className="cart-deposit">

      <p className="cart-deposit__text">
        <span className="cart-deposit__amount">
          ₹{amount} refundable security deposit
        </span>
        {" "}
        — not collected at checkout. Our team will reach out via WhatsApp before dispatch. Refunded in full within {returnDays-2}-{returnDays} business days of return inspection.
      </p>

    </div>
  );
};

export default DepositNotice;