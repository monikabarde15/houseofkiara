import React from 'react';
import { ChevronRight } from 'lucide-react';
import "../../../../styles/Profile/mobile/alerts/MobileActiveRentalAlert.css";

const MobileActiveRentalAlert = ({ onPress }) => {
  return (
    <div className="profile-mobile-alert-bar" data-rise="2" onClick={onPress}>
      <div className="profile-mobile-alert-dot"></div>
      <div className="profile-mobile-alert-text">
        <div className="profile-mobile-alert-title">Active Rental · Dispatched</div>
        <div className="profile-mobile-alert-subtitle">
          Ivory Tissue Lehenga · Return by 28 May 2025 · Deposit ₹15,000 pending
        </div>
      </div>
          <ChevronRight
              className="profile-mobile-alert-arrow"
              strokeWidth={1.5}
          />
    </div>
  );
};

export default MobileActiveRentalAlert;