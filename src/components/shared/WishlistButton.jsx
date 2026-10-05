import React from "react";
import { Heart } from "lucide-react";

import useWishlistStore from "../../store/wishlistStore";
import "../../styles/shared/WishlistButton.css";

const WishlistButton = ({ productId }) => {
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
