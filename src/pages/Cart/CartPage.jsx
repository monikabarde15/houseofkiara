import { useState, useEffect } from "react";
import CartLayout from "../../components/Cart/layout/CartLayout";
import MobileCartLayout from "../../components/Cart/Mobile/layout/MobileCartLayout";
import "../../styles/cart/cart.css";

const CartPage = () => {
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
    <div className="cart-page">
      {isMobile ? <MobileCartLayout /> : <CartLayout />}
    </div>
  );
};

export default CartPage;