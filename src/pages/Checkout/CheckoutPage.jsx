// src\pages\Checkout\CheckoutPage.jsx
import { useState, useEffect } from "react";
import CheckoutLayout from "../../components/Checkout/layout/CheckoutLayout";
import MobileCheckoutLayout from "../../components/Checkout/Mobile/layout/MobileCheckoutLayout";
import "../../styles/checkout/checkout-page.css";

const CheckoutPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 430px)");
    
    const handleChange = (e) => {
      setIsMobile(e.matches);
    };
    
    // Set initial value
    setIsMobile(mediaQuery.matches);
    
    // Add listener
    mediaQuery.addEventListener("change", handleChange);
    
    // Cleanup
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {isMobile ? <MobileCheckoutLayout /> : <CheckoutLayout />}
      </div>
    </div>
  );
};

export default CheckoutPage;