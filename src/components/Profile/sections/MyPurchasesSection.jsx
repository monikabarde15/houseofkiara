// src\components\Profile\sections\MyPurchasesSection.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PurchaseCard from '../cards/PurchaseCard';
import PurchaseDetailPanel from '../panels/PurchaseDetailPanel';
import "../../../styles/Profile/sections/MyPurchasesSection.css";

const MyPurchasesSection = ({ purchases }) => {
  const [activeCardId, setActiveCardId] = useState(null);
  const panelRef = useRef(null);
  const cardRefs = useRef({});
  const scrollTimeoutRef = useRef(null);

  const purchaseOrders = Array.isArray(purchases) ? purchases : [];

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
      {purchaseOrders.length === 0 ? (
        <div className="profile-sub-empty" style={{ margin: "8px 0 20px" }}>
          <div className="profile-se-h">No purchase orders yet</div>
          <div className="profile-se-s">
            Discover our curated preloved and ready-to-ship new designer couture.
          </div>
          <Link to="/category" className="profile-se-btn" style={{ textDecoration: 'none' }}>
            Shop Collection
          </Link>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default MyPurchasesSection;