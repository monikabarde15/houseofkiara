import React, { useEffect } from 'react';
import { XCircle } from 'lucide-react';
import "../../../../styles/Profile/mobile/modals/MobileCancelBookingModal.css";

const MobileCancelBookingModal = ({ isOpen, onClose, onConfirm, bookingDetails }) => {
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
      <div className="profile-mobile-cancel-backdrop" onClick={onClose} />
      <div className="profile-mobile-cancel-modal">
        <div className="profile-mobile-cancel-icon">
          <XCircle size={22} strokeWidth={1.5} />
        </div>
        <div className="profile-mobile-cancel-title">Cancel Booking?</div>
        <div className="profile-mobile-cancel-body">
          Cancellation policy applies. Refund eligibility depends on how far in advance you cancel.
        </div>
        <div className="profile-mobile-cancel-buttons">
          <button className="profile-mobile-cancel-btn-keep" onClick={onClose}>
            Keep Booking
          </button>
          <button className="profile-mobile-cancel-btn-confirm" onClick={onConfirm}>
            Yes, Cancel Booking
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileCancelBookingModal;