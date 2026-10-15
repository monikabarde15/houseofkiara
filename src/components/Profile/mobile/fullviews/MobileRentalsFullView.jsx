import React, { useState } from 'react';
import MobileFullViewBar from '../common/MobileFullViewBar';
import MobileRentalRow from '../rows/MobileRentalRow';
import "../../../../styles/Profile/mobile/fullviews/MobileRentalsFullView.css";

const MobileRentalsFullView = ({ rentals, onBack }) => {
  const rentalBookings = Array.isArray(rentals) ? rentals : [];
  const countStr = `${rentalBookings.length} booking${rentalBookings.length === 1 ? '' : 's'}`;

  const handleRowClick = (id) => {
    console.log("Open rental detail sheet for:", id);
  };

  return (
    <div className="profile-mobile-fv-container">
      <MobileFullViewBar title="My Rentals" count={countStr} onBack={onBack} />
      <div className="profile-mobile-fv-content">
        {rentalBookings.length === 0 ? (
          <div className="profile-sub-empty" style={{ margin: "20px" }}>
            <div className="profile-se-h">No rental bookings yet</div>
            <div className="profile-se-s">
              Explore luxury designer outfits for your upcoming occasions.
            </div>
          </div>
        ) : (
          <div className="profile-mobile-item-block">
            {rentalBookings.map((booking) => (
              <MobileRentalRow
                key={booking.id}
                booking={booking}
                onClick={handleRowClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileRentalsFullView;