import React from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import useWishlistStore from "../../store/wishlistStore";
import useAuthStore from "../../store/authStore";
import "../../styles/shared/WishlistButton.css";

const WishlistButton = ({ productId }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isWishlisted = productId 
    ? wishlistItems.some(id => String(id) === String(productId))
    : false;

  return (
    <button
      type="button"
      className="hok-wishlist-btn"
      aria-label="Toggle wishlist"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
          toast.error("Please login to use your wishlist");
          navigate("/auth");
          return;
        }
        if (productId) {
          toggleWishlist(productId);
        }
      }}
    >
      <Heart 
        className={isWishlisted ? "active" : ""}
        style={{
          fill: isWishlisted ? "#B85C38" : "none",
          stroke: isWishlisted ? "#B85C38" : "currentColor",
          color: isWishlisted ? "#B85C38" : "inherit"
        }}
      />
    </button>
  );
};

export default WishlistButton;
