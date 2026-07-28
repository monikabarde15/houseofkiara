import DispatchItemCard from '../jsx/DispatchItemCard';

// Hardcoded for now — later this will come from props (e.g. `orders` passed down from App.tsx)
// and filtered by rentalStartDate === tomorrow's date.
const tomorrowOrders = [
  {
    orderId: 'HOK-ORD-013',
    day: '24',
    month: 'MAR',
    itemName: 'Rose Georgette Anarkali',
    designer: 'Anita Dongre',
    customer: 'Ananya Desai',
    city: 'Bangalore',
    rentalDates: '25 Mar 2026 (1 day)',
    size: 'M',
    deposit: 15000,
    depositCollected: false,
    courier: 'Delhivery',
    trackingId: 'DEL778899IN',
  },
  {
    orderId: 'HOK-ORD-011',
    day: '24',
    month: 'MAR',
    itemName: 'Champagne Tissue Sharara',
    designer: 'Ritu Kumar',
    customer: 'Ritu Chandra',
    city: 'Ahmedabad',
    rentalDates: '26–29 Mar 2026',
    size: 'M',
    deposit: 12000,
    depositCollected: false,
    courier: 'Delhivery',
    trackingId: 'awaiting AWB',
  },
];

export default function TomorrowTab({ demoDate }) {
  if (tomorrowOrders.length === 0) {
    return <p className="empty-state">Nothing dispatching tomorrow.</p>;
  }

  return (
    <div className="tab-list">
      {tomorrowOrders.map((order) => (
        <DispatchItemCard key={order.orderId} order={order} />
      ))}
    </div>
  );
}