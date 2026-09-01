import React from "react";
import { Heart } from "lucide-react";

import "../../styles/shared/WishlistButton.css";

const WishlistButton = () => {
  return (
    <button
      type="button"
      className="hok-wishlist-btn"
      aria-label="Add to wishlist"
    >
      <Heart />
    </button>
  );
};

export default WishlistButton;