import React, { useState } from 'react';
import MobileSectionLabel from '../ui/MobileSectionLabel';
import MobilePurchaseRow from '../rows/MobilePurchaseRow';
import MobilePurchaseDetailSheet from '../sheets/MobilePurchaseDetailSheet';
import "../../../../styles/Profile/mobile/sections/MobilePurchasesSection.css";

const MobilePurchasesSection = ({ onViewAll }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const purchaseOrders = [
    { 
      id: "#HOK-030325-007", 
      piece: "Coral Sharara Suit", 
      typeDetail: "Preloved · Excellent condition", 
      status: "Delivered", 
      total: 12500,
      imageGradient: "linear-gradient(160deg, #EAF0E5, #D5E5C8)"
    },
    { 
      id: "#HOK-100525-011", 
      piece: "Sage Silk Dupatta Set", 
      typeDetail: "Buy New · Anju Modi", 
      status: "Processing", 
      total: 18000,
      imageGradient: "linear-gradient(160deg, #E5F2EA, #C8E5D5)"
    },
    { 
      id: "#HOK-180125-008", 
      piece: "Ivory Silk Kurta Set", 
      typeDetail: "Buy New · Ritu Kumar", 
      status: "Delivered", 
      total: 8400,
      imageGradient: "linear-gradient(160deg, #F0E8D8, #E2D0B8)"
    }
  ];

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
            count={4}
            linkText="View all"
            onLinkClick={onViewAll}
          />
          <div className="profile-mobile-item-block">
            {purchaseOrders.map((order) => (
              <MobilePurchaseRow
                key={order.id}
                order={order}
                onClick={handleRowClick}
              />
            ))}
          </div>
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