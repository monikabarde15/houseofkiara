import React, { useState } from 'react';
import MobileFullViewBar from '../common/MobileFullViewBar';
import MobilePurchaseRow from '../rows/MobilePurchaseRow';
import "../../../../styles/Profile/mobile/fullviews/MobilePurchasesFullView.css";

const MobilePurchasesFullView = ({ purchases, onBack }) => {
  const purchaseOrders = Array.isArray(purchases) ? purchases : [];
  const countStr = `${purchaseOrders.length} order${purchaseOrders.length === 1 ? '' : 's'}`;

  const handleRowClick = (id) => {
    console.log("Open purchase detail sheet for:", id);
  };

  return (
    <div className="profile-mobile-fv-container">
      <MobileFullViewBar title="My Purchases" count={countStr} onBack={onBack} />
      <div className="profile-mobile-fv-content">
        {purchaseOrders.length === 0 ? (
          <div className="profile-sub-empty" style={{ margin: "20px" }}>
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
  );
};

export default MobilePurchasesFullView;