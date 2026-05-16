// src\pages\Checkout\CheckoutPage.jsx
import { useState, useEffect } from "react";
import CheckoutLayout from "../../components/Checkout/layout/CheckoutLayout";
import MobileCheckoutLayout from "../../components/Checkout/Mobile/layout/MobileCheckoutLayout";
import ProgressStrip from "../../components/Checkout/layout/ProgressStrip";  // ← ADD THIS
import "../../styles/checkout/checkout-page.css";

const CheckoutPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 430px)");
    
    const handleChange = (e) => {
      setIsMobile(e.matches);
    };
    
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="checkout-page">
      {isMobile ? (
        <MobileCheckoutLayout />
      ) : (
        <>
          {/* Progress strip - OUTSIDE container, matches confirmation page pattern */}
          <ProgressStrip />
          
          <div className="checkout-container">
            <CheckoutLayout />
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;