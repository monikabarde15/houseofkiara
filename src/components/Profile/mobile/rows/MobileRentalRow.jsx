import React from 'react';
import { ChevronRight } from 'lucide-react';
import "../../../../styles/Profile/mobile/rows/MobileRentalRow.css";

const MobileRentalRow = ({ booking, onClick }) => {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Dispatched': return 'profile-mobile-b-dis';
      case 'Confirmed': return 'profile-mobile-b-con';
      case 'Completed': return 'profile-mobile-b-com';
      case 'Returned': return 'profile-mobile-b-ret';
      case 'Cancelled': return 'profile-mobile-b-can';
      default: return '';
    }
  };

  const getDotColor = (status) => {
    switch (status) {
      case 'Dispatched': return '#A8844A';
      case 'Confirmed': return '#2A4466';
      case 'Completed': return '#8A7E72';
      case 'Returned': return '#8A7E72';
      case 'Cancelled': return '#8A7E72';
      default: return '#8A7E72';
    }
  };

  return (
    <div className="profile-mobile-prow" onClick={() => onClick(booking.id)}>
      {/* Thumbnail */}
      <div className="profile-mobile-prow-img">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="16" height="16" stroke="currentColor" strokeWidth="1" opacity="0.18" />
        </svg>
      </div>

      {/* Body */}
      <div className="profile-mobile-prow-body">
        <div className={`profile-mobile-badge ${getBadgeClass(booking.status)}`}>
          <span className="profile-mobile-bdot" style={{ backgroundColor: getDotColor(booking.status) }}></span>
          {booking.status}
        </div>
        <div className="profile-mobile-prow-name">{booking.piece}</div>
        <div className="profile-mobile-prow-meta">{booking.designer} · {booking.dates}</div>
        
        {booking.depositStatus === 'pending' && (
          <div className="profile-mobile-pill profile-mobile-pill-p">DEPOSIT PENDING</div>
        )}
        {booking.depositStatus === 'refunded' && (
          <div className="profile-mobile-pill profile-mobile-pill-r">DEPOSIT REFUNDED</div>
        )}

        <div className="profile-mobile-prow-price">₹{booking.fee.toLocaleString()}</div>
      </div>

      {/* Arrow */}
      <ChevronRight className="profile-mobile-prow-arrow" />
    </div>
  );
};

export default MobileRentalRow;