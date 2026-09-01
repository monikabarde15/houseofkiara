import React, { useState, useRef, useEffect } from 'react';
import PurchaseCard from '../cards/PurchaseCard';
import PurchaseDetailPanel from '../panels/PurchaseDetailPanel';
import "../../../styles/Profile/sections/MyPurchasesSection.css";

const MyPurchasesSection = () => {
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

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleDetailsClick = (orderId) => {
    const isOpening = activeCardId !== orderId;
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    if (isOpening) {
      setActiveCardId(orderId);
      
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
      const currentCardId = activeCardId;
      setActiveCardId(null);
      
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
    <div className="profile-right-my-purchases-section" id="purchases">
      <div className="profile-right-purchases-grid">
        {purchaseOrders.slice(0, 3).map((order) => (
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