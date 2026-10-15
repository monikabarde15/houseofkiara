import '../../../../styles/wishlist/mobile/common/mobile-empty-state.css';

const MobileEmptyState = ({ isVisible, onBrowseClick }) => {
  const handleBrowseClick = () => {
    console.log('Navigate to collection browse page');
    onBrowseClick?.();
  };

  return (
    <div className={`wishlist-mobile-empty-state ${isVisible ? 'show' : ''}`}>
      {/* Icon ring */}
      <div className="wishlist-mobile-empty-state__icon-ring">
        <svg className="wishlist-mobile-empty-state__heart-icon" viewBox="0 0 24 24" fill="none">
          <path d="M21 7.5C21 4.5 18.5 2 15.5 2C13.5 2 11.8 3.1 11 4.7C10.2 3.1 8.5 2 6.5 2C3.5 2 1 4.5 1 7.5C1 13 11 19.5 11 19.5C11 19.5 21 13 21 7.5Z" fill="#B85C38" stroke="none"/>
        </svg>
      </div>
      
      {/* Eyebrow */}
      <div className="wishlist-mobile-empty-state__eyebrow">NOTHING SAVED HERE YET</div>
      
      {/* Headline */}
      <h2 className="wishlist-mobile-empty-state__headline">
        Your <span className="wishlist-mobile-empty-state__headline-italic">edit</span> awaits
      </h2>
      
      {/* Body text */}
      <p className="wishlist-mobile-empty-state__body">
        Browse the collection and tap on any piece to save it here.
      </p>
      
      {/* CTA button */}
      <button 
        className="wishlist-mobile-empty-state__button"
        onClick={handleBrowseClick}
      >
        BROWSE THE COLLECTION
      </button>
    </div>
  );
};

export default MobileEmptyState;