import DispatchItemCard from '../jsx/DispatchItemCard';

// TODO(backend): replace with real orders passed as props / fetched from API,
// filtered to whatever falls within "this week" of the demo date.
const weekOrders = [
  {
    orderId: 'HOK-ORD-010',
    day: '23', month: 'MAR',
    itemName: 'Crimson Zardozi Bridal Lehenga', designer: 'Sabyasachi',
    customer: 'Kabir Malhotra', city: 'Mumbai', rentalDates: '25–28 Mar 2026', size: 'S',
    deposit: 25000, depositCollected: false,
    courier: 'DHL', trackingId: 'DHL223344556IN',
  },
  {
    orderId: 'HOK-ORD-013',
    day: '24', month: 'MAR',
    itemName: 'Rose Georgette Anarkali', designer: 'Anita Dongre',
    customer: 'Ananya Desai', city: 'Bangalore', rentalDates: '25 Mar 2026 (1 day)', size: 'M',
    deposit: 15000, depositCollected: false,
    courier: 'Delhivery', trackingId: 'DEL778899IN',
  },
  {
    orderId: 'HOK-ORD-011',
    day: '24', month: 'MAR',
    itemName: 'Champagne Tissue Sharara', designer: 'Ritu Kumar',
    customer: 'Ritu Chandra', city: 'Ahmedabad', rentalDates: '26–29 Mar 2026', size: 'M',
    deposit: 12000, depositCollected: false,
    courier: 'Delhivery', trackingId: 'awaiting AWB',
  },
  {
    orderId: 'HOK-ORD-005',
    day: '26', month: 'MAR',
    itemName: 'Gulabi Lehenga + Champagne Sharara', designer: 'Sabyasachi / Ritu Kumar',
    pieces: 2,
    customer: 'Divya Nair', city: 'Kochi', rentalDates: '28 Mar–1 Apr 2026', size: 'S/M',
    deposit: 37000, depositCollected: false,
    warnings: ['Courier not yet assigned', 'CUSTOM FIT — VERIFY BEFORE PACKING'],
  },
  {
    orderId: 'HOK-ORD-014',
    day: '28', month: 'MAR',
    itemName: 'Rose Georgette Anarkali', designer: 'Anita Dongre',
    customer: 'Vikram Chopra', city: 'Chennai', rentalDates: '30 Mar–2 Apr 2026', size: 'M',
    deposit: 15000, depositCollected: false,
    courier: 'Delhivery', trackingId: 'awaiting AWB',
    infoNotice: "Don't dispatch before Mar 28 — Ananya Desai (HOK-ORD-013) needs this piece first, clearing 28 Mar.",
  },
];

// The one conflict order, kept separate since it renders differently (red card, no Mark Dispatched)
const conflictOrder = {
  orderId: 'HOK-ORD-012',
  day: '27', month: 'MAR',
  itemName: 'Crimson Zardozi Bridal Lehenga',
  customer: 'Meera Kapoor', city: 'Delhi',
  deposit: 25000, depositCollected: false,
  conflictMessage:
    'Due to dispatch 27 Mar, but this piece is rented to Kabir Malhotra (HOK-ORD-010) until 28 Mar, then in its post-return cleaning window until 31 Mar. Earliest possible dispatch: 31 Mar.',
};

// TODO(backend): replace with real "returned & cleared" pieces from API.
const rotationItems = [
  { orderId: 'HOK-SAB-001', day: '21', month: 'MAR', subtitle: 'Crimson Zardozi Bridal Lehenga available for new bookings since 21 Mar' },
  { orderId: 'HOK-AD-001', day: '28', month: 'MAR', subtitle: 'Rose Georgette Anarkali available for new bookings since 28 Mar' },
  { orderId: 'HOK-SAB-003', day: '25', month: 'MAR', subtitle: 'Rajputana Silk Bridal Lehenga available for new bookings since 25 Mar' },
];

export default function ThisWeekTab({ demoDate }) {
  return (
    <div className="tab-list">
      {/* Orders 1–4, in normal card layout */}
      {weekOrders.slice(0, 4).map((order) => (
        <DispatchItemCard key={order.orderId} order={order} />
      ))}

      {/* Order 5: the conflict card, built inline (no separate file) */}
      <div
        className="dispatch-card"
        style={{ border: '1.5px solid #e0847c', background: '#fffaf9' }}
      >
        <div
          className="dispatch-card-date"
          style={{ background: '#fbe4e1' }}
        >
          <span className="day">{conflictOrder.day}</span>
          <span className="month">{conflictOrder.month}</span>
        </div>

        <div className="dispatch-card-info">
          <h3 style={{ color: '#9b3d34', fontWeight: 700 }}>
            ⚠ Cannot dispatch yet — {conflictOrder.itemName}
          </h3>
          <p>{conflictOrder.orderId} · {conflictOrder.customer} · {conflictOrder.city}</p>
          <p style={{ color: '#9b3d34', fontSize: '13px', lineHeight: 1.5, marginTop: '6px' }}>
            {conflictOrder.conflictMessage}
          </p>
        </div>

        <div className="dispatch-card-actions">
          <button className="btn-outline">View Order →</button>
          <button className="btn-outline">View Conflicting Order →</button>
        </div>
      </div>

      {/* Order 6, last normal card */}
      <DispatchItemCard order={weekOrders[4]} />

      <p className="dispatch-footnote">☐ Prepaid return label packed with the outbound parcel (Blue Dart)</p>

      {/* Back-in-rotation rows, built inline (no separate file) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
        {rotationItems.map((item) => (
          <div
            key={item.orderId}
            className="dispatch-card"
            style={{ padding: '14px 20px', alignItems: 'center' }}
          >
            <div
              className="dispatch-card-date"
              style={{ width: '44px', height: '44px', marginRight: '18px' }}
            >
              <span className="day" style={{ fontSize: '15px' }}>{item.day}</span>
              <span className="month" style={{ fontSize: '9px' }}>{item.month}</span>
            </div>
            <div className="dispatch-card-info">
              <h3 style={{ fontSize: '13.5px' }}>{item.orderId} — Back in rotation</h3>
              <p>{item.subtitle}</p>
            </div>
            <div className="dispatch-card-actions" style={{ minWidth: 'auto' }}>
              <button className="btn-outline">View Calendar →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}