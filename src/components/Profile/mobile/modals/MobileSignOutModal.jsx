import React, { useEffect } from 'react';
import { LogOut } from 'lucide-react';
import "../../../../styles/Profile/mobile/modals/MobileSignOutModal.css";

const MobileSignOutModal = ({ isOpen, onClose, onConfirm }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="profile-mobile-signout-backdrop" onClick={onClose} />
      <div className="profile-mobile-signout-modal">
        <div className="profile-mobile-signout-icon">
          <LogOut size={22} strokeWidth={1.5} />
        </div>
        <div className="profile-mobile-signout-title">Sign Out?</div>
        <div className="profile-mobile-signout-body">
          You'll need to sign in again to access your bookings and orders.
        </div>
        <div className="profile-mobile-signout-buttons">
          <button className="profile-mobile-signout-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="profile-mobile-signout-btn-confirm" onClick={onConfirm}>
            Yes, Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileSignOutModal;