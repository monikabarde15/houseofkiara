import React, { useState } from "react";
import MobileSectionLabel from "../ui/MobileSectionLabel";
import MobileRentalRow from "../rows/MobileRentalRow";
import "../../../../styles/Profile/mobile/sections/MobileRentalsSection.css";
import MobileRentalDetailSheet from "../sheets/MobileRentalDetailSheet";

const MobileRentalsSection = ({ onViewAll }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rentalBookings, setRentalBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRentals = async () => {
    try {
      const authStore = await import("../../../../store/authStore").then((m) =>
        m.default.getState(),
      );
      const token = authStore.token;
      if (!token) return;

      const res = await fetch(`/api/customer/auth/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const rentals = data.data.filter(
          (order) => order.type === "Rental" || order.typeDetail === "Rental",
        );
        setRentalBookings(rentals);
      }
    } catch (err) {
      console.error("Error fetching rentals:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRentals();
  }, []);

  const handleRowClick = (id) => {
    const booking = rentalBookings.find((b) => b.id === id);
    setSelectedBooking(booking);
    setIsSheetOpen(true);
  };

  return (
    <>
      <div className="profile-mobile-rentals-section">
        <div className="profile-mobile-section-container">
          <MobileSectionLabel
            title="MY RENTALS"
            count={5}
            countLabel="BOOKINGS"
            linkText="View all"
            onLinkClick={onViewAll}
          />
          <div className="profile-mobile-item-block">
            {loading ? (
              <div style={{ padding: "20px", color: "#666", fontSize: "12px" }}>
                Loading...
              </div>
            ) : rentalBookings.length === 0 ? (
              <div style={{ padding: "20px", color: "#666", fontSize: "12px" }}>
                No rental bookings found.
              </div>
            ) : (
              rentalBookings
                .slice(0, 3)
                .map((booking) => (
                  <MobileRentalRow
                    key={booking.id || booking.orderId}
                    booking={booking}
                    onClick={() =>
                      handleRowClick(booking.id || booking.orderId)
                    }
                  />
                ))
            )}
          </div>
        </div>
      </div>

      <MobileRentalDetailSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        booking={selectedBooking}
        onRefresh={() => {
          fetchRentals();
          setIsSheetOpen(false); // Optionally close the sheet
        }}
      />
    </>
  );
};

export default MobileRentalsSection;
