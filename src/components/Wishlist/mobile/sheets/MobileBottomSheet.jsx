import { useEffect } from 'react';
import '../../../../styles/wishlist/mobile/sheets/mobile-bottom-sheet.css';

const MobileBottomSheet = ({ isOpen, onClose, children, mode = 'rent' }) => {
  // Section 9.1: Backdrop - tapping backdrop closes the sheet
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Section 9.4 & 9.1: Escape key closes the sheet
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Section 9.4: Title based on mode
  const getTitle = () => {
    if (mode === 'rent') {
      return 'Reserve This Piece';
    }
    return 'Add to Bag';
  };

  if (!isOpen) return null;

  return (
    <div 
      className="wishlist-mobile-bottom-sheet__backdrop"
      onClick={handleBackdropClick}
    >
      <div className="wishlist-mobile-bottom-sheet">
        {/* Section 9.3: Drag Handle */}
        <div className="wishlist-mobile-bottom-sheet__drag-handle"></div>
        
        {/* Section 9.4: Sheet Header */}
        <div className="wishlist-mobile-bottom-sheet__header">
          <h2 className="wishlist-mobile-bottom-sheet__title">{getTitle()}</h2>
          <button 
            className="wishlist-mobile-bottom-sheet__close"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <line x1="1" y1="1" x2="10" y2="10" stroke="#8A7E72" strokeWidth="2" strokeLinecap="round"/>
              <line x1="10" y1="1" x2="1" y2="10" stroke="#8A7E72" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        
        {/* Section 9.5: Sheet Body */}
        <div className="wishlist-mobile-bottom-sheet__body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileBottomSheet;