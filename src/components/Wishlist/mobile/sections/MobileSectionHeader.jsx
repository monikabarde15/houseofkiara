import '../../../../styles/wishlist/mobile/sections/mobile-section-header.css';

const MobileSectionHeader = ({ mode, pieceCount }) => {
  const getDotColor = () => {
    switch (mode) {
      case 'rent':
        return 'wishlist-mobile-section-header__dot--rent';
      case 'preloved':
        return 'wishlist-mobile-section-header__dot--preloved';
      case 'new':
        return 'wishlist-mobile-section-header__dot--new';
      default:
        return '';
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'rent':
        return 'Rent';
      case 'preloved':
        return 'Buy Preloved';
      case 'new':
        return 'Buy New';
      default:
        return '';
    }
  };

  const getPieceCountText = () => {
    return pieceCount === 1 ? '1 piece' : `${pieceCount} pieces`;
  };

  return (
    <div className="wishlist-mobile-section-header">
      <div className={`wishlist-mobile-section-header__dot ${getDotColor()}`}></div>
      <span className="wishlist-mobile-section-header__label">{getModeLabel()}</span>
      <span className="wishlist-mobile-section-header__count">{getPieceCountText()}</span>
    </div>
  );
};

export default MobileSectionHeader;