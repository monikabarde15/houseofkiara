import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/maincategorypage/mobile/mobile-product-card.css";
import { makeProductDetail } from "../../ProductList";

const MobileProductCard = ({ item, onWishlistToggle }) => {
  
  const navigate = useNavigate();
  // Helper to format price
  const formatPrice = (price) => {
    if (!price) return "£0";
    return `₹${price}`;
  };

  // Determine mode and styling
  const getModeDetails = () => {
    if (item.rent) {
      return {
        type: "rent",
        label: "Rent",
        badgeClass: "mob-card__badge--rent",
        priceMain: formatPrice(item.rentPrice),
        priceSub: "4 days",
      };
    }
    if (item.preloved) {
      return {
        type: "preloved",
        label: "Preloved",
        badgeClass: "mob-card__badge--preloved",
        priceMain: formatPrice(item.buyPrice),
        priceSub: item.originalPrice ? `retail ${formatPrice(item.originalPrice)}` : "",
      };
    }
    if (item.isNew) {
      return {
        type: "new",
        label: "New",
        badgeClass: "mob-card__badge--new",
        priceMain: formatPrice(item.buyPrice),
        priceSub: "",
      };
    }
    return {
      type: "rent",
      label: "Rent",
      badgeClass: "mob-card__badge--rent",
      priceMain: formatPrice(item.rentPrice),
      priceSub: "4 days",
    };
  };

  const mode = getModeDetails();
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    if (onWishlistToggle) {
      onWishlistToggle(item.id, !isWishlisted);
    }
  };

  const handleCardClick = () => {
    const { rent, preloved, isNew } = item;
    const productData = makeProductDetail(item);
    /*TEMP FIX STILL APPLIES FOR ID*/

    if (rent && preloved) {
      navigate(`/rentalandpreloved/1`, { state: { product: productData } });
    }
    else if (rent && isNew) {
      navigate(`/rentalandbuy/1`, { state: { product: productData } });
    }
    else if (rent) {
      navigate(`/onlyrental/1`, { state: { product: productData } });
    }
    else if (preloved) {
      navigate(`/preloved/1`, { state: { product: productData } });
    }
    else {
      navigate(`/buynew/1`, { state: { product: productData } });
    }
  };

  return (
    <div className="mob-card" onClick={handleCardClick}>
      
      {/* Image Zone - Spec §16.3 */}
      <div className="mob-card__image-zone">
        
        {/* Mode Badges - Spec §16.4 */}
        <div className="mob-card__badges">
          <span className={`mob-card__badge ${mode.badgeClass}`}>
            {mode.label}
          </span>
        </div>

        {/* Wishlist Button - Spec §16.5 */}
        <button 
          className={`mob-card__wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={handleWishlistClick}
          aria-label="Add to wishlist"
        >
          <svg 
            className="mob-card__wishlist-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Product Image / Placeholder */}
        <div className="mob-card__image-inner">
          {item.image?.[0] ? (
            <img 
              src={item.image[0]} 
              alt={item.name}
              className="mob-card__image"
            />
          ) : (
            <div className={`mob-card__placeholder ci-${item.placeholderClass || 'a'}`}>
              <svg className="mob-card__placeholder-icon" viewBox="0 0 24 24" fill="none">
                <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1" />
                <path d="M20 12L4 12" stroke="currentColor" strokeWidth="1" />
                <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1" />
                <rect x="6" y="4" width="12" height="16" rx="1" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Info Zone - Spec §16.6 */}
      <div className="mob-card__info">
        
        {/* Designer Label */}
        <p className="mob-card__designer">{item.designer}</p>
        
        {/* Product Name */}
        <h3 className="mob-card__name">{item.name}</h3>
        
        {/* Price Block */}
        <div className="mob-card__price-block">
          <div className="mob-card__price-row">
            <span className="mob-card__price-main">{mode.priceMain}</span>
            {mode.priceSub && (
              <span className="mob-card__price-sub">/ {mode.priceSub}</span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default MobileProductCard;