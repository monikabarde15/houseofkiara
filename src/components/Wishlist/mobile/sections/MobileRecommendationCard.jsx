import useWishlistStore from '../../../../store/wishlistStore';
import '../../../../styles/wishlist/mobile/sections/mobile-recommendation-card.css';

const MobileRecommendationCard = ({ item, onAddToWishlist, onCardTap }) => {
  const wishlistItems = useWishlistStore((state) => state.items);

  const isHeartFilled = wishlistItems.some((id) =>
    [item.id, item.sku, item._id, item.productId]
      .filter(Boolean)
      .map(String)
      .includes(String(id))
  );

  const getModeLabel = () => {
    switch (item.mode) {
      case 'rent':
        return 'RENTAL';
      case 'preloved':
        return 'PRELOVED';
      case 'new':
        return 'NEW';
      default:
        return '';
    }
  };

  const handleHeartClick = (e) => {
    e.stopPropagation();
    const raw = item.rawProduct || item;
    const targetId = raw.sku || raw.productId || raw._id || raw.id || item.id;
    useWishlistStore.getState().toggleWishlist(targetId, raw);

    if (!isHeartFilled) {
      onAddToWishlist?.(`${item.name} added to your wishlist`);
    } else {
      onAddToWishlist?.(`${item.name} removed from your wishlist`);
    }
  };

  const handleCardClick = () => {
    onCardTap?.(item);
  };

  return (
    <div className="wishlist-mobile-recommendation-card" onClick={handleCardClick}>
      {/* Image Area */}
      <div 
        className="wishlist-mobile-recommendation-card__image"
        style={{ backgroundColor: item.imageBg || '#FAF7F2' }}
      >
        {/* Heart Button */}
        <button 
          className="wishlist-mobile-recommendation-card__heart"
          onClick={handleHeartClick}
          aria-label="Add to wishlist"
        >
          <svg className="wishlist-mobile-recommendation-card__heart-icon" viewBox="0 0 12 12" fill="none">
            <path d="M10.5 3.5C10.5 2.5 9.5 1.5 8.5 1.5C7.5 1.5 6.5 2 6 3C5.5 2 4.5 1.5 3.5 1.5C2.5 1.5 1.5 2.5 1.5 3.5C1.5 6.5 6 10 6 10C6 10 10.5 6.5 10.5 3.5Z" 
              fill={isHeartFilled ? "#B85C38" : "none"} 
              stroke={isHeartFilled ? "#B85C38" : "#8A7E72"} 
              strokeWidth="1.2"/>
          </svg>
        </button>
        
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <>
            {/* Garment SVG */}
            <svg className="wishlist-mobile-recommendation-card__garment" viewBox="0 0 38 50" fill="none">
              <path d="M10 12L19 6L28 12L31 21L28 31L19 44L10 31L7 21L10 12Z" 
                stroke={item.strokeColor || "rgba(201, 169, 110, 0.22)"} 
                strokeWidth="0.65" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none"/>
              <path d="M19 6V44" stroke={item.strokeColor || "rgba(201, 169, 110, 0.22)"} strokeWidth="0.65" strokeLinecap="round" fill="none"/>
            </svg>
            
            {/* Designer label on image */}
            <span 
              className="wishlist-mobile-recommendation-card__designer-label"
              style={{ color: item.labelColor || "#8A7E72" }}
            >
              {item.designer}
            </span>
          </>
        )}
      </div>
      
      {/* Content */}
      <div className="wishlist-mobile-recommendation-card__content">
        {/* Mode label */}
        <div className="wishlist-mobile-recommendation-card__mode">{getModeLabel()}</div>
        
        {/* Designer */}
        <div className="wishlist-mobile-recommendation-card__designer">{item.designer}</div>
        
        {/* Product name */}
        <div className="wishlist-mobile-recommendation-card__name">{item.name}</div>
        
        {/* Price label and Price */}
        <div className="wishlist-mobile-recommendation-card__price-row">
          <span className="wishlist-mobile-recommendation-card__price-label">{item.priceLabel}</span>
          <span className="wishlist-mobile-recommendation-card__price">₹{Number(item.price).toLocaleString('en-IN')}</span>
          {item.mode === 'rent' && (
            <span className="wishlist-mobile-recommendation-card__rent-suffix"> / {item.rentalDuration}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileRecommendationCard;