import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import PurchaseCard from '../cards/PurchaseCard';
import PurchaseDetailPanel from '../panels/PurchaseDetailPanel';
import "../../../styles/Profile/right/ViewPurchases.css";

const ViewPurchases = ({ onBack }) => {
  const [activeCardId, setActiveCardId] = useState(null);
  const panelRef = useRef(null);
  const cardRefs = useRef({});
  const scrollTimeoutRef = useRef(null);

  const purchaseOrders = [
    { 
      id: "#HOK-030325-007", 
      piece: "Coral Sharara Suit", 
      type: "Preloved", 
      typeDetail: "Preloved - Excellent condition",
      status: "Delivered", 
      amount: 12500, 
      date: "Delivered 3 Mar 2025" 
    },
    { 
      id: "#HOK-100525-011", 
      piece: "Sage Silk Dupatta Set", 
      type: "Buy New", 
      typeDetail: "Buy New - Anju Modi",
      status: "Processing", 
      amount: 18000, 
      date: "Ordered 10 May 2025" 
    },
    { 
      id: "#HOK-180125-008", 
      piece: "Ivory Silk Kurta Set", 
      type: "Buy New", 
      typeDetail: "Buy New - Ritu Kumar",
      status: "Delivered", 
      amount: 8400, 
      date: "Delivered 18 Jan 2025" 
    },
    { 
      id: "#HOK-021124-009", 
      piece: "Navy Chanderi Kurta", 
      type: "Buy New", 
      typeDetail: "Buy New - Sabyasachi",
      status: "Cancelled", 
      amount: 14500, 
      date: "2 Nov 2024" 
    }
  ];

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleDetailsClick = (orderId) => {
    const isOpening = activeCardId !== orderId;
    
    // Clear any pending scroll timeouts
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    if (isOpening) {
      // Opening panel
      setActiveCardId(orderId);
      
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

  const activeOrder = purchaseOrders.find(o => o.id === activeCardId);

  return (
    <div className="profile-fv-purchases">
      <div className="profile-fv-purchases-bar">
        <button className="profile-fv-purchases-back" onClick={onBack}>
          <ChevronLeft size={14} strokeWidth={1.5} />
          Back to overview
        </button>
        <div className="profile-fv-purchases-bar-title">My Purchases</div>
        <div className="profile-fv-purchases-bar-count">4 orders</div>
      </div>

      <div className="profile-fv-purchases-grid">
        {purchaseOrders.map((order) => (
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
        ))}
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