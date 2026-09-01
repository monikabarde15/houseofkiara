import MobileWishlistCardActions from './MobileWishlistCardActions';
import '../../../../styles/wishlist/mobile/cards/mobile-wishlist-card-body.css';

const MobileWishlistCardBody = ({ item, mode, showToast, onRemove,onOpenAddToBagSheet }) => {
  // Section 6.7: Condition badge for Preloved only
  const getConditionColor = () => {
    switch (item.condition) {
      case 'Pristine condition':
        return '#6B7E5A';
      case 'Excellent condition':
        return '#A8844A';
      case 'Good condition':
        return '#8A7E72';
      default:
        return '#8A7E72';
    }
  };

  // Format relative date 
  const getRelativeDate = (dateString) => {
    const savedDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - savedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      return `Saved ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Saved ${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `Saved ${months} month${months > 1 ? 's' : ''} ago`;
    }
  };

  // Price label based on mode
  const getPriceLabel = () => {
    switch (mode) {
      case 'rent':
        return 'RENTAL PRICE';
      case 'preloved':
        return 'PRELOVED PRICE';
      case 'new':
        return 'PRICE';
      default:
        return 'PRICE';
    }
  };

  // Section 6.6: Unavailability note for unavailable rental cards
  const getUnavailabilityNote = () => {
    if (mode === 'rent' && !item.isAvailable) {
      return 'Not available for your selected dates';
    }
    return null;
  };

  // Section 6.10: Handle remove text link click
  const handleRemoveClick = (e) => {
    e.stopPropagation(); // Does not navigate to product page
    onRemove?.();
  };


  const relativeDate = getRelativeDate(item.dateSaved);
  const unavailabilityNote = getUnavailabilityNote();
  const showNewWithTags = mode === 'new';

  return (
    <div className="wishlist-mobile-card-body">
      {/* Designer label */}
      <div className="wishlist-mobile-card-body__designer">{item.designer}</div>
      
      {/* Product name */}
      <div className="wishlist-mobile-card-body__name">{item.name}</div>
      
      {/* Condition badge (Preloved only) */}
      {mode === 'preloved' && item.condition && (
        <div 
          className="wishlist-mobile-card-body__condition"
          style={{ color: getConditionColor() }}
        >
          {item.condition}
        </div>
      )}
      
      {/* Price label */}
      <div className="wishlist-mobile-card-body__price-label">{getPriceLabel()}</div>
      
      {/* Price */}
      <div className="wishlist-mobile-card-body__price">
        ₹{item.price.toLocaleString('en-IN')}
      </div>
      
      {/* Price note (Rent) */}
      {mode === 'rent' && item.isAvailable && item.savePercentage > 0 && (
        <div className="wishlist-mobile-card-body__price-note">
          <span>for {item.rentalDuration}</span>
          <span className="wishlist-mobile-card-body__dot">·</span>
          <span className="wishlist-mobile-card-body__retail">
            retail ₹{item.originalPrice.toLocaleString('en-IN')}
          </span>
          <span className="wishlist-mobile-card-body__save">Save {item.savePercentage}%</span>
        </div>
      )}
      
      {/* Price note (Preloved) */}
      {mode === 'preloved' && item.savePercentage > 0 && (
        <div className="wishlist-mobile-card-body__price-note">
          <span className="wishlist-mobile-card-body__retail">
            retail ₹{item.originalPrice.toLocaleString('en-IN')}
          </span>
          <span className="wishlist-mobile-card-body__dot">·</span>
          <span className="wishlist-mobile-card-body__save">Save {item.savePercentage}%</span>
        </div>
      )}
      
      {/* Buy New note */}
      {showNewWithTags && (
        <div className="wishlist-mobile-card-body__price-note">
          <span>New with tags</span>
        </div>
      )}
      
      {/* Unavailability note */}
      {unavailabilityNote && (
        <div className="wishlist-mobile-card-body__unavail-note">
          {unavailabilityNote}
        </div>
      )}

      {/* Section 6.9: CTAs Row */}
      <MobileWishlistCardActions 
        item={item} 
        mode={mode} 
        showToast={showToast}
        onOpenAddToBagSheet={onOpenAddToBagSheet}
      />
      
      {/* Saved timestamp */}
      <div className="wishlist-mobile-card-body__saved-date">
        {relativeDate}
      </div>
      
      {/* Section 6.10: Remove Text Link */}
      <button 
        className="wishlist-mobile-card-body__remove-link"
        onClick={handleRemoveClick}
      >
        <svg className="wishlist-mobile-card-body__remove-icon" viewBox="0 0 10 10" fill="none">
          <path d="M1 2H2H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 2V1.5C3 1 3.5 0.5 4 0.5H6C6.5 0.5 7 1 7 1.5V2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7.5 2V8.5C7.5 9 7 9.5 6.5 9.5H3.5C3 9.5 2.5 9 2.5 8.5V2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="4" y1="4.5" x2="4" y2="7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="6" y1="4.5" x2="6" y2="7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <span>REMOVE</span>
      </button>
      
      
    </div>
  );
};

export default MobileWishlistCardBody;