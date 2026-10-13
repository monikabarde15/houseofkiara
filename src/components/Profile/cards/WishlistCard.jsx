import React from "react";
import { Heart } from "lucide-react";
import "../../../styles/Profile/cards/WishlistCard.css";

const WishlistCard = ({ piece, onAddToBag, onViewProduct, onRemove }) => {
  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) onRemove(piece.id);
  };

  const handleAddToBag = (e) => {
    e.stopPropagation();
    if (onAddToBag) onAddToBag(piece);
  };

  const handleViewProduct = (e) => {
    e.stopPropagation();
    if (onViewProduct) onViewProduct(piece.id, piece);
  };

  const handleCardClick = () => {
    if (onViewProduct) onViewProduct(piece.id, piece);
  };

  return (
    <div
      className="profile-wc"
      onClick={handleCardClick}
    >
      <div className="profile-wc-thumb">
        {piece.image ? (
          <img
            src={piece.image}
            alt={piece.name}
            className="profile-wc-image"
          />
        ) : (
          <svg
            className="profile-wc-placeholder"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <rect
              x="4"
              y="4"
              width="16"
              height="16"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.22"
            />
          </svg>
        )}

        <button
          className="profile-wc-heart"
          onClick={handleRemove}
          title="Remove from saved"
          type="button"
        >
          <Heart size={12} fill="#B85C38" stroke="#B85C38" strokeWidth={1.5} />
        </button>

        <div className="profile-wc-cta-overlay">
          <button
            className="profile-wc-cta-add"
            onClick={handleAddToBag}
            type="button"
          >
            Add to Bag
          </button>
          <button
            className="profile-wc-cta-view"
            onClick={handleViewProduct}
            type="button"
          >
            View Product
          </button>
        </div>
      </div>

      <div className="profile-wc-body">
        <div className="profile-wc-name">{piece.name}</div>
        <div className="profile-wc-mode">{piece.condition || piece.mode}</div>
        <div className="profile-wc-price">
          ₹
          {piece.price
            ? Number(String(piece.price).replace(/,/g, "")).toLocaleString(
                "en-IN",
              )
            : "—"}
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
