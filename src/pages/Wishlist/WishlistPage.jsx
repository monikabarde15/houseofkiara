import { useState, useEffect } from "react";
import WishlistLayout from "../../components/Wishlist/layout/WishlistLayout";
import MobileWishlistLayout from "../../components/Wishlist/mobile/layout/MobileWishlistLayout";
import useWishlistStore from "../../store/wishlistStore";
import "../../styles/wishlist/wishlist-page.css";

const WishlistPage = () => {
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

  useEffect(() => {
    // Clear unseen items count when user views the wishlist page
    useWishlistStore.getState().clearUnseenCount();
  }, []);

  return (
    <div className="wishlist-page">
      {isMobile ? <MobileWishlistLayout /> : <WishlistLayout />}
    </div>
  );
};

export default WishlistPage;