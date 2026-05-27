import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import "../../../../styles/Profile/mobile/common/MobileNavDrawer.css";

const MobileNavDrawer = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      <div className="profile-mobile-drawer-backdrop" onClick={onClose} />
      <div className="profile-mobile-drawer">
        {/* Header */}
        <div className="profile-mobile-drawer-header">
          <div className="profile-mobile-drawer-logo">HOUSE OF KAIRA</div>
          <button className="profile-mobile-drawer-close" onClick={onClose}>
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Shop Section */}
        <div className="profile-mobile-drawer-section">
          <div className="profile-mobile-drawer-section-label">Shop</div>
          <a href="/rent" className="profile-mobile-drawer-link" onClick={handleLinkClick}>Rent</a>
          <a href="/preloved" className="profile-mobile-drawer-link" onClick={handleLinkClick}>Buy Preloved</a>
          <a href="/buy-new" className="profile-mobile-drawer-link" onClick={handleLinkClick}>Buy New</a>
          <a href="/list-your-piece" className="profile-mobile-drawer-link" onClick={handleLinkClick}>List Your Piece</a>
        </div>

        {/* Account Section */}
        <div className="profile-mobile-drawer-section">
          <div className="profile-mobile-drawer-section-label">Account</div>
          <a href="/profile" className="profile-mobile-drawer-link active" onClick={handleLinkClick}>My Profile</a>
          <a href="/wishlist" className="profile-mobile-drawer-link" onClick={handleLinkClick}>Saved Pieces</a>
          <a href="/orders" className="profile-mobile-drawer-link" onClick={handleLinkClick}>My Orders</a>
        </div>

        {/* Info Section */}
        <div className="profile-mobile-drawer-section">
          <div className="profile-mobile-drawer-section-label">Info</div>
          <a href="/help" className="profile-mobile-drawer-link" onClick={handleLinkClick}>Help & FAQ</a>
          <a href="/chat" className="profile-mobile-drawer-link" onClick={handleLinkClick}>Chat with Us</a>
        </div>

        {/* Footer */}
        <div className="profile-mobile-drawer-footer">
          © 2025 House of Kaira
        </div>
      </div>
    </>
  );
};

export default MobileNavDrawer;