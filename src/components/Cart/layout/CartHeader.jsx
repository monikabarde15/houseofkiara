import React from "react";
import "../../../styles/cart/layout/cart-header.css";

const CartHeader = ({ cartItems }) => {


const activeItems = cartItems.filter(item => item.active !== false);

const itemCount = activeItems.length;

// get unique types
const uniqueTypes = [...new Set(activeItems.map(item => item.type))];

let basketLabel = "";

if (uniqueTypes.length === 1) {
  basketLabel = uniqueTypes[0].toUpperCase(); // RENTAL / PRELOVED / NEW
} else if (uniqueTypes.length > 1) {
  basketLabel = "MIXED BASKET";
}

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
            {itemCount} PIECE{itemCount > 1 ? "S" : ""} · {basketLabel}
          </div>

        </div>

      </div>
    </div>
  );
};

export default CartHeader;