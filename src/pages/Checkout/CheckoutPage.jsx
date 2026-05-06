// CheckoutPage.jsx

import CheckoutLayout from "../../components/Checkout/layout/CheckoutLayout";
import "../../styles/checkout/checkout-page.css";

const CheckoutPage = () => {
  return (
    <div className="checkout-page">

      {/* Page Container */}
      <div className="checkout-container">
        <CheckoutLayout />
      </div>

    </div>
  );
};

export default CheckoutPage;