// src\components\Confirmation\modal\OrderStatusDetailRows.jsx
import "../../../styles/confirmation/modal/order-status-detail-rows.css";

const DETAIL_ROWS = {

  rental: [
    {
      key: "Current status",
      value: (
        <>
          <b>Awaiting security deposit</b>{" "}
          <span className="pending-note">
          — our ops team will contact you on
          WhatsApp within 24 hours.
          </span>{" "}
        </>
      ),
    },

    {
      key: "Tracking",
      value: (
        <>
          Not yet dispatched — tracking number
          will appear here and on WhatsApp once
          your deposit is received and dispatch
          is confirmed.
        </>
      ),
    },

    {
      key: "Arrives by",
      value: (
        <>
          <b>14 Nov (Friday)</b> — 2 days before
          your event
        </>
      ),
    },

    {
      key: "Return by",
      value: (
        <>
        <b>18 Nov (Tuesday) </b>
        <span className="urgent-note">
           — prepaid label in
          packaging
        </span>
        </>
      ),
    },
  ],

  preloved: [
    {
      key: "Current status",
      value: (
        <>
          <b>Preparing for dispatch</b>{" "}
          <span className="pending-note">
          — quality inspection underway. Ships
          within 2 business days.
          </span>{" "}
        </>
      ),
    },

    {
      key: "Tracking",
      value: (
        <>
          Tracking number will be sent to
          priya@example.com on dispatch.
        </>
      ),
    },

    {
      key: "Est. delivery",
      value: (
        <>
          <b>16–17 Oct</b> · Standard delivery
        </>
      ),
    },

    {
      key: "Returns",
      value: (
        <span className="urgent-note">
          Final sale — non-returnable
        </span>
      ),
    },
  ],

  new: [
    {
      key: "Current status",
      value: (
        <>
          <b>Order passed to Manyavar</b>{" "}
          <span className="pending-note">
          — dispatches within 3–5 business days.
          </span>{" "}
        </>
      ),
    },

    {
      key: "Tracking",
      value: (
        <>
          Tracking number provided by Manyavar
          on dispatch email.
        </>
      ),
    },

    {
      key: "Returns",
      value: (
        <>
          7-day return window from delivery.
          Contact HOK to initiate.
        </>
      ),
    },
  ],
};

const OrderStatusDetailRows = ({
  type,
}) => {

  const rows =
    DETAIL_ROWS[type] || [];

  return (
    <div className="hok-order-status-detail-rows">

      {rows.map((row, index) => (
        <div
          key={row.key}
          className={`
            hok-order-status-detail-row
            ${index === rows.length - 1
              ? "hok-order-status-detail-row-last"
              : ""}
          `}
        >

          <div className="hok-order-status-detail-key">
            {row.key}
          </div>

          <div className="hok-order-status-detail-value">
            {row.value}
          </div>

        </div>
      ))}

    </div>
  );
};

export default OrderStatusDetailRows;