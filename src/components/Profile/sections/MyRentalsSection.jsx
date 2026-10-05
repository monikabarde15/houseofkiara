// src\components\Profile\sections\MyRentalsSection.jsx
import React, { useState, useRef, useEffect } from "react";
import RentalCard from "../cards/RentalCard";
import RentalDetailPanel from "../panels/RentalDetailPanel";
import "../../../styles/Profile/sections/MyRentalsSection.css";

const MyRentalsSection = ({ openDetailId, setOpenDetailId }) => {
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
        // Filter only orders that are rentals
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

  // Open detail panel for active rental
  useEffect(() => {
    if (openDetailId) {
      handleDetailsClick(openDetailId);
      setOpenDetailId(null);
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
    <div className="profile-right-my-rentals-section" id="rentals">
      <div className="profile-right-rental-grid">
        {loading ? (
          <div style={{ padding: "20px", color: "#666" }}>
            Loading rentals...
          </div>
        ) : rentalOrders.length === 0 ? (
          <div style={{ padding: "20px", color: "#666" }}>
            No rental bookings found.
          </div>
        ) : (
          rentalOrders.slice(0, 3).map((order) => (
            <div
              key={order.id || order.orderId}
              ref={(el) => {
                if (el) cardRefs.current[order.id || order.orderId] = el;
              }}
            >
              <RentalCard
                booking={order}
                isActive={activeCardId === (order.id || order.orderId)}
                onDetailsClick={() =>
                  handleDetailsClick(order.id || order.orderId)
                }
              />
            </div>
          ))
        )}
      </div>

      {/* Panel container with ref for scrolling */}
      <div ref={panelRef}>
        <RentalDetailPanel
          booking={activeOrder}
          isOpen={!!activeCardId}
          onClose={() => handleDetailsClick(activeCardId)}
          onRefresh={() => {
            fetchRentals();
            handleDetailsClick(activeCardId);
          }}
        />
      </div>
    </div>
  );
};

export default MyRentalsSection;
