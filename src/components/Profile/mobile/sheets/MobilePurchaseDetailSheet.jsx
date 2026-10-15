import MobileBottomSheet from "./MobileBottomSheet";

import "../../../../styles/Profile/mobile/sheets/MobilePurchaseDetailSheet.css";

const MobilePurchaseDetailSheet = ({
  isOpen,
  onClose,
  order
}) => {
  /* =========================================
     Guard
     ========================================= */

  if (!order) {
    return null;
  }

  /* =========================================
     Badge Variant
     ========================================= */

  const getBadgeClass = (status) => {
    switch (status) {
      case "Delivered":
        return "profile-mobile-b-del";

      case "Processing":
        return "profile-mobile-b-pro";

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
    Delivered: [
      {
        label: "Order ID",
        value: order.id
      },

      {
        label: "Order Type",
        value:
          order.type ||
          "Buy New"
      },

      {
        label: "Condition",
        value:
          order.condition ||
          "Excellent — worn once, no damage"
      },

      {
        label: "Size",
        value:
          order.size || "M"
      },

      {
        label: "Colour",
        value:
          order.color || "Ivory"
      },

      {
        label: "Amount Paid",
        value: `₹${order.total.toLocaleString()}`
      },

      {
        label: "Delivered On",
        value:
          order.placedOn
      },

      {
        label:
          "Payment Method",

        value:
          order.paymentMethod ||
          "Credit Card"
      },

      {
        label:
          "Delivery Address",

        value:
          order.address ||
          "204 Suncity Towers, Vijay Nagar, Indore"
      }
    ],

    Processing: [
      {
        label: "Order ID",
        value: order.id
      },

      {
        label: "Order Type",
        value:
          order.type ||
          "Buy New"
      },

      {
        label: "Size",
        value:
          order.size || "S/M"
      },

      {
        label: "Colour",
        value:
          order.color || "Sage"
      },

      {
        label: "Amount Paid",
        value: `₹${order.total.toLocaleString()}`
      },

      {
        label: "Ordered On",
        value:
          order.placedOn
      },

      {
        label: "Status",
        value:
          "Processing — not yet dispatched",

        valueClass:
          "profile-mobile-dv-terracotta"
      },

      {
        label:
          "Expected Dispatch",

        value:
          "Within 3–5 business days"
      },

      {
        label:
          "Delivery Address",

        value:
          order.address ||
          "204 Suncity Towers, Vijay Nagar, Indore"
      }
    ],

    Cancelled: [
      {
        label: "Order ID",
        value: order.id
      },

      {
        label: "Order Type",
        value:
          order.type ||
          "Buy New"
      },

      {
        label: "Amount Paid",
        value: `₹${order.total.toLocaleString()}`,

        valueClass:
          "profile-mobile-dv-muted"
      },

      {
        label:
          "Cancelled On",

        value:
          order.placedOn
      },

      {
        label:
          "Refund Status",

        value:
          "Refund processed",

        valueClass:
          "profile-mobile-dv-sage"
      },

      {
        label:
          "Payment Method",

        value:
          order.paymentMethod ||
          "UPI"
      }
    ]
  };

  /* =========================================
     Notes
     ========================================= */

  const notes = {
    Processing: {
      variant:
        "profile-mobile-note-gold",

      title:
        "Tracking Note",

      text:
        "Tracking details will be available once your order is dispatched. You’ll receive a WhatsApp notification with courier information."
    },

    Cancelled: {
      variant:
        "profile-mobile-note-muted",

      title:
        "Cancellation Policy",

      text:
        "Your refund has been initiated to the original payment method. Processing usually takes 5–7 business days."
    }
  };

  /* =========================================
     Actions
     ========================================= */

  const actions = {
    Delivered: {
      primary:
        "Buy Again",

      secondary:
        "Download Invoice"
    },

    Processing: {
      primary:
        "Track Order",

      secondary:
        "Contact Support"
    },

    Cancelled: {
      secondary:
        "Browse Similar Pieces"
    }
  };

  const currentRows =
    detailRows[order.status] || [];

  const currentNote =
    notes[order.status];

  const currentActions =
    actions[order.status];

  return (
    <MobileBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={order.piece}
    >
      {/* =====================================
          Product Header
         ===================================== */}

      <div className="profile-mobile-sheet-product">
        <div
          className="profile-mobile-sheet-product-img"
          style={{
            "--sheet-bg":
              order.imageGradient
          }}
        >
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
        </div>

        <div className="profile-mobile-sheet-product-info">
          <div
            className={`profile-mobile-badge ${getBadgeClass(
              order.status
            )}`}
          >
            <span className="profile-mobile-bdot" />

            {order.status}
          </div>

          <div className="profile-mobile-sheet-product-name">
            {order.piece}
          </div>

          <div className="profile-mobile-sheet-product-meta">
            {order.typeDetail ||
              order.designer}
          </div>
        </div>
      </div>

      {/* =====================================
          Detail Body
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
              className={`profile-mobile-dv ${
                row.valueClass || ""
              }`}
            >
              {row.value}
            </div>
          </div>
        ))}

        {/* =================================
            Note Block
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
            Primary Action
           ================================= */}

        {currentActions?.primary && (
          <button
            type="button"
            className="profile-mobile-sbtn-p active"
          >
            {currentActions.primary}
          </button>
        )}

        {/* =================================
            Secondary Action
           ================================= */}

        {currentActions?.secondary && (
          <button
            type="button"
            className="profile-mobile-sbtn-s"
          >
            {currentActions.secondary}
          </button>
        )}
      </div>
    </MobileBottomSheet>
  );
};

export default MobilePurchaseDetailSheet;