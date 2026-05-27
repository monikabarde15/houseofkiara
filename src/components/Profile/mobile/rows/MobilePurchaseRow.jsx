import React from 'react';
import { ChevronRight } from 'lucide-react';
import "../../../../styles/Profile/mobile/rows/MobilePurchaseRow.css";

const MobilePurchaseRow = ({ order, onClick }) => {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Delivered': return 'profile-mobile-b-del';
      case 'Processing': return 'profile-mobile-b-pro';
      case 'Cancelled': return 'profile-mobile-b-can';
      default: return '';
    }
  };

  const getDotColor = (status) => {
    switch (status) {
      case 'Delivered': return '#6B7E5A';
      case 'Processing': return '#B85C38';
      case 'Cancelled': return '#8A7E72';
      default: return '#8A7E72';
    }
  };

  return (
    <div className="profile-mobile-prow" onClick={() => onClick(order.id)}>
      {/* Thumbnail */}
      <div className="profile-mobile-prow-img">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="16" height="16" stroke="currentColor" strokeWidth="1" opacity="0.18" />
        </svg>
      </div>

      {/* Body */}
      <div className="profile-mobile-prow-body">
        <div className={`profile-mobile-badge ${getBadgeClass(order.status)}`}>
          <span className="profile-mobile-bdot" style={{ backgroundColor: getDotColor(order.status) }}></span>
          {order.status}
        </div>
        <div className="profile-mobile-prow-name">{order.piece}</div>
        <div className="profile-mobile-prow-meta">{order.typeDetail}</div>
        <div className="profile-mobile-prow-price">₹{order.total.toLocaleString()}</div>
      </div>

      {/* Arrow */}
      <ChevronRight size={16} strokeWidth={1.5} className="profile-mobile-prow-arrow" />
    </div>
  );
};

export default MobilePurchaseRow;