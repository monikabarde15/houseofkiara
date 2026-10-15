import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import RentalCard from '../cards/RentalCard';
import RentalDetailPanel from '../panels/RentalDetailPanel';
import "../../../styles/Profile/right/ViewRentals.css";

const ViewRentals = ({ rentals, onBack }) => {
  const [activeCardId, setActiveCardId] = useState(null);
  const panelRef = useRef(null);
  const cardRefs = useRef({});
  const scrollTimeoutRef = useRef(null);

  const rentalBookings = Array.isArray(rentals) ? rentals : [];

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
        <div className="profile-fv-bar-count">
          {rentalBookings.length} booking{rentalBookings.length === 1 ? '' : 's'}
        </div>
      </div>

      {rentalBookings.length === 0 ? (
        <div className="profile-sub-empty" style={{ margin: "24px" }}>
          <div className="profile-se-h">No rental bookings yet</div>
          <div className="profile-se-s">
            Explore luxury designer outfits for your upcoming occasions and celebrate in style.
          </div>
        </div>
      ) : (
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
      )}

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