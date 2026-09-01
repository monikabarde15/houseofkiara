import React, { useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import "../../../../styles/Profile/mobile/modals/MobileDeleteAddressModal.css";

const MobileDeleteAddressModal = ({ isOpen, onClose, onConfirm, address }) => {
  // Lock body scroll when modal is open
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div className="profile-mobile-deladdr-backdrop" onClick={handleBackdropClick} />
      <div className="profile-mobile-deladdr-modal">
        <div className="profile-mobile-deladdr-icon">
          <Trash2 size={22} strokeWidth={1.5} />
        </div>
        <div className="profile-mobile-deladdr-title">Delete Address?</div>
        <div className="profile-mobile-deladdr-body">
          This address will be permanently removed from your account. Any orders currently in transit will not be affected.
        </div>
        <div className="profile-mobile-deladdr-buttons">
          <button className="profile-mobile-deladdr-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="profile-mobile-deladdr-btn-delete" onClick={() => onConfirm(address)}>
            Yes, Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileDeleteAddressModal;