import React, { useState, useRef, useEffect } from "react";
import PurchaseCard from "../cards/PurchaseCard";
import PurchaseDetailPanel from "../panels/PurchaseDetailPanel";
import useAuthStore from "../../../store/authStore";
import "../../../styles/Profile/sections/MyPurchasesSection.css";

const MyPurchasesSection = () => {
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

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleDetailsClick = async (orderId) => {
    const isOpening = activeCardId !== orderId;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    if (isOpening) {
      setActiveCardId(orderId);
      setActiveOrder(null);

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
          setActiveOrder(data.data);
        }
      } catch (err) {
        console.error("Error fetching order detail:", err);
      }

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
      const currentCardId = activeCardId;
      setActiveCardId(null);

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
    <div className="profile-right-my-purchases-section" id="purchases">
      <div className="profile-right-purchases-grid">
        {loading ? (
          <div style={{ padding: "20px", color: "#666" }}>
            Loading orders...
          </div>
        ) : purchaseOrders.length === 0 ? (
          <div style={{ padding: "20px", color: "#666" }}>No orders found.</div>
        ) : (
          purchaseOrders.slice(0, 3).map((order) => (
            <div
              key={order.id}
              ref={(el) => {
                if (el) cardRefs.current[order.id] = el;
              }}
            >
              <PurchaseCard
                order={order}
                isActive={activeCardId === (order.orderId || order.id || order._id)}
                onDetailsClick={handleDetailsClick}
              />
            </div>
          ))
        )}
      </div>

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

export default MyPurchasesSection;
