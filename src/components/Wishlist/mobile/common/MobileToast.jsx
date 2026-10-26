import '../../../../styles/wishlist/mobile/common/mobile-toast.css';

const MobileToast = ({ message, withUndo = false, onUndo, onClose }) => {
  const handleUndoClick = () => {
    onUndo?.();
    onClose?.();
  };

  return (
    <div className="wishlist-mobile-toast">
      <div className="wishlist-mobile-toast__content">
        {/* Section 7.2: Checkmark icon */}
        <svg className="wishlist-mobile-toast__icon" viewBox="0 0 20 20" fill="none">
          <polyline points="16,5 8,15 4,10" stroke="#C9A96E" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        
        <span className="wishlist-mobile-toast__message">{message}</span>
        
        {/* Section 7.2: UNDO link - shown only on remove toast */}
        {withUndo && (
          <>
            <span className="wishlist-mobile-toast__divider"></span>
            <button 
              className="wishlist-mobile-toast__undo"
              onClick={handleUndoClick}
            >
              UNDO
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileToast;