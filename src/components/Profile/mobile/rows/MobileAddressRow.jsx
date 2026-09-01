import React from 'react';
import { SquarePen , Trash2 } from 'lucide-react';
import "../../../../styles/Profile/mobile/rows/MobileAddressRow.css";

const MobileAddressRow = ({ address, isDefault, onEdit, onDelete, onSetDefault }) => {
  return (
    <div className="profile-mobile-addr-item">
      {/* Label / Type Row */}
      <div className="profile-mobile-addr-type-row">
        <span className="profile-mobile-addr-type">{address.label}</span>
        {isDefault && <span className="profile-mobile-addr-default-badge">Default</span>}
      </div>

      {/* Recipient Name */}
      <div className="profile-mobile-addr-recipient">{address.recipientName}</div>

      {/* Address Lines */}
      <div className="profile-mobile-addr-lines">
        {address.line1}<br />
        {address.line2 && <>{address.line2}<br /></>}
        {address.city}, {address.state} - {address.pin}<br />
        {address.mobile}
      </div>

      {/* Action Row */}
      <div className="profile-mobile-addr-actions">
        <button className="profile-mobile-addr-btn" onClick={() => onEdit(address)}>
          <SquarePen  />
          Edit
        </button>
        <button className="profile-mobile-addr-btn" onClick={() => onDelete(address)}>
          <Trash2 />
          Remove
        </button>
      </div>

      {/* Set as Default Link (only for non-default addresses) */}
      {!isDefault && (
        <button className="profile-mobile-addr-set-default" onClick={() => onSetDefault(address)}>
          Set as default
        </button>
      )}
    </div>
  );
};

export default MobileAddressRow;