import React from "react";
import "../../../styles/cart/layout/cart-header.css";

const CartHeader = () => {

  const itemCount = 3; // temporary (later from store)

  return (
    <div className="cart-header-wrapper">
      <div className="cart-container">

        <div className="cart-header">

          {/* LEFT: TITLE */}
          <h1 className="cart-title">
            Your <em>Cart</em>
          </h1>

          {/* RIGHT: COUNT */}
          <div className="cart-count">
            {itemCount} pieces selected
          </div>

        </div>

      </div>
    </div>
  );
};

export default CartHeader;