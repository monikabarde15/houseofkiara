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

  const getCountText = () => {
    if (itemCount === 0) return "Cart is empty";

    const base =
      itemCount === 1 ? "1 piece" : `${itemCount} pieces`;

    return basketLabel ? `${base} · ${basketLabel}` : base;
  };

  return (
    <div className="cart-header-wrapper">

        <div className="cart-header">

          {/* LEFT: TITLE */}
          <h1 className="cart-title">
            Your <em>Cart</em>
          </h1>

          {/* RIGHT: COUNT */}
          <div className="cart-count">
            <span className="cart-count__base">
              {itemCount === 1 ? "1 piece" : `${itemCount} pieces`}
            </span>

            {basketLabel && (
              <span className="cart-count__label">
                · {basketLabel}
              </span>
            )}
          </div>

        </div>

      
    </div>
  );
};

export default CartHeader;