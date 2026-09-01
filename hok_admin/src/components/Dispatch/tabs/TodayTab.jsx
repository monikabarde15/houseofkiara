import DispatchItemCard from '../jsx/DispatchItemCard';

const todayOrders = [
  {
    orderId: 'HOK-ORD-010',
    day: '23',
    month: 'MAR',
    itemName: 'Crimson Zardozi Bridal Lehenga',
    designer: 'Sabyasachi',
    customer: 'Kabir Malhotra',
    city: 'Mumbai',
    rentalDates: '25–28 Mar 2026',
    size: 'S',
    deposit: 25000,
    depositCollected: false,
    courier: 'DHL',
    trackingId: 'DHL223344556IN',
  },
];

export default function TodayTab({ demoDate }) {
  if (todayOrders.length === 0) {
    return <p className="empty-state">Nothing dispatching today.</p>;
  }

  return (
    <div className="tab-list">
      {todayOrders.map((order) => (
        <DispatchItemCard key={order.orderId} order={order} />
      ))}
      <p className="dispatch-footnote">☐ Prepaid return label packed with the outbound parcel (Blue Dart)</p>
    </div>
  );
}