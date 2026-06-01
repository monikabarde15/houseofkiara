import '../../../../styles/wishlist/mobile/cards/mobile-wishlist-card-actions.css';

const MobileWishlistCardActions = ({ item, mode, showToast,onOpenAddToBagSheet }) => {
  const handleAddToBag = (e) => {
    e.stopPropagation(); // Prevents card navigation
    //  Open Add to Bag bottom sheet
    onOpenAddToBagSheet?.(item, mode);
  };

  const handleViewPiece = (e) => {
    e.stopPropagation(); // Prevents card navigation
    console.log('Navigate to product detail:', item.name);
  };

  const handleNotifyMe = (e) => {
    e.stopPropagation(); // Prevents card navigation
    
    //  Notify Me for unavailable rental items
    // Toast: "We'll notify you when [product name] becomes available"
    showToast(`We'll notify you when ${item.name} becomes available`);
  };

  //  For unavailable rental cards, show "NOTIFY ME" button
  const isUnavailableRental = mode === 'rent' && !item.isAvailable;

  return (
    <div className="wishlist-mobile-card-actions">
      {isUnavailableRental ? (
        //  Notify Me button (disabled styling but tappable)
        <button 
          className="wishlist-mobile-card-actions__primary wishlist-mobile-card-actions__primary--disabled"
          onClick={handleNotifyMe}
        >
          NOTIFY ME
        </button>
      ) : (
        //  Primary button "ADD TO BAG"
        <button 
          className="wishlist-mobile-card-actions__primary"
          onClick={handleAddToBag}
        >
          ADD TO BAG
        </button>
      )}
      
      {/* View Icon Button */}
      <button 
        className="wishlist-mobile-card-actions__secondary"
        onClick={handleViewPiece}
        aria-label="View piece"
      >
        <svg className="wishlist-mobile-card-actions__eye-icon" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
          <path d="M1 6C2 3.5 3.5 2 6 2C8.5 2 10 3.5 11 6" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          <path d="M11 6C10 8.5 8.5 10 6 10C3.5 10 2 8.5 1 6" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
};

export default MobileWishlistCardActions;