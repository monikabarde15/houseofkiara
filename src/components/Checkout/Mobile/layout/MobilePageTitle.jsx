import React from "react";
import "../../../../styles/checkout/mobile/layout/mobile-page-title.css";

const MobilePageTitle = ({
  cartItems = [],
  grandTotal = 0,
}) => {
  const pieceCount = cartItems.length;

  return (
    <div className="mobile-page-title" data-rise="1">
      {/* LEFT: H1 */}
      <h1 className="mobile-page-title__heading">
        Secure <em>Checkout</em>
      </h1>

      {/* RIGHT NOTE - TWO LINES as per mobile spec */}
      <div className="mobile-page-title__note">
        {pieceCount} {pieceCount === 1 ? "piece" : "pieces"}
        <br />
        ₹{grandTotal.toLocaleString()}
      </div>
    </div>
  );
};

export default MobilePageTitle;