import React from 'react';
import { ChevronRight } from 'lucide-react';
import "../../../../styles/Profile/mobile/rows/MobileListedRow.css";

const MobileListedRow = ({ piece, onClick }) => {
  const isRental = piece.mode === 'Rental' || piece.mode === 'Dual';
  const isResale = piece.mode === 'Resale' || piece.mode === 'Dual';
  const isDual = piece.mode === 'Dual';

  return (
    <div className="profile-mobile-lrow" onClick={() => onClick(piece.id)}>
      {/* Image with Ribbon */}
      <div className="profile-mobile-lrow-img" style={{ background: piece.imageGradient }}>
        <div className="profile-mobile-lrow-ribbon">
          <div className="profile-mobile-lrow-earned">
            <div className="profile-mobile-lrow-earned-n">₹{piece.totalEarned.toLocaleString()}</div>
            <div className="profile-mobile-lrow-earned-label">
              {piece.mode === 'Resale' ? 'Earned so far' : 'Total earned'}
            </div>
          </div>
          {isRental && piece.timesRented > 0 && (
            <div className="profile-mobile-lrow-times">
              <div className="profile-mobile-lrow-times-n">{piece.timesRented}×</div>
              <div className="profile-mobile-lrow-times-label">Rented</div>
            </div>
          )}
        </div>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="16" height="16" stroke="currentColor" strokeWidth="1" opacity="0.18" />
        </svg>
      </div>

      {/* Body */}
      <div className="profile-mobile-lrow-body">
        {/* Mode Badges Row */}
        <div className="profile-mobile-lrow-badges">
          <span className="profile-mobile-badge profile-mobile-b-lst">Listed · Active</span>
          {isRental && <span className="profile-mobile-badge profile-mobile-b-ren">Rental</span>}
          {isResale && <span className="profile-mobile-badge profile-mobile-b-resale">Resale</span>}
        </div>
        
        <div className="profile-mobile-lrow-name">{piece.name}</div>
        <div className="profile-mobile-lrow-meta">
          Listed since {piece.listedSince} · {piece.size}
        </div>
        
        {/* Pricing */}
        <div className="profile-mobile-lrow-price">
          {isDual ? (
            <>Rental: ₹{piece.rentalPrice}/booking · Resale: ₹{piece.resalePrice.toLocaleString()}</>
          ) : isRental ? (
            <>Rental: ₹{piece.rentalPrice}/booking</>
          ) : (
            <>Resale: ₹{piece.resalePrice.toLocaleString()}</>
          )}
        </div>
        
        {/* Payout Line */}
        <div className="profile-mobile-lrow-payout">
          {piece.nextPayout ? (
            <>₹{piece.nextPayout.toLocaleString()} <span>next payout</span></>
          ) : (
            <span className="profile-mobile-lrow-no-bookings">No bookings yet</span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight size={16} strokeWidth={1.5} className="profile-mobile-lrow-arrow" />
    </div>
  );
};

export default MobileListedRow;