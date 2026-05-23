import React from 'react';
import { Trash2 } from 'lucide-react';
import "../../../styles/Profile/modals/DeleteAddressModal.css";

const DeleteAddressModal = ({ isOpen, onClose, onConfirm, address }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="profile-deladdr-mbk" onClick={onClose}></div>
      <div className="profile-deladdr-modal">
        <div className="profile-deladdr-icon">
          <Trash2 size={24} strokeWidth={1.5} />
        </div>
        <div className="profile-deladdr-title">Delete Address?</div>
        <div className="profile-deladdr-body">
          This address will be permanently removed. Orders in transit are unaffected.
        </div>
        <div className="profile-deladdr-buttons">
          <button className="profile-deladdr-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="profile-deladdr-btn-delete" onClick={() => onConfirm(address)}>Yes, Delete</button>
        </div>
      </div>
    </>
  );
};

export default DeleteAddressModal;