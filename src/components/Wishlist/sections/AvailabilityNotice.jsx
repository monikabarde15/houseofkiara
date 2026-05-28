// src/components/Wishlist/sections/AvailabilityNotice.jsx
// Availability Notice (Rent Section Only)

import "../../../styles/wishlist/sections/availability-notice.css";

const AvailabilityNotice = () => {
  return (
    <div className="desk-wishlist-availability-notice">
      <span className="desk-wishlist-availability-notice-bold">
        2 pieces have limited availability: 
      </span>
       {" "}the Crimson Zardozi Bridal Lehenga (Sabyasachi) is in high demand, and the Rose Embroidered Anarkali Gown (Tarun Tahiliani) is currently booked for nearby dates. Slots are not held — we recommend reserving early.
    </div>
  );
};

export default AvailabilityNotice;