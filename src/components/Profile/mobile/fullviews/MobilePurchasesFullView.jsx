import React, { useState } from 'react';
import MobileFullViewBar from '../common/MobileFullViewBar';
import MobilePurchaseRow from '../rows/MobilePurchaseRow';
import "../../../../styles/Profile/mobile/fullviews/MobilePurchasesFullView.css";

const MobilePurchasesFullView = ({ onBack }) => {
  const [purchaseOrders] = useState([
    { id: "#HOK-030325-007", piece: "Coral Sharara Suit", type: "Preloved", typeDetail: "Preloved · Excellent condition", status: "Delivered", amount: 12500 },
    { id: "#HOK-100525-011", piece: "Sage Silk Dupatta Set", type: "Buy New", typeDetail: "Buy New · Anju Modi", status: "Processing", amount: 18000 },
    { id: "#HOK-180125-008", piece: "Ivory Silk Kurta Set", type: "Buy New", typeDetail: "Buy New · Ritu Kumar", status: "Delivered", amount: 8400 },
    { id: "#HOK-021124-009", piece: "Navy Chanderi Kurta", type: "Buy New", typeDetail: "Buy New · Sabyasachi", status: "Cancelled", amount: 14500 }
  ]);

  const handleRowClick = (id) => {
    console.log("Open purchase detail sheet for:", id);
  };

  return (
    <div className="profile-mobile-fv-container">
      <MobileFullViewBar title="My Purchases" count="4 orders" onBack={onBack} />
      <div className="profile-mobile-fv-content">
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
  );
};

export default MobilePurchasesFullView;