import React, { useState } from 'react';
import MobileSectionLabel from '../ui/MobileSectionLabel';
import MobilePurchaseRow from '../rows/MobilePurchaseRow';
import MobilePurchaseDetailSheet from '../sheets/MobilePurchaseDetailSheet';
import "../../../../styles/Profile/mobile/sections/MobilePurchasesSection.css";

const MobilePurchasesSection = ({ purchases, onViewAll }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const purchaseOrders = Array.isArray(purchases) ? purchases : [];

  const handleRowClick = (id) => {
    const order = purchaseOrders.find(o => o.id === id);
    setSelectedOrder(order);
    setIsSheetOpen(true);
  };

  return (
    <>
      <div className="profile-mobile-purchases-section">
        <div className="profile-mobile-section-container">
          <MobileSectionLabel 
            title="MY PURCHASES"
            count={purchaseOrders.length}
            linkText={purchaseOrders.length > 3 ? "View all" : ""}
            onLinkClick={onViewAll}
          />
          {purchaseOrders.length === 0 ? (
            <div className="profile-sub-empty" style={{ margin: "10px 0" }}>
              <div className="profile-se-h">No purchase orders yet</div>
              <div className="profile-se-s">
                Discover our curated preloved and ready-to-ship new designer couture.
              </div>
            </div>
          ) : (
            <div className="profile-mobile-item-block">
              {purchaseOrders.map((order) => (
                <MobilePurchaseRow
                  key={order.id}
                  order={order}
                  onClick={handleRowClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <MobilePurchaseDetailSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        order={selectedOrder}
      />
    </>
  );
};

export default MobilePurchasesSection;