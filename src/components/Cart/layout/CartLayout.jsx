import React from "react";
import "../../../styles/cart/layout/cart-layout.css";
import { products, makeProductDetail } from "../../ProductList";


import {
  CartItem,
  OrderSummary,
  PromoCode,
  ModeSeparator
} from "../index";

const CartLayout = () => {
    const cartItems = [
  {
    id: 1,
    type: "rental",

    product: makeProductDetail(products[0]),

    booking: {
      size: "M",
      window: "standard",
      deliveryDate: "2026-04-12",
      eventDate: "2026-04-14",
      returnDate: "2026-04-16"
    }
  },

  {
    id: 2,
    type: "new",

    product: makeProductDetail(products[1])
  },

  {
    id: 3,
    type: "preloved",

    product: makeProductDetail(products[3])
  }
];
  return (
    <div className="cart-container">
      <div className="cart-layout">

        {/* LEFT SIDE */}
        <div className="cart-left">

          <ModeSeparator label="Rental Booking" type="rental" />

          {cartItems.map(item => (
            <CartItem key={item.id} item={item} />
          ))}

          <PromoCode />

        </div>

        {/* RIGHT SIDE */}
        <div className="cart-right">
          <OrderSummary />
        </div>

      </div>
    </div>
  );
};

export default CartLayout;