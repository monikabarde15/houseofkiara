import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import RentalCard from "../cards/RentalCard";
import RentalDetailPanel from "../panels/RentalDetailPanel";
import "../../../styles/Profile/right/ViewRentals.css";

const ViewRentals = ({ onBack }) => {
  const [activeCardId, setActiveCardId] = useState(null);
  const panelRef = useRef(null);
  const cardRefs = useRef({});
  const scrollTimeoutRef = useRef(null);

  const [rentalOrders, setRentalOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRentals = async () => {
    try {
      const authStore = await import("../../../store/authStore").then((m) =>
        m.default.getState(),
      );
      const token = authStore.token;
      if (!token) return;

      const res = await fetch(`/api/customer/auth/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        const rentals = data.data.filter(
          (order) => order.type === "Rental" || order.typeDetail === "Rental",
        );
        setRentalOrders(rentals);
      }
    } catch (err) {
      console.error("Error fetching rentals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleDetailsClick = async (bookingId) => {
    const isOpening = activeCardId !== bookingId;

    // Clear any pending scroll timeouts
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    if (isOpening) {
      // Opening panel
      setActiveCardId(bookingId);
      setActiveOrder(null);

      try {
        const authStore = await import("../../../store/authStore").then((m) =>
          m.default.getState(),
        );
        const token = authStore.token;
        if (token) {
          const res = await fetch(`/api/customer/auth/orders/${bookingId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.success) {
            setActiveOrder(data.data);
          }
        }
      } catch (err) {
        console.error("Error fetching rental detail:", err);
      }

      // 40ms delay before scrolling to panel
      scrollTimeoutRef.current = setTimeout(() => {
        if (panelRef.current) {
          panelRef.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
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
            behavior: "smooth",
            block: "nearest",
          });
        }
        scrollTimeoutRef.current = null;
      }, 40);
    }
  };

  return (
    <div className="profile-fv-rentals">
      <div className="profile-fv-bar">
        <button className="profile-fv-back" onClick={onBack}>
          <ChevronLeft size={14} strokeWidth={1.5} />
          Back to overview
        </button>
        <div className="profile-fv-bar-title">My Rentals</div>
        <div className="profile-fv-bar-count">
          {rentalOrders.length} bookings
        </div>
      </div>

      <div className="profile-view-rentals-grid">
        {loading ? (
          <div style={{ padding: "20px", color: "#666" }}>
            Loading rentals...
          </div>
        ) : rentalOrders.length === 0 ? (
          <div style={{ padding: "20px", color: "#666" }}>
            No rental bookings found.
          </div>
        ) : (
          rentalOrders.map((booking) => (
            <div
              key={booking.id || booking.orderId}
              ref={(el) => {
                if (el) cardRefs.current[booking.id || booking.orderId] = el;
              }}
            >
              <RentalCard
                booking={booking}
                isActive={activeCardId === (booking.id || booking.orderId)}
                onDetailsClick={() =>
                  handleDetailsClick(booking.id || booking.orderId)
                }
              />
            </div>
          ))
        )}
      </div>

      {/* Detail Panel */}
      <div ref={panelRef}>
        <RentalDetailPanel
          booking={activeOrder}
          isOpen={!!activeCardId}
          onClose={() => handleDetailsClick(activeCardId)}
          onRefresh={() => {
            fetchRentals();
            handleDetailsClick(activeCardId); // Close details after cancel
          }}
        />
      </div>
    </div>
  );
};

export default ViewRentals;
