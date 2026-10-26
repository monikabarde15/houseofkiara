import { useState, useEffect } from 'react';
import MobileBottomSheet from "./MobileBottomSheet";
import MobileCancelBookingModal from '../modals/MobileCancelBookingModal';
import "../../../../styles/Profile/mobile/sheets/MobileRentalDetailSheet.css";
import Toast from '../../ui/Toast';
const MobileRentalDetailSheet = ({
  isOpen,
  onClose,
  booking,
  onUpdate
}) => {

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const handleCancelBooking = () => {
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    setIsCancelModalOpen(false);
    setIsCancelling(true);
    try {
      const authState = (await import('../../../../store/authStore')).default.getState();
      const token = authState.token || localStorage.getItem('token') || localStorage.getItem('customerToken');
      const res = await fetch(`/api/customer/auth/orders/${booking.id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const result = await res.json();
      if (result.success) {
        setToastMessage("Booking cancelled successfully — dates have been released");
        setShowToast(true);
        booking.status = "Cancelled";
        if (onUpdate) onUpdate();
      } else {
        setToastMessage(result.message || "Failed to cancel booking");
        setShowToast(true);
      }
    } catch (err) {
      console.error("Cancel booking error:", err);
      setToastMessage("Error cancelling booking. Please try again.");
      setShowToast(true);
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    if (!showToast) {
      return;
    }

    const timeout = setTimeout(() => {
      setShowToast(false);
    }, 3200);

    return () =>
      clearTimeout(timeout);
  }, [showToast]);
  /* =========================================
     Guard
     ========================================= */

  if (!booking) {
    return null;
  }

  /* =========================================
     Badge Variant
     ========================================= */

  const getBadgeClass = (status) => {
    switch (status) {
      case "Dispatched":
        return "profile-mobile-b-dis";

      case "Confirmed":
        return "profile-mobile-b-con";

      case "Completed":
        return "profile-mobile-b-com";

      case "Returned":
        return "profile-mobile-b-ret";

      case "Cancelled":
        return "profile-mobile-b-can";

      default:
        return "";
    }
  };

  /* =========================================
     Detail Rows
     ========================================= */

  const detailRows = {
    Dispatched: [
      {
        label: "Booking ID",
        value: booking.id
      },
      {
        label: "Rental Dates",
        value: booking.dates
      },
      {
        label: "Size",
        value: booking.size || "M"
      },
      {
        label: "Rental Fee",
        value: `₹${booking.fee.toLocaleString()}`
      },
      {
        label: "Security Deposit",
        value: `₹${booking.depositAmount || 15000
          } — Pending refund`,
        valueClass:
          "profile-mobile-dv-gold"
      },
      {
        label: "Delivery Address",
        value:
          "204 Suncity Towers, Vijay Nagar, Indore"
      },
      {
        label: "Return By",
        value: "28 May 2025"
      }
    ],

    Confirmed: [
      {
        label: "Booking ID",
        value: booking.id
      },
      {
        label: "Rental Dates",
        value: booking.dates
      },
      {
        label: "Size",
        value:
          booking.size || "S/M"
      },
      {
        label: "Rental Fee",
        value: `₹${booking.fee.toLocaleString()}`
      },
      {
        label: "Deposit Due",
        value: `₹${booking.depositAmount || 8000
          } — Due at pickup`,
        valueClass:
          "profile-mobile-dv-gold"
      },
      {
        label: "Expected Dispatch",
        value:
          "Within 3-5 business days"
      }
    ],

    Completed: [
      {
        label: "Booking ID",
        value: booking.id
      },
      {
        label: "Rental Dates",
        value: booking.dates
      },
      {
        label: "Rental Fee",
        value: `₹${booking.fee.toLocaleString()}`
      },
      {
        label: "Security Deposit",
        value: `₹${booking.depositAmount || 10000
          } — Refunded 20 Feb 2025`,
        valueClass:
          "profile-mobile-dv-sage"
      },
      {
        label: "Return Condition",
        value:
          "Excellent — no damage noted"
      }
    ],

    Returned: [
      {
        label: "Booking ID",
        value: booking.id
      },
      {
        label: "Rental Dates",
        value: booking.dates
      },
      {
        label: "Rental Fee",
        value: `₹${booking.fee.toLocaleString()}`
      },
      {
        label: "Security Deposit",
        value: `₹${booking.depositAmount || 6000
          } — Refunded`,
        valueClass:
          "profile-mobile-dv-sage"
      },
      {
        label: "Return Condition",
        value:
          "Good — minor hem wear noted"
      }
    ],

    Cancelled: [
      {
        label: "Booking ID",
        value: booking.id
      },
      {
        label: "Requested Dates",
        value: booking.dates
      },
      {
        label: "Rental Fee",
        value: `₹${booking.fee.toLocaleString()} (cancelled)`,
        valueClass:
          "profile-mobile-dv-cancelled"
      },
      {
        label: "Cancellation Date",
        value: booking.cancellationDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      },
      {
        label: "Cancelled By",
        value: "Customer"
      },
      {
        label: "Reason",
        value:
          "Cancelled by customer from profile"
      },
      {
        label: "Refund Status",
        value:
          "Full refund — within 5-7 business days",
        valueClass:
          "profile-mobile-dv-sage"
      }
    ]
  };

  /* =========================================
     Notes
     ========================================= */

  const notes = {
    Dispatched: {
      variant:
        "profile-mobile-note-default",
      title:
        "Return Instructions",
      text:
        "Pack in the original dust bag and WhatsApp us to schedule a pickup. Deposit refunded within 3–5 business days after inspection."
    },

    Confirmed: {
      variant:
        "profile-mobile-note-gold",
      title:
        "What Happens Next",
      text:
        "Your piece is confirmed. It will be dispatched 2 days before your start date. You’ll receive a WhatsApp notification when it ships."
    },

    Cancelled: {
      variant:
        "profile-mobile-note-muted",
      title:
        "Cancellation Policy",
      text:
        `Cancelled more than 7 days before the rental start date. Full refund of ₹${booking.fee.toLocaleString()} was processed to the original payment method within 5–7 business days.`
    }
  };

  /* =========================================
     Action Buttons
     ========================================= */

  const actions = {
    Dispatched: {
      primary:
        "WhatsApp Support",
      secondary:
        "Email Instructions"
    },

    Confirmed: {
      primary: "Contact Us",
      secondary:
        "Cancel Booking"
    },

    Completed: {
      secondary: "Rent Again"
    },

    Returned: {
      secondary: "Rent Again"
    },

    Cancelled: {
      secondary:
        "Browse Similar Pieces"
    }
  };

  const currentRows =
    detailRows[booking.status] || detailRows.Confirmed || detailRows.Dispatched || [];

  const currentNote =
    notes[booking.status] || notes.Confirmed;

  const currentActions =
    actions[booking.status] || actions.Confirmed;

  return (
    <>
      <MobileBottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={booking.piece}
      >
        {/* =====================================
          Product Header Block
          Section 8.2
         ===================================== */}

        <div className="profile-mobile-sheet-product">
          <div
            className="profile-mobile-sheet-product-img"
            style={{
              overflow: "hidden",
              borderRadius: "2px"
            }}
          >
            {booking.image ? (
              <img src={booking.image} alt={booking.piece || "Rental piece"} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            )}
          </div>

          <div className="profile-mobile-sheet-product-info">
            <div
              className={`profile-mobile-badge ${getBadgeClass(
                booking.status
              )}`}
            >
              <span className="profile-mobile-bdot" />

              {booking.status}
            </div>

            <div className="profile-mobile-sheet-product-name">
              {booking.piece}
            </div>

            <div className="profile-mobile-sheet-product-meta">
              {booking.designer}
            </div>
          </div>
        </div>

        {/* =====================================
          Detail Body
          Section 8.3
         ===================================== */}

        <div className="profile-mobile-sheet-detail-body">
          {currentRows.map((row) => (
            <div
              key={row.label}
              className="profile-mobile-drow"
            >
              <div className="profile-mobile-dl">
                {row.label}
              </div>

              <div
                className={`profile-mobile-dv ${row.valueClass || ""
                  }`}
              >
                {row.value}
              </div>
            </div>
          ))}

          {/* =================================
            Note Block
            Section 8.4
           ================================= */}

          {currentNote && (
            <div
              className={`profile-mobile-note ${currentNote.variant}`}
            >
              <div className="profile-mobile-note-title">
                {currentNote.title}
              </div>

              <div className="profile-mobile-note-text">
                {currentNote.text}
              </div>
            </div>
          )}

          {/* =================================
            Sheet Action Buttons
            Section 8.5
           ================================= */}

          {currentActions?.primary && (
            <button
              type="button"
              className="profile-mobile-sbtn-p active"
            >
              {currentActions.primary}
            </button>
          )}

          {currentActions?.secondary && (
            <button
              type="button"
              className="profile-mobile-sbtn-s"
              onClick={() => {
                if (
                  currentActions.secondary ===
                  "Cancel Booking"
                ) {
                  handleCancelBooking();

                  return;
                }

                console.log(
                  currentActions.secondary
                );
              }}
            >
              {currentActions.secondary}
            </button>
          )}
        </div>
      </MobileBottomSheet>
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      <MobileCancelBookingModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />
    </>
  );
};

export default MobileRentalDetailSheet;