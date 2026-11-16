import DispatchItemCard from "../jsx/DispatchItemCard";

export default function TomorrowTab({
  orders = [],
  onViewOrder,
  onMarkDispatched,
}) {
  if (orders.length === 0) {
    return <p className="empty-state">Nothing dispatching tomorrow.</p>;
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
    </div>
  );
}
