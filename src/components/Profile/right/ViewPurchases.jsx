import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import PurchaseCard from "../cards/PurchaseCard";
import PurchaseDetailPanel from "../panels/PurchaseDetailPanel";
import useAuthStore from "../../../store/authStore";
import "../../../styles/Profile/right/ViewPurchases.css";

const ViewPurchases = ({ onBack }) => {
  const [activeCardId, setActiveCardId] = useState(null);
  const panelRef = useRef(null);
  const cardRefs = useRef({});
  const scrollTimeoutRef = useRef(null);

  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = useAuthStore.getState().token;
        if (!token) return;

        const res = await fetch(`/api/customer/auth/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          const purchases = data.data.filter(
            (order) => order.type !== "Rental" && order.typeDetail !== "Rental",
          );
          setPurchaseOrders(purchases);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleDetailsClick = async (orderId) => {
    const isOpening = activeCardId !== orderId;

    // Clear any pending scroll timeouts
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    if (isOpening) {
      // Opening panel
      setActiveCardId(orderId);
      setActiveOrder(null); // Clear previous

      // Fetch details
      try {
        const token = useAuthStore.getState().token;
        if (!token) return;

        const res = await fetch(`/api/customer/auth/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          // Format API response into what PurchaseDetailPanel expects
          const detailedOrder = data.data;

          setActiveOrder(detailedOrder);
        }
      } catch (err) {
        console.error("Error fetching order detail:", err);
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
    <div className="profile-fv-purchases">
      <div className="profile-fv-purchases-bar">
        <button className="profile-fv-purchases-back" onClick={onBack}>
          <ChevronLeft size={14} strokeWidth={1.5} />
          Back to overview
        </button>
        <div className="profile-fv-purchases-bar-title">My Purchases</div>
        <div className="profile-fv-purchases-bar-count">
          {purchaseOrders.length} orders
        </div>
      </div>

      <div className="profile-fv-purchases-grid">
        {loading ? (
          <div style={{ padding: "20px", color: "#666" }}>
            Loading orders...
          </div>
        ) : purchaseOrders.length === 0 ? (
          <div style={{ padding: "20px", color: "#666" }}>No orders found.</div>
        ) : (
          purchaseOrders.map((order) => (
            <div
              key={order.id}
              ref={(el) => {
                if (el) cardRefs.current[order.id] = el;
              }}
            >
              <PurchaseCard
                order={order}
                isActive={activeCardId === order.id}
                onDetailsClick={handleDetailsClick}
              />
            </div>
          ))
        )}
      </div>

      {/* Panel container with ref for scrolling */}
      <div ref={panelRef}>
        <PurchaseDetailPanel
          order={activeOrder}
          isOpen={!!activeCardId}
          onClose={() => handleDetailsClick(activeCardId)}
        />
      </div>
    </div>
  );
};

export default ViewPurchases;
