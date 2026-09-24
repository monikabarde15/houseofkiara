import React from 'react';
import { ChevronRight } from 'lucide-react';
import "../../../styles/Profile/cards/PurchaseCard.css";

const PurchaseCard = ({ order, isActive, onDetailsClick }) => {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Delivered': return 'profile-purch-b-del';
      case 'Processing': 
      case 'Confirmed': return 'profile-purch-b-pro';
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
      onClick={() => onDetailsClick(order.orderId || order.id || order._id)}
    >
      <div className="profile-purch-pc-image">
        {(order.items?.[0]?.image || order.image) ? (
          <img src={order.items?.[0]?.image || order.image} alt={order.items?.[0]?.productName || order.piece || "Product"} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        ) : (
          <svg className="profile-purch-pc-placeholder" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="4" width="24" height="24" stroke="currentColor" strokeWidth="1" opacity="0.2" />
          </svg>
        )}
      </div>

      <div className="profile-purch-pc-body">
        <div className={`profile-purch-badge ${getBadgeClass(order.status)}`}>
          <span className="profile-purch-bdot"></span>
          {order.status}
        </div>

        <div className="profile-purch-pc-name">{order.items?.[0]?.productName || order.piece}</div>
        <div className="profile-purch-pc-type">{order.items?.[0]?.mode ? `${order.items[0].mode} - ${order.items[0].designer}` : order.typeDetail}</div>
        <div className="profile-purch-pc-date">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : order.date}</div>

        <div className="profile-purch-pc-footer">
          <div className="profile-purch-pc-price">₹{(order.grandTotal || order.amount || 0).toLocaleString()}</div>
          <button className="profile-purch-pc-details" onClick={(e) => { e.stopPropagation(); onDetailsClick(order.orderId || order.id || order._id); }}>
            {getButtonText(order.status)}
            <ChevronRight size={11} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCard;