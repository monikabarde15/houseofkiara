import React from 'react';
import { ArrowRight } from 'lucide-react';
import "../../../styles/Profile/sections/ActiveRentalAlert.css";

const ActiveRentalAlert = ({ onAlertClick }) => {
  const handleClick = () => {
    if (onAlertClick) {
      onAlertClick();
    }
  };

  return (
    <div className="profile-active-rental-alert" onClick={handleClick}>
      <div className="profile-alert-pulse-dot"></div>
      
      <div className="profile-alert-text-block">
        <div className="profile-alert-title">Active Rental - Dispatched</div>
        <div className="profile-alert-subtitle">
          Ivory Tissue Lehenga · Manish Malhotra · Return by 28 May 2025 · Deposit ₹15,000 pending refund
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