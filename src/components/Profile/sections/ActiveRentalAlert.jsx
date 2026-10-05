import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import useAuthStore from "../../../store/authStore";
import "../../../styles/Profile/sections/ActiveRentalAlert.css";

const ActiveRentalAlert = ({ onAlertClick }) => {
  const [activeRental, setActiveRental] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveRental = async () => {
      try {
        const token = useAuthStore.getState().token;
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/customer/auth/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) {
          // Find the first rental order that is not completely returned
          const rentals = data.data.filter(
            (order) => order.type === "Rental" || order.typeDetail === "Rental",
          );
          const active = rentals.find(
            (order) => !["Returned", "Complete"].includes(order.status),
          );
          setActiveRental(active);
        }
      } catch (err) {
        console.error("Error fetching active rental:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveRental();
  }, []);

  const handleClick = () => {
    if (onAlertClick && activeRental) {
      onAlertClick(activeRental.orderId || activeRental.id);
    }
  };

  if (loading || !activeRental) return null;

  const item =
    activeRental.items && activeRental.items[0] ? activeRental.items[0] : {};
  const itemName = item.productName || "Designer Piece";
  const designer = item.designer || "Designer";
  const returnDate = item.rentalEndDate
    ? new Date(item.rentalEndDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "TBD";
  const depositText = item.deposit
    ? `Deposit ₹${Number(item.deposit).toLocaleString()} ${activeRental.depositStatus === "Pending" ? "pending refund" : ""}`
    : "";

  const subtitle = [itemName, designer, `Return by ${returnDate}`, depositText]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="profile-active-rental-alert" onClick={handleClick}>
      <div className="profile-alert-pulse-dot"></div>

      <div className="profile-alert-text-block">
        <div className="profile-alert-title">
          Active Rental - {activeRental.status || "Dispatched"}
        </div>
        <div className="profile-alert-subtitle">{subtitle}</div>
      </div>

      <button className="profile-alert-cta">
        View Details
        <ArrowRight size={12} strokeWidth={1.5} />
      </button>
    </div>
  );
};

export default ActiveRentalAlert;
