import DispatchItemCard from "../jsx/DispatchItemCard";

export default function ThisWeekTab({
  orders = [],
  conflictOrders = [],
  rotationItems = [],
  onViewOrder,
  onMarkDispatched,
  onViewCalendar,
}) {
  return (
    <div className="tab-list">
      {orders.length === 0 && conflictOrders.length === 0 && (
        <p className="empty-state">Nothing dispatching this week.</p>
      )}

      {orders.map((order) => (
        <DispatchItemCard
          key={order.orderId}
          order={order}
          onViewOrder={onViewOrder}
          onMarkDispatched={onMarkDispatched}
        />
      ))}

      {conflictOrders.map((conflictOrder) => (
        <div
          key={`conflict_${conflictOrder.orderId}`}
          className="dispatch-card"
          style={{ border: "1.5px solid #e0847c", background: "#fffaf9" }}
        >
          <div className="dispatch-card-date" style={{ background: "#fbe4e1" }}>
            <span className="day">{conflictOrder.day}</span>
            <span className="month">{conflictOrder.month}</span>
          </div>

          <div className="dispatch-card-info">
            <h3 style={{ color: "#9b3d34", fontWeight: 700 }}>
              ⚠ Cannot dispatch yet — {conflictOrder.itemName}
            </h3>
            <p>
              {conflictOrder.orderId} · {conflictOrder.customer} ·{" "}
              {conflictOrder.city}
            </p>
            <p
              style={{
                color: "#9b3d34",
                fontSize: "13px",
                lineHeight: 1.5,
                marginTop: "6px",
              }}
            >
              {conflictOrder.conflictMessage}
            </p>
          </div>

          <div className="dispatch-card-actions">
            <button
              type="button"
              className="btn-outline"
              onClick={() =>
                onViewOrder?.(conflictOrder.rawOrderId || conflictOrder.orderId)
              }
            >
              View Order →
            </button>
            {conflictOrder.conflictingOrderId && (
              <button
                type="button"
                className="btn-outline"
                onClick={() => onViewOrder?.(conflictOrder.conflictingOrderId)}
              >
                View Conflicting Order →
              </button>
            )}
          </div>
        </div>
      ))}

      {(orders.length > 0 || conflictOrders.length > 0) && (
        <p className="dispatch-footnote">
          ☐ Prepaid return label packed with the outbound parcel (Blue Dart)
        </p>
      )}

      {rotationItems.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          {rotationItems.map((item) => (
            <div
              key={item.orderId}
              className="dispatch-card"
              style={{ padding: "14px 20px", alignItems: "center" }}
            >
              <div
                className="dispatch-card-date"
                style={{ width: "44px", height: "44px", marginRight: "18px" }}
              >
                <span className="day" style={{ fontSize: "15px" }}>
                  {item.day}
                </span>
                <span className="month" style={{ fontSize: "9px" }}>
                  {item.month}
                </span>
              </div>
              <div className="dispatch-card-info">
                <h3 style={{ fontSize: "13.5px" }}>
                  {item.orderId} — Back in rotation
                </h3>
                <p>{item.subtitle}</p>
              </div>
              <div className="dispatch-card-actions" style={{ minWidth: "auto" }}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => onViewCalendar?.()}
                >
                  View Calendar →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
