import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import WishlistLayout from "../../components/Wishlist/layout/WishlistLayout";
import MobileWishlistLayout from "../../components/Wishlist/mobile/layout/MobileWishlistLayout";
import useWishlistStore from "../../store/wishlistStore";
import useAuthStore from "../../store/authStore";
import "../../styles/wishlist/wishlist-page.css";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to view your wishlist");
      navigate("/auth", { replace: true });
    }
  }, [isAuthenticated, navigate]);

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="wishlist-page">
      {isMobile ? <MobileWishlistLayout /> : <WishlistLayout />}
    </div>
  );
};

export default WishlistPage;
