// src\components\Profile\cards\RentalCard.jsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import "../../../styles/Profile/cards/RentalCard.css";

const RentalCard = ({ booking, isActive, onDetailsClick }) => {
    const getBadgeClass = (status) => {
        switch (status) {
            case 'Dispatched': return 'profile-rental-b-dis';
            case 'Confirmed': return 'profile-rental-b-con';
            case 'Completed': return 'profile-rental-b-com';
            case 'Returned': return 'profile-rental-b-ret';
            case 'Delivered': return 'profile-rental-b-del';
            case 'Processing': return 'profile-rental-b-pro';
            case 'Listed Active': return 'profile-rental-b-lst';
            case 'Rental': return 'profile-rental-b-ren';
            case 'Cancelled': return 'profile-rental-b-can';
            default: return '';
        }
    };

    return (
        <div
            className={`profile-rental-pc ${isActive ? 'profile-rental-active-card' : ''}`}
            onClick={() => onDetailsClick(booking.id)}
        >
            <div className="profile-rental-pc-image" style={{ overflow: "hidden" }}>
                {booking.image ? (
                    <img
                        src={booking.image}
                        alt={booking.piece || "Rental piece"}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                ) : (
                    <svg className="profile-rental-pc-placeholder" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="4" y="4" width="24" height="24" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                    </svg>
                )}
            </div>

            <div className="profile-rental-pc-body">
                <div className={`profile-rental-badge ${getBadgeClass(booking.status)}`}>
                    <span className="profile-rental-bdot"></span>
                    {booking.status}
                </div>

                <div className="profile-rental-pc-name">{booking.piece}</div>
                <div className="profile-rental-pc-designer">{booking.designer}</div>
                <div className="profile-rental-pc-meta">{booking.dates}</div>


                {booking.depositStatus === 'pending' && (
                    <span className="profile-rental-dpill profile-rental-dpill-p">
                        DEPOSIT {booking.depositAmount ? `₹${Number(booking.depositAmount).toLocaleString()}` : '₹15,000'} PENDING
                    </span>
                )}
                {booking.depositStatus === 'refunded' && (
                    <span className="profile-rental-dpill profile-rental-dpill-r">DEPOSIT REFUNDED</span>
                )}

                <div className="profile-rental-pc-footer">
                    <div className="profile-rental-pc-price">₹{Number(booking.fee || 0).toLocaleString()}</div>
                    <button className="profile-rental-pc-details" onClick={(e) => { e.stopPropagation(); onDetailsClick(booking.id); }}>
                        DETAILS
                        <ChevronRight size={11} strokeWidth={1.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RentalCard;