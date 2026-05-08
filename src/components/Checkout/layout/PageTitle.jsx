// src\components\Checkout\layout\PageTitle.jsx
import "../../../styles/checkout/layout/page-title.css";

const PageTitle = ({
  cartItems = [],
  grandTotal = 0,
  deliveryType = "standard",
}) => {

  const pieceCount = cartItems.length;

  return (
    <div className="page-title">

      {/* LEFT: H1 */}
      <h1 className="page-title__heading">
        Secure <em>Checkout</em>
      </h1>

      {/* RIGHT NOTE */}
      <div className="page-title__note">

        {pieceCount} {pieceCount === 1 ? "piece" : "pieces"}
        {" · "}

        ₹{grandTotal.toLocaleString()} due today ·{" "}

        <span className="page-title__note-sub">

          {deliveryType === "express"
            ? "incl. express delivery"
            : "incl. free standard delivery"}

        </span>

      </div>

    </div>
  );
};

export default PageTitle;