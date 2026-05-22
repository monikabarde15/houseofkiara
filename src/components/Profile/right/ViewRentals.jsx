import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import RentalCard from '../cards/RentalCard';
import RentalDetailPanel from '../panels/RentalDetailPanel';
import "../../../styles/Profile/right/ViewRentals.css";

const ViewRentals = ({ onBack }) => {
  const [activeCardId, setActiveCardId] = useState(null);
  const panelRef = useRef(null);
  const cardRefs = useRef({});
  const scrollTimeoutRef = useRef(null);

  const rentalBookings = [
    { id: "HOK-240524-001", piece: "Ivory Tissue Lehenga", designer: "Manish Malhotra", status: "Dispatched", dates: "24–28 May 2025", fee: 8500, depositStatus: "pending" },
    { id: "HOK-100625-002", piece: "Emerald Banarasi Saree", designer: "Raw Mango", status: "Confirmed", dates: "10–14 Jun 2025", fee: 4800, depositStatus: null },
    { id: "HOK-120225-003", piece: "Blush Anarkali Set", designer: "Anita Dongre", status: "Completed", dates: "12–16 Feb 2025", fee: 5200, depositStatus: "refunded" },
    { id: "HOK-180125-004", piece: "Sage Chanderi Suit", designer: "Mrunalini Rao", status: "Returned", dates: "18–22 Jan 2025", fee: 3600, depositStatus: "refunded" },
    { id: "HOK-051224-005", piece: "Burgundy Velvet Lehenga", designer: "Tarun Tahiliani", status: "Cancelled", dates: "5–9 Dec 2024", fee: 11200, depositStatus: null }
  ];

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleDetailsClick = (bookingId) => {
    const isOpening = activeCardId !== bookingId;
    
    // Clear any pending scroll timeouts
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    if (isOpening) {
      // Opening panel
      setActiveCardId(bookingId);
      
      // 40ms delay before scrolling to panel
      scrollTimeoutRef.current = setTimeout(() => {
        if (panelRef.current) {
          panelRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
          });
        }
        scrollTimeoutRef.current = null;
      }, 40);
    } else {
      // Closing panel - store current card ID before clearing state
      const currentCardId = activeCardId;
      setActiveCardId(null);
      
      // 40ms delay before scrolling back to card
      scrollTimeoutRef.current = setTimeout(() => {
        const cardElement = cardRefs.current[currentCardId];
        if (cardElement) {
          cardElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
          });
        }
        scrollTimeoutRef.current = null;
      }, 40);
    }
  };

  const activeBooking = rentalBookings.find(b => b.id === activeCardId);

  return (
    <div className="profile-fv-rentals">
      <div className="profile-fv-bar">
        <button className="profile-fv-back" onClick={onBack}>
          <ChevronLeft size={14} strokeWidth={1.5} />
          Back to overview
        </button>
        <div className="profile-fv-bar-title">My Rentals</div>
        <div className="profile-fv-bar-count">5 bookings</div>
      </div>

      <div className="profile-fv-rental-grid">
        {rentalBookings.map((booking) => (
          <div
            key={booking.id}
            ref={(el) => {
              if (el) cardRefs.current[booking.id] = el;
            }}
          >
            <RentalCard
              booking={booking}
              isActive={activeCardId === booking.id}
              onDetailsClick={handleDetailsClick}
            />
          </div>
        ))}
      </div>

      {/* Panel container with ref for scrolling */}
      <div ref={panelRef}>
        <RentalDetailPanel 
          booking={activeBooking}
          isOpen={!!activeCardId}
          onClose={() => handleDetailsClick(activeCardId)}
        />
      </div>
    </div>
  );
};

export default ViewRentals;