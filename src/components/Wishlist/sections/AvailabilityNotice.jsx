// src/components/Wishlist/sections/AvailabilityNotice.jsx
// Availability Notice (Rent Section Only)

import "../../../styles/wishlist/sections/availability-notice.css";

const AvailabilityNotice = ({ products = [] }) => {
  const limited = (products || []).filter(
    (p) => p.unavailable || p.stripTag === "In Demand"
  );

  if (!limited.length) return null;

  const names = limited.map((p) => `${p.name} (${p.designer})`).join(", ");

  return (
    <div className="desk-wishlist-availability-notice">
      <span className="desk-wishlist-availability-notice-bold">
        {limited.length} {limited.length === 1 ? "piece has" : "pieces have"} limited availability: 
      </span>
      {" "}{names} {limited.length === 1 ? "is" : "are"} in high demand or booked for nearby dates. Slots are not held — we recommend reserving early.
    </div>
  );
};

export default AvailabilityNotice;