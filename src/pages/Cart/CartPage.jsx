// src\pages\Cart\CartPage.jsx

import React from "react";
import "../../styles/pages/cart.css";

// Components
import {
  CartLayout,
  PolicyStrip
} from "../../components/Cart";


const CartPage = () => {
  return (
    <div className="cart-page">

      {/* Page Header */}
      {/* <CartHeader /> */}

      {/* Main Layout */}
      <CartLayout />

      {/* Bottom Policy Section */}
      <PolicyStrip />

    </div>
  );
};

export default CartPage;