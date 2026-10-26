import React from 'react';
import { ArrowRight } from 'lucide-react';
import "../../../styles/Profile/sections/ActiveRentalAlert.css";

const ActiveRentalAlert = ({ alert, onAlertClick }) => {
  if (!alert) return null;

  const handleClick = () => {
    if (onAlertClick) {
      onAlertClick(alert.id);
    }
  };

  return (
    <div className="profile-active-rental-alert" onClick={handleClick}>
      <div className="profile-alert-pulse-dot"></div>
      
      <div className="profile-alert-text-block">
        <div className="profile-alert-title">{alert.title || "Active Rental"}</div>
        <div className="profile-alert-subtitle">
          {alert.subtitle}
        </div>
      </div>
      
      <button className="profile-alert-cta">
        View Details
        <ArrowRight size={12} strokeWidth={1.5} />
      </button>
    </div>
  );
};

export default ActiveRentalAlert;