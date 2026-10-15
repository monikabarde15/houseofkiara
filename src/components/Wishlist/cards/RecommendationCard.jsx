import { useState } from "react";
import "../../../styles/wishlist/cards/recommendation-card.css";

const RecommendationCard = ({
  product,
  type,
  onSaveToWishlist,
  onShowToast,
}) => {
  const [isSaved, setIsSaved] =
    useState(false);

  const handleSaveClick = (e) => {
    e.stopPropagation();

    if (isSaved) return;

    setIsSaved(true);

    onSaveToWishlist?.(product);

    onShowToast?.(
      `"${product.name}" added to your wishlist`
    );
  };

  const handleCardClick = () => {
    console.log("Open Product");
  };

  return (
    <article
      className="desk-wishlist-rec-card"
      onClick={handleCardClick}
    >
      <div className="desk-wishlist-rec-image-wrapper">
        <div className="desk-wishlist-rec-image">
          <div className="desk-wishlist-rec-image-inner">
            <svg
              className="desk-wishlist-rec-garment-svg"
              width="36"
              height="48"
              viewBox="0 0 48 64"
              fill="none"
            >
              <path d="M24 8C20 8 16 12 16 16V20C16 24 18 28 24 28C30 28 32 24 32 20V16C32 12 28 8 24 8Z" />
              <path d="M16 20L12 32C12 36 14 40 18 42L24 44L30 42C34 40 36 36 36 32L32 20" />
              <path d="M24 28V44" />
              <path d="M12 36H36" />
            </svg>
          </div>
        </div>

        <button
          className={`desk-wishlist-rec-save-btn ${
            isSaved
              ? "desk-wishlist-rec-save-btn-saved"
              : ""
          }`}
          onClick={handleSaveClick}
          aria-label="Save to wishlist"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 14 14"
          >
            <path d="M12 4.5C12 2.5 10.5 1 8.5 1C7.3 1 6.2 1.6 5.5 2.5C4.8 1.6 3.7 1 2.5 1C0.5 1 -1 2.5 -1 4.5C-1 7 5.5 13 5.5 13C5.5 13 12 7 12 4.5Z" />
          </svg>
        </button>
      </div>

      <div className="desk-wishlist-rec-content">
        <div className="desk-wishlist-rec-mode-label">
          {type.toUpperCase()}
        </div>

        <div className="desk-wishlist-rec-designer-label">
          {product.designer}
        </div>

        <h3 className="desk-wishlist-rec-product-name">
          {product.name}
        </h3>

        <span className="desk-wishlist-rec-price-label">
          {type === "rent"
            ? "From"
            : "Buy"}
        </span>

        <div className="desk-wishlist-rec-price">
          ₹{product.price}

          {type === "rent" && (
            <span className="desk-wishlist-rec-price-suffix">
              / 4 days
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default RecommendationCard;