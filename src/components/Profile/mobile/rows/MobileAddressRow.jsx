import React from 'react';
import { SquarePen, Trash2 } from 'lucide-react';
import "../../../../styles/Profile/mobile/rows/MobileAddressRow.css";

const MobileAddressRow = ({ address, isDefault, onEdit, onDelete, onSetDefault }) => {
  const locationLine = [address.city, address.state].filter(Boolean).join(", ");
  const pinText = address.pin ? ` - ${address.pin}` : "";
  const phone = address.mobile || address.phone || "";

  return (
    <div className="profile-mobile-addr-item">
      {/* Label / Type Row */}
      <div className="profile-mobile-addr-type-row">
        <span className="profile-mobile-addr-type">{address.label || "Home"}</span>
        {isDefault && <span className="profile-mobile-addr-default-badge">Default</span>}
      </div>

      {/* Recipient Name */}
      {address.recipientName && (
        <div className="profile-mobile-addr-recipient">{address.recipientName}</div>
      )}

      {/* Address Lines */}
      <div className="profile-mobile-addr-lines">
        {address.line1 ? (
          <>
            {address.line1}<br />
            {address.line2 && <>{address.line2}<br /></>}
            {locationLine}{pinText}<br />
            {phone}
          </>
        ) : (
          <>{address.address || "No address text"}</>
        )}
      </div>

      {/* Action Row */}
      <div className="profile-mobile-addr-actions">
        <button className="profile-mobile-addr-btn" onClick={() => onEdit(address)}>
          <SquarePen size={12} />
          Edit
        </button>
        <button className="profile-mobile-addr-btn" onClick={() => onDelete(address)}>
          <Trash2 size={12} />
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