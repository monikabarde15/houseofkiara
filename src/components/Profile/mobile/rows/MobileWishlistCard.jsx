import { Heart } from "lucide-react";

import "../../../../styles/Profile/mobile/rows/MobileWishlistCard.css";

const MobileWishlistCard = ({
  piece,
  onAddToBag,
  onViewProduct,
  onRemove
}) => {
  const handleRemove = (e) => {
    e.stopPropagation();

    onRemove(piece.id);
  };

  const handleAddToBag = (e) => {
    e.stopPropagation();

    const needsSize =
      piece.sizes &&
      piece.sizes.length > 1;

    const needsColor =
      piece.colors &&
      piece.colors.length > 1;

    const isRental =
      piece.mode === "Rental";

    const needsModal =
      needsSize ||
      needsColor ||
      isRental;

    if (needsModal) {
      onAddToBag(piece);

      return;
    }

    /*
      TODO:
      Direct add-to-bag integration
    */
  };

  const handleViewProduct = (e) => {
    e.stopPropagation();

    onViewProduct(piece.id);
  };

  return (
    <article
      className="profile-mobile-wl-item"
    >
      {/* =========================================
          Product Thumbnail
         ========================================= */}

      <div
        className="profile-mobile-wl-thumb"
        style={{
          "--wl-bg": piece.imageGradient
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="3"
            width="16"
            height="16"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>

        {/* =========================================
            Wishlist Remove Button
           ========================================= */}

        <button
          type="button"
          className="profile-mobile-wl-heart"
          onClick={handleRemove}
          aria-label="Remove from wishlist"
        >
          <Heart
            className="profile-mobile-wl-heart-icon"
            strokeWidth={1.7}
          />
        </button>
      </div>

      {/* =========================================
          Product Metadata
         ========================================= */}

      <div className="profile-mobile-wl-name">
        {piece.name}
      </div>

      <div className="profile-mobile-wl-price">
        {piece.mode === "Rental"
          ? `₹${piece.price.toLocaleString()} / booking`
          : `₹${piece.price.toLocaleString()}`}
      </div>

      <div className="profile-mobile-wl-mode">
        {piece.mode}
      </div>

      {/* =========================================
          CTA Row
         ========================================= */}

      <div className="profile-mobile-wl-buttons">
        <button
          type="button"
          className="profile-mobile-wl-btn-add"
          onClick={handleAddToBag}
        >
          Add to Bag
        </button>

        <button
          type="button"
          className="profile-mobile-wl-btn-view"
          onClick={handleViewProduct}
        >
          View Product
        </button>
      </div>
    </article>
  );
};

export default MobileWishlistCard;