// src/components/Wishlist/cards/WishlistListCard.jsx

import { useState, useRef } from "react";

import "../../../styles/wishlist/cards/wishlist-list-card.css";

const WishlistListCard = ({ product, type, onRemove, onShowToast,  onShowGeneralToast,onOpenModal ,isRestored }) => {
    const [isHeartAnimating, setIsHeartAnimating] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isCollapsing, setIsCollapsing] = useState(false);
    const cardRef = useRef(null);

// Handle Add to Bag click
  const handleAddToBagClick = (e) => {
    e.stopPropagation();
    if (onOpenModal) {
      onOpenModal(product, type);
    }
  };

    /* ====================================================== */
    /* IMAGE AREA */
    /* ====================================================== */

    const getImageClass = () => {
        if (type === "rent") {
            return "desk-wishlist-list-image-rent";
        }

        if (type === "preloved") {
            return "desk-wishlist-list-image-preloved";
        }

        return "desk-wishlist-list-image-new";
    };

    const getDesignerColor = () => {
        if (type === "rent") {
            return "rgba(232,213,176,0.3)";
        }

        if (type === "preloved") {
            return "rgba(138,126,114,0.35)";
        }

        return "rgba(107,126,90,0.3)";
    };

    const getSvgStroke = () => {
        if (type === "new") {
            return "#6B7E5A";
        }

        return "#C9A96E";
    };

    const getSvgOpacity = () => {
        if (type === "rent") {
            return "0.22";
        }

        if (type === "preloved") {
            return "0.16";
        }

        return "0.20";
    };

    /* ====================================================== */
    /* MODE STRIP */
    /* ====================================================== */

    const getModeStripClass = () => {
        if (type === "rent") {
            return "desk-wishlist-list-mode-strip-rent";
        }

        if (type === "preloved") {
            return "desk-wishlist-list-mode-strip-preloved";
        }

        return "desk-wishlist-list-mode-strip-new";
    };

    const getModeStripText = () => {
        if (type === "rent") {
            return "RENT";
        }

        if (type === "preloved") {
            return "PRELOVED";
        }

        return "BUY NEW";
    };

    const getModeStripTextColor = () => {
        if (type === "rent") {
            return "rgba(232,213,176,0.75)";
        }

        if (type === "preloved") {
            return "#B85C38";
        }

        return "#6B7E5A";
    };

    /* ====================================================== */
    /* REMOVE */
    /* ====================================================== */

    const handleRemoveClick = (e) => {
        e.stopPropagation();

        /* STEP 1: Heart pop animation */
        setIsHeartAnimating(true);

        /* STEP 7: Show undo toast immediately */
        if (onShowToast) {
            onShowToast();
        }

        /* STEP 2: After 150ms delay, card begins to animate out */
        setTimeout(() => {
            setIsRemoving(true);

            /* STEP 3: After 280ms, collapse height */
            setTimeout(() => {
                if (cardRef.current) {
                    const height = cardRef.current.offsetHeight;
                    cardRef.current.style.maxHeight = `${height}px`;
                    cardRef.current.offsetHeight;
                    setIsCollapsing(true);
                    cardRef.current.style.maxHeight = "0";
                    cardRef.current.style.paddingTop = "0";
                    cardRef.current.style.paddingBottom = "0";
                    cardRef.current.style.marginTop = "0";
                    cardRef.current.style.marginBottom = "0";

                    /* STEP 4: After 350ms, remove from DOM */
                    setTimeout(() => {
                        if (onRemove) {
                            onRemove(product.id, product);
                        }
                    }, 350);
                }
            }, 280);
        }, 150);

        /* Remove heart animation class */
        setTimeout(() => {
            setIsHeartAnimating(false);
        }, 350);
    };


    const isUnavailable = product.unavailable;

    return (
        <div
  ref={cardRef}
  className={`desk-wishlist-list-card
    ${isRemoving ? "desk-wishlist-card-removing" : ""}
    ${isCollapsing ? "desk-wishlist-card-collapsing" : ""}
    ${isRestored ? "desk-wishlist-card-restore" : ""}
  `}
>

            {/* ====================================================== */}
            {/* SECTION 8.3 — IMAGE COLUMN */}
            {/* ====================================================== */}

            <div className="desk-wishlist-list-image-column">

                <div className="desk-wishlist-list-image-wrapper">

                    <div
                        className={`desk-wishlist-list-image ${getImageClass()}`}
                    >

                        <div className="desk-wishlist-list-image-inner">

                            <svg
                                className="desk-wishlist-list-garment-svg"
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

                            <span
                                className="desk-wishlist-list-image-designer"
                                style={{
                                    color: getDesignerColor(),
                                }}
                            >
                                {product.designer}
                            </span>

                        </div>

                        {/* MODE STRIP */}


                        <div
                            className={`desk-wishlist-list-mode-strip ${getModeStripClass()}`}
                        >
                            <span
                                className="desk-wishlist-list-mode-strip-text"
                                style={{
                                    color: getModeStripTextColor(),
                                }}
                            >
                                {getModeStripText()}
                            </span>

                            {product.stripTag && (
                                <span
                                    className="desk-wishlist-list-mode-strip-tag"
                                    style={{
                                        color: getModeStripTextColor(),
                                    }}
                                >
                                    {product.stripTag}
                                </span>
                            )}
                        </div>

                        {/* UNAVAILABLE */}

                        {isUnavailable && (
                            <div className="desk-wishlist-list-unavailability-veil">

                                <span className="desk-wishlist-list-unavailability-text">
                                    Booked for your dates
                                </span>

                            </div>
                        )}

                        {/* HEART */}

                        <button
                            className={`desk-wishlist-list-remove-heart-btn ${isHeartAnimating
                                ? "desk-wishlist-list-heart-pop"
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

                    </div>

                </div>

            </div>

            {/* ====================================================== */}
            {/* SECTION 8.4 — MAIN COLUMN */}
            {/* ====================================================== */}

            <div className="desk-wishlist-list-main-column">

                <div>

                    <span className="desk-wishlist-list-designer-label">
                        {product.designer}
                    </span>

                    <h3 className="desk-wishlist-list-product-name">
                        {product.name}
                    </h3>

                    {type === "preloved" && (
                        <div
                            className={`desk-wishlist-list-condition-badge ${product.condition ===
                                "Pristine condition"
                                ? "desk-wishlist-list-condition-pristine"
                                : product.condition ===
                                    "Excellent condition"
                                    ? "desk-wishlist-list-condition-excellent"
                                    : "desk-wishlist-list-condition-good"
                                }`}
                        >
                            {product.condition}
                        </div>
                    )}

                </div>

                <div className="desk-wishlist-list-bottom-meta">

                    <div className="desk-wishlist-list-saved-date">
                        Saved {product.savedDate}
                    </div>

                    <button
                        className="desk-wishlist-list-remove-link"
                        onClick={handleRemoveClick}
                    >
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

            {/* ====================================================== */}
            {/* SECTION 8.5 — ASIDE COLUMN */}
            {/* ====================================================== */}

            <div className="desk-wishlist-list-aside-column">

                <div>

                    {type === "preloved" && (
                        <div
                            className={`desk-wishlist-list-aside-condition ${product.condition === "Pristine condition"
                                ? "desk-wishlist-list-condition-pristine"
                                : product.condition === "Excellent condition"
                                    ? "desk-wishlist-list-condition-excellent"
                                    : "desk-wishlist-list-condition-good"
                                }`}
                        >
                            {product.condition}
                        </div>
                    )}

                    <div className="desk-wishlist-list-price-label">
                        {type === "rent"
                            ? "Rental price"
                            : type === "preloved"
                                ? "Preloved price"
                                : "Price"}
                    </div>

                    <div className="desk-wishlist-list-price">
                        ₹{product.price}
                    </div>

                    {/* RENT */}

                    {type === "rent" &&
                        !isUnavailable && (
                            <div className="desk-wishlist-list-price-note">

                                <span>
                                    {product.duration}
                                </span>

                                <span className="desk-wishlist-list-price-note-label">
                                    retail
                                </span>

                                <span className="desk-wishlist-list-struck-price">
                                    ₹{product.originalPrice}
                                </span>

                                {/* <span className="desk-wishlist-list-save-badge">
                                    Save {product.savePercentage}
                                </span> */}

                            </div>
                        )}

                    {/* RENT UNAVAILABLE */}

                    {type === "rent" &&
                        isUnavailable && (
                            <div className="desk-wishlist-list-unavailability-note">
                                {product.unavailableNote}
                            </div>
                        )}

                    {/* PRELOVED */}



                    {type === "preloved" && (
                        <div className="desk-wishlist-list-price-note">

                            <span className="desk-wishlist-list-price-note-label">
                                retail
                            </span>

                            <span className="desk-wishlist-list-struck-price">
                                ₹{product.originalPrice}
                            </span>

                            <span className="desk-wishlist-list-save-badge">
                                Save {product.savePercentage}
                            </span>

                        </div>
                    )}

                    {/* NEW */}

                    {type === "new" && (
                        <div className="desk-wishlist-list-new-note">
                            New with tags
                        </div>
                    )}

                </div>

                <div className="desk-wishlist-list-cta-container">

                    <button
                        className={`desk-wishlist-list-primary-cta ${isUnavailable
                            ? "desk-wishlist-list-primary-cta-disabled"
                            : ""
                            }`}
                            onClick={!isUnavailable ? handleAddToBagClick : undefined}
                    >
                        {isUnavailable
                            ? "Notify Me"
                            : "Add to Bag"}
                    </button>

                </div>

            </div>

        </div>
    );
};

export default WishlistListCard;

