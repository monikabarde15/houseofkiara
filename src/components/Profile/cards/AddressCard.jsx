import React from 'react';
import { SquarePen, Trash2, Home, Building2 } from 'lucide-react';
import "../../../styles/Profile/cards/AddressCard.css";

const AddressCard = ({ address, isDefault, onEdit, onDelete, onSetDefault }) => {
  const getAddressIcon = () => {
    if (address.label === "Home") {
      return <Home size={13} strokeWidth={1.5} />;
    }
    return <Building2 size={13} strokeWidth={1.5} />;
  };

  const recipient = address.recipientName || "";
  const phone = address.mobile || address.phone || "";
  const locationLine = [address.city, address.state].filter(Boolean).join(", ");
  const pinText = address.pin ? ` – ${address.pin}` : "";

  return (
    <div className={`profile-ac ${isDefault ? 'profile-ac-def' : ''}`}>
      {/* Top Row */}
      <div className="profile-ac-top">
        <div className="profile-ac-icon">
          {getAddressIcon()}
        </div>
        <div className="profile-ac-acts">
          <button className="profile-acbtn" onClick={() => onEdit(address)} aria-label="Edit address">
            <SquarePen size={10} strokeWidth={1.5} />
          </button>
          <button className="profile-acbtn" onClick={() => onDelete(address)} aria-label="Delete address">
            <Trash2 size={10} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="profile-ac-type-row">
        <span className="profile-ac-type">{address.label || "Home"}</span>
        {isDefault && <span className="profile-ac-dbadge">Default</span>}
      </div>

      {recipient && (
        <div style={{ fontWeight: 600, color: "var(--charcoal, #1A1612)", marginBottom: "4px", fontSize: "12px" }}>
          {recipient}
        </div>
      )}

      <div className="profile-ac-text">
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

      {/* Set as Default Link */}
      {!isDefault && (
        <button className="profile-ac-setdef" onClick={() => onSetDefault(address)}>
          Set as default
        </button>
      )}
    </div>
  );
};

export default AddressCard;