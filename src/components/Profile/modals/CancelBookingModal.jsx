import React from 'react';
import { XCircle } from 'lucide-react';
import "../../../styles/Profile/modals/CancelBookingModal.css";

const CancelBookingModal = ({ isOpen, onClose, onConfirm, bookingDetails }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="profile-cancel-mbk" onClick={onClose}></div>
      <div className="profile-cancel-modal">
        <div className="profile-cancel-icon">
          <XCircle size={24} strokeWidth={1.5} />
        </div>
        <div className="profile-cancel-title">Cancel Booking?</div>
        <div className="profile-cancel-body">
          Cancelling this booking will release the dates. 
          {bookingDetails?.fee && ` Refund of ₹${bookingDetails.fee.toLocaleString()} will be processed as per cancellation policy.`}
        </div>
        <div className="profile-cancel-buttons">
          <button className="profile-cancel-btn-cancel" onClick={onClose}>
            Keep Booking
          </button>
          <button className="profile-cancel-btn-confirm" onClick={onConfirm}>
            Yes, Cancel Booking
          </button>
        </div>
      </div>
    </>
  );
};

export default CancelBookingModal;