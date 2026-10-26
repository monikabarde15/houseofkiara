// src/components/Wishlist/modal/ShareWishlistModal.jsx


import { useEffect, useState } from "react";
import "../../../styles/wishlist/modal/share-wishlist-modal.css";

const ShareWishlistModal = ({ isOpen, onClose, onShowToast }) => {
  const [isCopied, setIsCopied] = useState(false);
  
  // Share link URL
  const shareUrl = "houseofkaira.in/wishlist/xk92";

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Section 12.1: Clicking outside the modal panel closes the modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Section 12.4: Copy link functionality
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      console.log("Toast callback:", onShowToast);
      if (onShowToast) {
        onShowToast("Link copied to clipboard");
      }
      // Reset copied state after 3 seconds
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Section 12.5: Share option handlers
  const handleShareOption = (platform) => {
    if (onShowToast) {
      onShowToast(`Opening ${platform}...`);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    // Section 12.1: Overlay
    <div 
      className="desk-wishlist-share-overlay desk-wishlist-share-overlay-open"
      onClick={handleOverlayClick}
    >
      {/* Section 12.2: Modal Panel */}
      <div className="desk-wishlist-share-modal">
        
        {/* Section 12.2: Close button */}
        <button 
          className="desk-wishlist-share-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        
        {/* Section 12.3: Modal Content */}
        <div className="desk-wishlist-share-content">
          
          {/* Eyebrow Text */}
          <div className="desk-wishlist-share-eyebrow">
            Share Your Curation
          </div>
          
          {/* Title */}
          <h2 className="desk-wishlist-share-title">
            My Wishlist
          </h2>
          
          {/* Body Copy */}
          <p className="desk-wishlist-share-body">
            Share your saved pieces with a friend, or copy the link to return later.
          </p>
          
          {/* Section 12.4: Share Link Row */}
          <div className="desk-wishlist-share-link-row">
            <input
              type="text"
              className="desk-wishlist-share-input"
              value={shareUrl}
              readOnly
            />
            <button 
              className="desk-wishlist-share-copy-btn"
              onClick={handleCopyLink}
            >
              {isCopied ? "COPIED!" : "COPY LINK"}
            </button>
          </div>
          
          {/* Section 12.5: Share Options */}
          <div className="desk-wishlist-share-options">
            
            {/* Instagram */}
            <button 
              className="desk-wishlist-share-option"
              onClick={() => handleShareOption("Instagram")}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.4" fill="none"/>
                <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.4" fill="none"/>
                <circle cx="13.5" cy="4.5" r="0.75" fill="currentColor"/>
              </svg>
              <span>INSTAGRAM</span>
            </button>
            
            {/* WhatsApp */}
            <button 
              className="desk-wishlist-share-option"
              onClick={() => handleShareOption("WhatsApp")}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1C4.5 1 1 4.5 1 9C1 10.5 1.5 12 2.5 13L1 17L5 15.5C6 16.5 7.5 17 9 17C13.5 17 17 13.5 17 9C17 4.5 13.5 1 9 1Z" stroke="currentColor" strokeWidth="1.4" fill="none"/>
                <path d="M12 11L10 9L8 11" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
              </svg>
              <span>WHATSAPP</span>
            </button>
            
            {/* Email */}
            <button 
              className="desk-wishlist-share-option"
              onClick={() => handleShareOption("Email")}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="4" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none"/>
                <path d="M3 5L9 10L15 5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
              </svg>
              <span>EMAIL</span>
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareWishlistModal;