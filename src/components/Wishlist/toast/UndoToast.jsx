// src/components/Wishlist/toast/UndoToast.jsx
// Section 9.3: Undo Toast

import { useEffect } from "react";
import "../../../styles/wishlist/toast/undo-toast.css";

const UndoToast = ({ onUndo, onClose }) => {
  // Toast stays visible for entire 5-second undo window
  // Dismissal: (a) Undo is clicked, or (b) 5-second window expires
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleUndoClick = () => {
    onUndo();
    onClose();
  };

  return (
    <div className="desk-wishlist-undo-toast">
      {/* Checkmark icon */}
      <svg 
        className="desk-wishlist-undo-toast-icon"
        width="13" 
        height="13" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline 
          points="20 6 9 17 4 12" 
          stroke="currentColor" 
          strokeWidth="1.8" 
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      
      <span className="desk-wishlist-undo-toast-message">
        Removed from your wishlist
      </span>
      
      <button 
        className="desk-wishlist-undo-toast-link"
        onClick={handleUndoClick}
      >
        UNDO
      </button>
    </div>
  );
};

export default UndoToast;