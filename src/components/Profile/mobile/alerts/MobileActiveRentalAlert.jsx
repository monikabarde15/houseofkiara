import React from 'react';
import { ChevronRight } from 'lucide-react';
import "../../../../styles/Profile/mobile/alerts/MobileActiveRentalAlert.css";

const MobileActiveRentalAlert = ({ alert, onPress }) => {
  if (!alert) return null;

  return (
    <div className="profile-mobile-alert-bar" data-rise="2" onClick={onPress}>
      <div className="profile-mobile-alert-dot"></div>
      <div className="profile-mobile-alert-text">
        <div className="profile-mobile-alert-title">{alert.title || "Active Rental"}</div>
        <div className="profile-mobile-alert-subtitle">
          {alert.subtitle}
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