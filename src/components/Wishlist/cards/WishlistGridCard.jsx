
// src/components/Wishlist/cards/WishlistGridCard.jsx
import { useState } from "react";

import "../../../styles/wishlist/cards/wishlist-grid-card.css";

const WishlistGridCard = ({
  product,
  type,
  index,
}) => {
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  /* ====================================================== */
  /* SECTION 7.1 — CARD ENTRY ANIMATION */
  /* ====================================================== */

  const staggerDelays = [
    0.04,
    0.10,
    0.16,
    0.22,
    0.28,
    0.34,
    0.40,
    0.46,
  ];

  const animationDelay =
    index < 8
      ? `${staggerDelays[index]}s`
      : "0s";

  /* ====================================================== */
  /* SECTION 7.2 — CARD IMAGE AREA */
  /* ====================================================== */

  const getImageClass = () => {
    if (type === "rent") {
      return "desk-wishlist-card-image-rent";
    }

    if (type === "preloved") {
      return "desk-wishlist-card-image-preloved";
    }

    if (type === "new") {
      return "desk-wishlist-card-image-new";
    }
  };

  const getDesignerColor = () => {
    if (type === "rent") {
      return "rgba(232,213,176,0.3)";
    }

    if (type === "preloved") {
      return "rgba(138,126,114,0.35)";
    }

    if (type === "new") {
      return "rgba(107,126,90,0.3)";
    }
  };

  const getSvgStroke = () => {
    if (type === "rent") {
      return "#C9A96E";
    }

    if (type === "preloved") {
      return "#C9A96E";
    }

    if (type === "new") {
      return "#6B7E5A";
    }
  };

  const getSvgOpacity = () => {
    if (type === "rent") {
      return "0.22";
    }

    if (type === "preloved") {
      return "0.16";
    }

    if (type === "new") {
      return "0.20";
    }
  };

  /* ====================================================== */
  /* SECTION 7.3 — MODE STRIP */
  /* ====================================================== */

  const getModeStripClass = () => {
    if (type === "rent") {
      return "desk-wishlist-mode-strip-rent";
    }

    if (type === "preloved") {
      return "desk-wishlist-mode-strip-preloved";
    }

    if (type === "new") {
      return "desk-wishlist-mode-strip-new";
    }
  };

  const getModeStripText = () => {
    if (type === "rent") {
      return "RENT";
    }

    if (type === "preloved") {
      return "PRELOVED";
    }

    if (type === "new") {
      return "BUY NEW";
    }
  };

  const getModeStripTextColor = () => {
    if (type === "rent") {
      return "rgba(232,213,176,0.75)";
    }

    if (type === "preloved") {
      return "#B85C38";
    }

    if (type === "new") {
      return "#6B7E5A";
    }
  };

  /* ====================================================== */
  /* SECTION 7.4 — UNAVAILABILITY VEIL */
  /* ====================================================== */

  const isUnavailable = product.unavailable;

  /* ====================================================== */
  /* SECTION 7.5 — REMOVE HEART BUTTON */
  /* ====================================================== */

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    setIsHeartAnimating(true);
    setTimeout(() => {
      setIsHeartAnimating(false);
    }, 350);
  };

  return (
    <div
      className="desk-wishlist-grid-card"
      style={{
        animationDelay,
      }}
    >
      {/* ====================================================== */}
      {/* SECTION 7.2 — CARD IMAGE AREA */}
      {/* ====================================================== */}

      <div className="desk-wishlist-card-image-wrapper">

        <div className={`desk-wishlist-card-image ${getImageClass()}`}>
          <div className="desk-wishlist-card-image-inner">
            {/* Garment SVG */}
            <svg
              className="desk-wishlist-garment-svg"
              width="48"
              height="64"
              viewBox="0 0 48 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke={getSvgStroke()}
              strokeOpacity={getSvgOpacity()}
            >
              <path d="M24 8C20 8 16 12 16 16V20C16 24 18 28 24 28C30 28 32 24 32 20V16C32 12 28 8 24 8Z" />
              <path d="M16 20L12 32C12 36 14 40 18 42L24 44L30 42C34 40 36 36 36 32L32 20" />
              <path d="M24 28V44" />
              <path d="M12 36H36" />
            </svg>

            {/* Designer Label */}

            <span
              className="desk-wishlist-card-image-designer"
              style={{
                color:
                  getDesignerColor(),
              }}
            >
              {product.designer}
            </span>
          </div>


          {/* ====================================================== */}
          {/* SECTION 7.3 — MODE STRIP */}
          {/* ====================================================== */}

          <div
            className={`desk-wishlist-mode-strip ${getModeStripClass()}`}
          >

            <span
              className="desk-wishlist-mode-strip-text"
              style={{
                color:
                  getModeStripTextColor(),
              }}
            >
              {getModeStripText()}

              {product.stripTag && (
                <>
                  {" · "}
                  {product.stripTag}
                </>
              )}
            </span>

          </div>



          {/* ====================================================== */}
          {/* SECTION 7.4 — UNAVAILABILITY VEIL */}
          {/* ====================================================== */}

          {isUnavailable && (
            <div className="desk-wishlist-unavailability-veil">
              <span className="desk-wishlist-unavailability-text">
                Booked for your dates
              </span>
            </div>
          )}

          {/* ====================================================== */}
          {/* SECTION 7.5 — REMOVE HEART BUTTON */}
          {/* ====================================================== */}

          <button
            className={`desk-wishlist-remove-heart-btn ${isHeartAnimating
              ? "desk-wishlist-heart-pop"
              : ""
              }`}
            onClick={
              handleRemoveClick
            }
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4.5C12 2.5 10.5 1 8.5 1C7.3 1 6.2 1.6 5.5 2.5C4.8 1.6 3.7 1 2.5 1C0.5 1 -1 2.5 -1 4.5C-1 7 5.5 13 5.5 13C5.5 13 12 7 12 4.5Z"
                fill="#B85C38"
                transform="translate(1,0.5)"
              />
            </svg>
          </button>

          {/* ====================================================== */}
          {/* SECTION 7.6 — QUICK ADD BAR */}
          {/* ====================================================== */}

          {!isUnavailable && (
            <div className="desk-wishlist-quick-add-bar">
              <button className="desk-wishlist-quick-add-btn">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 4H10L9 10H3L2 4Z" />
                  <path d="M4 4V3C4 2 4.5 1 6 1C7.5 1 8 2 8 3V4" />
                </svg>
                <span>
                  ADD TO BAG
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ====================================================== */}
      {/* SECTION 7.7 — CARD BODY */}
      {/* ====================================================== */}

      <div className="desk-wishlist-card-body">
        {/* Designer Label */}
        <span className="desk-wishlist-card-designer-label">
          {product.designer}
        </span>

        {/* Product Name */}

        <h3 className="desk-wishlist-card-product-name">
          {product.name}
        </h3>

        {/* ====================================================== */}
        {/* CONDITION BADGE */}
        {/* ====================================================== */}

        {type === "preloved" && (
          <div
            className={`desk-wishlist-condition-badge ${product.condition === "Pristine condition"
              ? "desk-wishlist-condition-pristine"
              : product.condition === "Excellent condition"
                ? "desk-wishlist-condition-excellent"
                : "desk-wishlist-condition-good"
              }`}
          >
            {product.condition}
          </div>
        )}

        {/* Price Label */}

        <div className="desk-wishlist-price-label">
          {type === "rent"
            ? "Rental price"
            : type === "preloved"
              ? "Preloved price"
              : "Price"}
        </div>

        {/* Price */}

        <div className="desk-wishlist-price">
          ₹{product.price}
        </div>


        {/* ====================================================== */}
        {/* RENT META */}
        {/* ====================================================== */}

        {type === "rent" && !product.unavailable && (
          <div className="desk-wishlist-price-note">

            <span>
              {product.duration}
            </span>

            <span className="desk-wishlist-price-note-label">
              retail
            </span>

            <span className="desk-wishlist-struck-price">
              ₹{product.originalPrice}
            </span>

            <span className="desk-wishlist-save-badge">
              Save {product.savePercentage}
            </span>

          </div>
        )}

        {/* ====================================================== */}
        {/* RENT UNAVAILABLE */}
        {/* ====================================================== */}

        {type === "rent" && product.unavailable && (
          <div className="desk-wishlist-unavailability-note">
            {product.unavailableNote}
          </div>
        )}

        {/* ====================================================== */}
        {/* PRELOVED META */}
        {/* ====================================================== */}

        {type === "preloved" && (
          <div className="desk-wishlist-price-note">

            <span className="desk-wishlist-price-note-label">
              retail
            </span>

            <span className="desk-wishlist-struck-price">
              ₹{product.originalPrice}
            </span>

            <span className="desk-wishlist-save-badge">
              Save {product.savePercentage}
            </span>

          </div>
        )}

        {/* ====================================================== */}
        {/* NEW META */}
        {/* ====================================================== */}

        {type === "new" && (
          <div className="desk-wishlist-new-note">
            New with tags
          </div>
        )}

        {/* ====================================================== */}
        {/* SECTION 7.8 — CTA BUTTONS */}
        {/* ====================================================== */}

        <div className="desk-wishlist-card-cta-row">
          {/* Primary CTA */}
          <button
            className={`desk-wishlist-primary-cta ${product.unavailable
              ? "desk-wishlist-primary-cta-disabled"
              : ""
              }`}
          >
            {product.unavailable
              ? "Notify Me"
              : "Add to Bag"}
          </button>

          {/* Secondary CTA */}

          <button className="desk-wishlist-secondary-cta">
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 6.5C1 6.5 3 2.5 6.5 2.5C10 2.5 12 6.5 12 6.5C12 6.5 10 10.5 6.5 10.5C3 10.5 1 6.5 1 6.5Z" />
              <circle
                cx="6.5"
                cy="6.5"
                r="1.5"
              />
            </svg>
          </button>
        </div>

        {/* ====================================================== */}
        {/* SECTION 7.9 — SAVED DATE */}
        {/* ====================================================== */}

        <div className="desk-wishlist-saved-date">
          Saved {product.savedDate}
        </div>

        {/* ====================================================== */}
        {/* REMOVE LINK */}
        {/* ====================================================== */}

        <button className="desk-wishlist-remove-link">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 2H9" />
            <path d="M3 2V1H7V2" />
            <path d="M2 2L2.5 9H7.5L8 2" />
            <path d="M4 4V7" />
            <path d="M6 4V7" />
          </svg>
          REMOVE
        </button>
      </div>
    </div>
  );
};

export default WishlistGridCard;

