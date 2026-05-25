import React from 'react';
import { LogOut } from 'lucide-react';
import "../../../styles/Profile/modals/SignOutModal.css";

const SignOutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="profile-signout-mbk" onClick={onClose}></div>
      <div className="profile-signout-modal">
        <div className="profile-signout-icon">
          <LogOut size={24} strokeWidth={1.5} />
        </div>
        <div className="profile-signout-title">Sign Out?</div>
        <div className="profile-signout-body">
          You'll need to sign in again to access your account.
        </div>
        <div className="profile-signout-buttons">
          <button className="profile-signout-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="profile-signout-btn-confirm" onClick={onConfirm}>Yes, Sign Out</button>
        </div>
      </div>
    </>
  );
};

export default SignOutModal;