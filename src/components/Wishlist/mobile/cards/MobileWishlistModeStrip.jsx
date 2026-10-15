import '../../../../styles/wishlist/mobile/cards/mobile-wishlist-mode-strip.css';

const MobileWishlistModeStrip = ({ mode, tag }) => {
  // Section 6.2: Get strip styles based on mode
  const getStripStyles = () => {
    switch (mode) {
      case 'rent':
        return {
          background: 'rgba(26, 22, 18, 0.82)',
          color: 'rgba(232, 213, 176, 0.75)'
        };
      case 'preloved':
        return {
          background: 'rgba(184, 92, 56, 0.14)',
          color: '#B85C38'
        };
      case 'new':
        return {
          background: 'rgba(107, 126, 90, 0.14)',
          color: '#6B7E5A'
        };
      default:
        return {
          background: 'rgba(26, 22, 18, 0.82)',
          color: 'rgba(232, 213, 176, 0.75)'
        };
    }
  };

  const getModeText = () => {
    switch (mode) {
      case 'rent':
        return 'RENT';
      case 'preloved':
        return 'PRELOVED';
      case 'new':
        return 'NEW';
      default:
        return '';
    }
  };

  const stripStyles = getStripStyles();

  return (
    <div 
      className="wishlist-mobile-mode-strip"
      style={{
        background: stripStyles.background,
        color: stripStyles.color
      }}
    >
      <span className="wishlist-mobile-mode-strip__text">{getModeText()}</span>
      {tag && (
        <span className="wishlist-mobile-mode-strip__tag">{tag}</span>
      )}
    </div>
  );
};

export default MobileWishlistModeStrip;