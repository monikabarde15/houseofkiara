import React, { useState, useEffect } from 'react';
import '../../../../styles/wishlist/mobile/sheets/mobile-share-sheet.css';

const MobileShareSheet = ({ isOpen, onClose, showToast }) => {
  const [isClosing, setIsClosing] = useState(false);
  
  // Share link value
  const shareLink = "houseofkaira.in/wishlist/xk92";

  const handleCopyLink = () => {
    // Copy link to clipboard
    navigator.clipboard.writeText(shareLink);
    showToast('Link copied to clipboard');
    handleClose();
  };

  const handleInstagram = () => {
    showToast('Opening Instagram share...');
    handleClose();
  };

  const handleWhatsApp = () => {
    showToast('Opening WhatsApp...');
    handleClose();
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  // Section 10.1: Backdrop - tapping closes the sheet
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Escape key closes the sheet
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
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
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  return (
    // Section 10.1: Backdrop
    <div 
      className="wishlist-mobile-share-sheet__backdrop"
      onClick={handleBackdropClick}
    >
      {/* Section 10.2: Sheet Container */}
      <div className={`wishlist-mobile-share-sheet ${isClosing ? 'wishlist-mobile-share-sheet--closing' : ''}`}>
        {/* Section 10.3: Drag Handle */}
        <div className="wishlist-mobile-share-sheet__drag-handle"></div>
        
        {/* Section 10.4: Sheet Body */}
        <div className="wishlist-mobile-share-sheet__body">
          {/* Eyebrow */}
          <div className="wishlist-mobile-share-sheet__eyebrow">SHARE YOUR CURATION</div>
          
          {/* Title */}
          <h2 className="wishlist-mobile-share-sheet__title">My Wishlist</h2>
          
          {/* Subtitle */}
          <p className="wishlist-mobile-share-sheet__subtitle">
            Share your saved pieces with a friend, or copy the link to return later.
          </p>
          
          {/* Copy Link Row */}
          <div className="wishlist-mobile-share-sheet__copy-row">
            <input 
              type="text"
              className="wishlist-mobile-share-sheet__copy-input"
              value={shareLink}
              readOnly
            />
            <button 
              className="wishlist-mobile-share-sheet__copy-button"
              onClick={handleCopyLink}
            >
              COPY LINK
            </button>
          </div>
          
          {/* Share Option Buttons */}
          <div className="wishlist-mobile-share-sheet__options">
            {/* Instagram Button */}
            <button 
              className="wishlist-mobile-share-sheet__option"
              onClick={handleInstagram}
            >
              <svg className="wishlist-mobile-share-sheet__option-icon" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.4" fill="none"/>
                <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.4" fill="none"/>
                <circle cx="13.5" cy="4.5" r="0.8" fill="currentColor"/>
              </svg>
              <span>INSTAGRAM</span>
            </button>
            
            {/* WhatsApp Button */}
            <button 
              className="wishlist-mobile-share-sheet__option"
              onClick={handleWhatsApp}
            >
              <svg className="wishlist-mobile-share-sheet__option-icon" viewBox="0 0 18 18" fill="none">
                <path d="M9 1C4.5 1 1 4.5 1 9C1 10.5 1.5 12 2.5 13L1.5 16.5L5 15.5C6.5 16.5 8 17 9.5 17C14 17 17.5 13.5 17.5 9C17.5 4.5 14 1 9 1Z" stroke="currentColor" strokeWidth="1.4" fill="none"/>
                <path d="M13 11.5C12.5 12 11 12.5 10.5 12C9.5 11 8 9.5 7.5 8.5C7 7.5 7.5 7 8 6.5C8.5 6 8.5 5.5 8 5C7.5 4.5 6.5 3.5 6 3.5C5.5 3.5 5 4 4.5 4.5C4 5 3.5 6 4 7.5C4.5 9 6 11 8 12.5C9.5 13.5 11 14 12 13.5C12.5 13 13 12.5 13 12C13.5 11.5 13 11.5 13 11.5Z" stroke="currentColor" strokeWidth="1.4" fill="none"/>
              </svg>
              <span>WHATSAPP</span>
            </button>
            
            {/* Copy Link Button */}
            <button 
              className="wishlist-mobile-share-sheet__option"
              onClick={handleCopyLink}
            >
              <svg className="wishlist-mobile-share-sheet__option-icon" viewBox="0 0 18 18" fill="none">
                <path d="M7 9C7 8 7.5 7 8.5 6.5L11.5 4C13 3 15 3.5 16 5C17 6.5 16.5 8.5 15 9.5L12.5 11.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
                <path d="M11 9C11 10 10.5 11 9.5 11.5L6.5 14C5 15 3 14.5 2 13C1 11.5 1.5 9.5 3 8.5L5.5 6.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
              </svg>
              <span>COPY LINK</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileShareSheet;