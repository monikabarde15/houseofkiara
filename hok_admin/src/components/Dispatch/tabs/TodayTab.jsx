import DispatchItemCard from "../jsx/DispatchItemCard";

export default function TodayTab({
  orders = [],
  onViewOrder,
  onMarkDispatched,
}) {
  if (orders.length === 0) {
    return <p className="empty-state">Nothing dispatching today.</p>;
  }

  return (
    <div className="tab-list">
      {orders.map((order) => (
        <DispatchItemCard
          key={order.orderId}
          order={order}
          onViewOrder={onViewOrder}
          onMarkDispatched={onMarkDispatched}
        />
      ))}
      <p className="dispatch-footnote">
        ☐ Prepaid return label packed with the outbound parcel (Blue Dart)
      </p>
    </div>
  );
}
