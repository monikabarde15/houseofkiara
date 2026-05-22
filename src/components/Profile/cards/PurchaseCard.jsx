import React from 'react';
import { ChevronRight } from 'lucide-react';
import "../../../styles/Profile/cards/PurchaseCard.css";

const PurchaseCard = ({ order, isActive, onDetailsClick }) => {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Delivered': return 'profile-purch-b-del';
      case 'Processing': return 'profile-purch-b-pro';
      case 'Cancelled': return 'profile-purch-b-can';
      default: return '';
    }
  };

  const getButtonText = (status) => {
    if (status === 'Processing') return 'TRACK';
    return 'DETAILS';
  };

  return (
    <div
      className={`profile-purch-pc ${isActive ? 'profile-purch-active-card' : ''}`}
      onClick={() => onDetailsClick(order.id)}
    >
      <div className="profile-purch-pc-image">
        <svg className="profile-purch-pc-placeholder" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="4" width="24" height="24" stroke="currentColor" strokeWidth="1" opacity="0.2" />
        </svg>
      </div>

      <div className="profile-purch-pc-body">
        <div className={`profile-purch-badge ${getBadgeClass(order.status)}`}>
          <span className="profile-purch-bdot"></span>
          {order.status}
        </div>

        <div className="profile-purch-pc-name">{order.piece}</div>
        <div className="profile-purch-pc-type">{order.typeDetail}</div>
        <div className="profile-purch-pc-date">{order.date}</div>

        <div className="profile-purch-pc-footer">
          <div className="profile-purch-pc-price">₹{order.amount.toLocaleString()}</div>
          <button className="profile-purch-pc-details" onClick={(e) => { e.stopPropagation(); onDetailsClick(order.id); }}>
            {getButtonText(order.status)}
            <ChevronRight size={11} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCard;