// src\components\Cart\items\CartItem.jsx
import { useEffect, useState } from "react";
import CartItemDesktop from "./CartItemDesktop";
import CartItemMobile from "./CartItemMobile";

const CartItem = (props) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 430);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 430);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile
    ? <CartItemMobile {...props} />
    : <CartItemDesktop {...props} />;
};

export default CartItem;