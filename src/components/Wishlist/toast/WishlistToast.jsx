// src/components/Wishlist/toast/WishlistToast.jsx
// Section 9.6: General Toast (All Other Actions)

import { useEffect, useState } from "react";
import "../../../styles/wishlist/toast/wishlist-toast.css";

const WishlistToast = ({ message, onClose }) => {
  const [isDismissing, setIsDismissing] = useState(false);

  // Auto-dismiss after 3 seconds with animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDismissing(true);
      setTimeout(() => {
        onClose();
      }, 250);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`desk-wishlist-general-toast ${isDismissing ? 'desk-wishlist-general-toast-dismiss' : ''}`}>
      <svg 
        className="desk-wishlist-general-toast-icon"
        width="13" 
        height="13" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline 
          points="20 6 9 17 4 12" 
          stroke="currentColor" 
          strokeWidth="1.8" 
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      
      <span className="desk-wishlist-general-toast-message">
        {message}
      </span>
    </div>
  );
};

export default WishlistToast;