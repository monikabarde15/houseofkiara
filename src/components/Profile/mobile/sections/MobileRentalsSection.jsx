import React, { useState } from 'react';
import MobileSectionLabel from '../ui/MobileSectionLabel';
import MobileRentalRow from '../rows/MobileRentalRow';
import "../../../../styles/Profile/mobile/sections/MobileRentalsSection.css";
import MobileRentalDetailSheet from '../sheets/MobileRentalDetailSheet';

const MobileRentalsSection = ({ onViewAll }) => {

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [rentalBookings] = useState([
    { id: "HOK-240524-001", piece: "Ivory Tissue Lehenga", designer: "Manish Malhotra", status: "Dispatched", dates: "24–28 May 2025", fee: 8500, depositStatus: "pending" },
    { id: "HOK-100625-002", piece: "Emerald Banarasi Saree", designer: "Raw Mango", status: "Confirmed", dates: "10–14 Jun 2025", fee: 4800, depositStatus: null },
    { id: "HOK-120225-003", piece: "Blush Anarkali Set", designer: "Anita Dongre", status: "Completed", dates: "12–16 Feb 2025", fee: 5200, depositStatus: "refunded" }
  ]);

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
            count={5}
            countLabel="BOOKINGS"
            linkText="View all"
            onLinkClick={onViewAll}
          />
          <div className="profile-mobile-item-block">
            {rentalBookings.map((booking) => (
              <MobileRentalRow
                key={booking.id}
                booking={booking}
                onClick={handleRowClick}
              />
            ))}
          </div>
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