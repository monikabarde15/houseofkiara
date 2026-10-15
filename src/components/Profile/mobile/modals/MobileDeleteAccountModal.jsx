import React, { useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import "../../../../styles/Profile/mobile/modals/MobileDeleteAccountModal.css";

const MobileDeleteAccountModal = ({ isOpen, onClose, onConfirm }) => {
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
      <div className="profile-mobile-delete-backdrop" onClick={onClose} />
      <div className="profile-mobile-delete-modal">
        <div className="profile-mobile-delete-icon">
          <Trash2 size={22} strokeWidth={1.5} />
        </div>
        <div className="profile-mobile-delete-title">Delete Account?</div>
        <div className="profile-mobile-delete-body">
          This permanently removes your account, all booking history, and saved data. This cannot be undone.
        </div>
        <div className="profile-mobile-delete-buttons">
          <button className="profile-mobile-delete-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="profile-mobile-delete-btn-confirm" onClick={onConfirm}>
            Yes, Delete Account
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileDeleteAccountModal;