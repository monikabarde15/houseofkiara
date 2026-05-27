import React, { useState } from 'react';
import MobileFullViewBar from '../common/MobileFullViewBar';
import MobileRentalRow from '../rows/MobileRentalRow';
import "../../../../styles/Profile/mobile/fullviews/MobileRentalsFullView.css";

const MobileRentalsFullView = ({ onBack }) => {
  const [rentalBookings] = useState([
    { id: "HOK-240524-001", piece: "Ivory Tissue Lehenga", designer: "Manish Malhotra", status: "Dispatched", dates: "24–28 May 2025", fee: 8500, depositStatus: "pending" },
    { id: "HOK-100625-002", piece: "Emerald Banarasi Saree", designer: "Raw Mango", status: "Confirmed", dates: "10–14 Jun 2025", fee: 4800, depositStatus: null },
    { id: "HOK-120225-003", piece: "Blush Anarkali Set", designer: "Anita Dongre", status: "Completed", dates: "12–16 Feb 2025", fee: 5200, depositStatus: "refunded" },
    { id: "HOK-180125-004", piece: "Sage Chanderi Suit", designer: "Mrunalini Rao", status: "Returned", dates: "18–22 Jan 2025", fee: 3600, depositStatus: "refunded" },
    { id: "HOK-051224-005", piece: "Burgundy Velvet Lehenga", designer: "Tarun Tahiliani", status: "Cancelled", dates: "5–9 Dec 2024", fee: 11200, depositStatus: null }
  ]);

  const handleRowClick = (id) => {
    console.log("Open rental detail sheet for:", id);
  };

  return (
    <div className="profile-mobile-fv-container">
      <MobileFullViewBar title="My Rentals" count="5 bookings" onBack={onBack} />
      <div className="profile-mobile-fv-content">
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
  );
};

export default MobileRentalsFullView;