import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import PurchaseCard from '../cards/PurchaseCard';
import PurchaseDetailPanel from '../panels/PurchaseDetailPanel';
import "../../../styles/Profile/right/ViewPurchases.css";

const ViewPurchases = ({ purchases, onBack }) => {
  const [activeCardId, setActiveCardId] = useState(null);
  const panelRef = useRef(null);
  const cardRefs = useRef({});
  const scrollTimeoutRef = useRef(null);

  const purchaseOrders = Array.isArray(purchases) ? purchases : [];

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
        <div className="profile-fv-purchases-bar-count">
          {purchaseOrders.length} order{purchaseOrders.length === 1 ? '' : 's'}
        </div>
      </div>

      {purchaseOrders.length === 0 ? (
        <div className="profile-sub-empty" style={{ margin: "24px" }}>
          <div className="profile-se-h">No purchase orders yet</div>
          <div className="profile-se-s">
            Discover our curated preloved and ready-to-ship new designer couture.
          </div>
        </div>
      ) : (
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
      )}

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