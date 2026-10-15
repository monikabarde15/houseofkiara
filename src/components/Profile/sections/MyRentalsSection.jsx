// src\components\Profile\sections\MyRentalsSection.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RentalCard from '../cards/RentalCard';
import RentalDetailPanel from '../panels/RentalDetailPanel';
import "../../../styles/Profile/sections/MyRentalsSection.css";

const MyRentalsSection = ({ rentals, openDetailId, setOpenDetailId }) => {
  const [activeCardId, setActiveCardId] = useState(null);
  const panelRef = useRef(null);
  const cardRefs = useRef({});
  const scrollTimeoutRef = useRef(null);

  // Open detail panel for active rental
  useEffect(() => {
    if (openDetailId) {
      handleDetailsClick(openDetailId);
      if (setOpenDetailId) setOpenDetailId(null);
    }
  }, [openDetailId, setOpenDetailId]);

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

  const rentalBookings = Array.isArray(rentals) ? rentals : [];
  const activeBooking = rentalBookings.find(b => b.id === activeCardId);

  return (
    <div className="profile-right-my-rentals-section" id="rentals">
      {rentalBookings.length === 0 ? (
        <div className="profile-sub-empty" style={{ margin: "8px 0 20px" }}>
          <div className="profile-se-h">No rental bookings yet</div>
          <div className="profile-se-s">
            Explore luxury designer outfits for your upcoming occasions and celebrate in style.
          </div>
          <Link to="/category" className="profile-se-btn" style={{ textDecoration: 'none' }}>
            Explore Wardrobe
          </Link>
        </div>
      ) : (
        <>
          <div className="profile-right-rental-grid">
            {rentalBookings.slice(0, 3).map((booking) => (
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
        </>
      )}
    </div>
  );
};

export default MyRentalsSection;