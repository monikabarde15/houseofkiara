import React from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import useWishlistStore from "../../store/wishlistStore";
import useAuthStore from "../../store/authStore";
import "../../styles/shared/WishlistButton.css";

const WishlistButton = ({ productId, product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  const targetId = String(productId || product?.sku || product?.productId || product?._id || product?.id || "");
  const prodSku = String(product?.sku || "");
  const prodDbId = String(product?._id || "");
  const prodPid = String(product?.productId || "");

  const isWishlisted = targetId
    ? wishlistItems.some((id) => {
        const sid = String(id);
        return (
          sid === targetId ||
          (prodSku && sid === prodSku) ||
          (prodDbId && sid === prodDbId) ||
          (prodPid && sid === prodPid)
        );
      })
    : false;

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to use your wishlist");
      navigate("/auth");
      return;
    }

    if (targetId) {
      const willBeActive = !isWishlisted;
      toggleWishlist(targetId, product);

      if (willBeActive) {
        toast.success("Added to your wishlist");
      } else {
        toast("Removed from your wishlist", {
          icon: "✕",
        });
      }
    }
  };

  return (
    <button
      type="button"
      className={`hok-wishlist-btn ${isWishlisted ? "active" : ""}`}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      onClick={handleToggle}
    >
      <Heart
        className={isWishlisted ? "active" : ""}
        style={{
          fill: isWishlisted ? "#B85C38" : "none",
          stroke: isWishlisted ? "#B85C38" : "#1a1612",
          color: isWishlisted ? "#B85C38" : "#1a1612",
          transition: "all 0.2s ease",
        }}
      />
    </button>
  );
};

export default WishlistButton;
