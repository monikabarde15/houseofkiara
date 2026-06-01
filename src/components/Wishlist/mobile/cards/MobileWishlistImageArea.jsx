import MobileWishlistModeStrip from './MobileWishlistModeStrip';
import MobileUnavailabilityVeil from './MobileUnavailabilityVeil';
import '../../../../styles/wishlist/mobile/cards/mobile-wishlist-image-area.css';

const MobileWishlistImageArea = ({ item, mode, showToast,onRemove  }) => {
  //  Background colors by mode
  const getBackgroundColor = () => {
    switch (mode) {
      case 'rent':
        return '#242019';
      case 'preloved':
        return '#FAF7F2';
      case 'new':
        return '#EDEBE4';
      default:
        return '#FAF7F2';
    }
  };

  //  SVG stroke colors with opacity
  const getSvgStroke = () => {
    switch (mode) {
      case 'rent':
        return 'rgba(201, 169, 110, 0.22)';
      case 'preloved':
        return 'rgba(201, 169, 110, 0.16)';
      case 'new':
        return 'rgba(107, 126, 90, 0.20)';
      default:
        return 'rgba(201, 169, 110, 0.22)';
    }
  };

  //  Designer label color on image
  const getDesignerLabelColor = () => {
    switch (mode) {
      case 'rent':
        return 'rgba(232, 213, 176, 0.30)';
      case 'preloved':
        return 'rgba(138, 126, 114, 0.35)';
      case 'new':
        return 'rgba(107, 126, 90, 0.30)';
      default:
        return 'rgba(232, 213, 176, 0.30)';
    }
  };

  //  Remove heart button click
  const handleHeartClick = (e) => {
    e.stopPropagation(); // Prevents card navigation
    
    //  Heart pop animation
    const heartButton = e.currentTarget;
    heartButton.classList.add('pop');
    setTimeout(() => {
      heartButton.classList.remove('pop');
    }, 350);
    
    // After animation, trigger remove
    onRemove?.();
  };

  return (
    <div 
      className="wishlist-mobile-image-area"
      style={{ backgroundColor: getBackgroundColor() }}
    >
      {/*  Remove Heart Button */}
      <button 
        className="wishlist-mobile-image-area__heart" 
        data-id={item.id}
        onClick={handleHeartClick}
        aria-label="Remove from wishlist"
      >
        <svg className="wishlist-mobile-image-area__heart-icon" viewBox="0 0 13 13" fill="none">
          <path d="M11.5 4C11.5 2.343 10.157 1 8.5 1C7.5 1 6.618 1.5 6.125 2.25C5.632 1.5 4.75 1 3.75 1C2.093 1 0.75 2.343 0.75 4C0.75 7.5 6.125 11.5 6.125 11.5C6.125 11.5 11.5 7.5 11.5 4Z" fill="#B85C38" stroke="none"/>
        </svg>
      </button>

      {/*  Unavailability Veil for unavailable rental cards */}
      {mode === 'rent' && !item.isAvailable && <MobileUnavailabilityVeil />}

      {/*  Inner container with placeholder art */}
      <div className="wishlist-mobile-image-area__inner">
        <svg className="wishlist-mobile-image-area__garment" viewBox="0 0 38 50" fill="none">
          <path d="M10 12L19 6L28 12L31 21L28 31L19 44L10 31L7 21L10 12Z" 
            stroke={getSvgStroke()} 
            strokeWidth="0.65" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none"/>
          <path d="M19 6V44" stroke={getSvgStroke()} strokeWidth="0.65" strokeLinecap="round" fill="none"/>
        </svg>
        
        {/* Designer label on image */}
        <span 
          className="wishlist-mobile-image-area__designer-label"
          style={{ color: getDesignerLabelColor() }}
        >
          {item.designer}
        </span>
      </div>

      {/* Mode Strip */}
      <MobileWishlistModeStrip mode={mode} tag={item.tag} />
    </div>
  );
};

export default MobileWishlistImageArea;