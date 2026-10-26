import React from 'react';
import { Trash2 } from 'lucide-react';
import "../../../styles/Profile/modals/DeleteAccountModal.css";

const DeleteAccountModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="profile-delete-mbk" onClick={onClose}></div>
      <div className="profile-delete-modal">
        <div className="profile-delete-icon">
          <Trash2 size={24} strokeWidth={1.5} />
        </div>
        <div className="profile-delete-title">Delete Account?</div>
        <div className="profile-delete-body">
          This action cannot be undone. All your data will be permanently removed.
        </div>
        <div className="profile-delete-buttons">
          <button className="profile-delete-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="profile-delete-btn-confirm" onClick={onConfirm}>Yes, Delete Account</button>
        </div>
      </div>
    </>
  );
};

export default DeleteAccountModal;