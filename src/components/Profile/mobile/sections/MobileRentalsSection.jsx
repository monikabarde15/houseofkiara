import React, { useState } from 'react';
import MobileSectionLabel from '../ui/MobileSectionLabel';
import MobileRentalRow from '../rows/MobileRentalRow';
import "../../../../styles/Profile/mobile/sections/MobileRentalsSection.css";
import MobileRentalDetailSheet from '../sheets/MobileRentalDetailSheet';

const MobileRentalsSection = ({ rentals, onViewAll }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const rentalBookings = Array.isArray(rentals) ? rentals : [];

  const handleRowClick = (id) => {
    const booking = rentalBookings.find(b => b.id === id);
    setSelectedBooking(booking);
    setIsSheetOpen(true);
  };

  return (
    <>
      <div className="profile-mobile-rentals-section">
        <div className="profile-mobile-section-container">
          <MobileSectionLabel 
            title="MY RENTALS"
            count={rentalBookings.length}
            countLabel="BOOKINGS"
            linkText={rentalBookings.length > 3 ? "View all" : ""}
            onLinkClick={onViewAll}
          />
          {rentalBookings.length === 0 ? (
            <div className="profile-sub-empty" style={{ margin: "10px 0" }}>
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

      <MobileRentalDetailSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        booking={selectedBooking}
      />
    </>
  );
};

export default MobileRentalsSection;