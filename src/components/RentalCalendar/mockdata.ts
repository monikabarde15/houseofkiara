import { CalendarEvent, DispatchCard } from './types';

// Replace with real data from your API. Shaped to match the current design reference (March 2026).
export const mockEvents: CalendarEvent[] = [
  { id: 'e1', type: 'prep-dispatch', title: 'Prep dispatch — Crimson Zardozi Bridal …', date: '2026-03-11' },

  { id: 'e2', type: 'dispatched', title: 'Dispatched — Champagne Tissue Sharara', date: '2026-03-17' },

  { id: 'e3', type: 'dispatched', title: 'Dispatched — Rajputana Silk Bridal Lehe…', date: '2026-03-18' },
  { id: 'e4', type: 'prep-dispatch', title: 'Prep dispatch — Rose Georgette Anarkali', date: '2026-03-18' },
  { id: 'e5', type: 'return-due', title: 'Return due — Crimson Zardozi Bridal Leh…', date: '2026-03-18' },

  { id: 'e6', type: 'internal-task', title: 'Call tailor re: beading repair', date: '2026-03-19' },
  { id: 'e7', type: 'cleaning', title: 'Cleaning — Crimson Zardozi …', date: '2026-03-19' },
  { id: 'e8', type: 'rental-starts', title: 'Rental starts — Nisha Agarw…', date: '2026-03-19' },

  { id: 'e9', type: 'dispatched', title: 'Dispatched — Crimson Zardozi Bridal Le…', date: '2026-03-23' },
  { id: 'e10', type: 'cleaning', title: 'Cleaning — Rajputana Silk Bridal Lehenga', date: '2026-03-23' },

  { id: 'e11', type: 'dispatched', title: 'Dispatched — Rose Georgette Anarkali', date: '2026-03-24' },
  { id: 'e12', type: 'dispatched', title: 'Dispatched — Champagne Tissue Sharara', date: '2026-03-24' },
  { id: 'e13', type: 'prep-dispatch', title: 'Prep dispatch — Gulabi Lehenga + Sharara', date: '2026-03-24' },
  { id: 'e14', type: 'return-due', title: 'Return due — extra 1', date: '2026-03-24' },
  { id: 'e15', type: 'deposit-due', title: 'Return due — extra 2', date: '2026-03-24' },
  { id: 'e16', type: 'payout-due', title: 'Return due — extra 3', date: '2026-03-24' },
  { id: 'e17', type: 'offer-response-due', title: 'Return due — extra 4', date: '2026-03-24' },

  { id: 'e18', type: 'prep-dispatch', title: 'Prep dispatch — Crimson Zardozi Bridal …', date: '2026-03-25' },
  { id: 'e19', type: 'return-due', title: 'Return due — Rose Georgette Anarkali', date: '2026-03-25' },
  { id: 'e20', type: 'return-due', title: 'Return due — Rose Georgette Anarkali', date: '2026-03-25' },
  { id: 'e21', type: 'cleaning', title: 'extra 1', date: '2026-03-25' },
  { id: 'e22', type: 'back-in-rotation', title: 'extra 2', date: '2026-03-25' },

  { id: 'e23', type: 'dispatched', title: 'Dispatched — Gulabi Lehenga …', date: '2026-03-26' },
  { id: 'e24', type: 'prep-dispatch', title: 'Prep dispatch — Rose George…', date: '2026-03-26' },
  { id: 'e25', type: 'internal-task', title: 'Restock garment bags & tissu…', date: '2026-03-26' },

  { id: 'e26', type: 'offer-response-due', title: 'Offer response due — Gulabi Silk Bridal L…', date: '2026-03-30' },
  { id: 'e27', type: 'delivery-followup', title: 'Crimson Zardozi Bridal Lehenga back in r…', date: '2026-03-31' },
];

export const mockDispatches: DispatchCard[] = [
  {
    id: 'd1',
    dateLabel: '13 MAR',
    title: 'Crimson Zardozi Bridal Lehenga',
    subtitle: 'Priya Rathore · Dispatch via DHL',
    orderId: 'HOK-ORD-881',
  },
  {
    id: 'd2',
    dateLabel: '20 MAR',
    title: 'Rose Georgette Anarkali',
    subtitle: 'Neha Kulkarni · Dispatch via Delhivery',
    orderId: 'HOK-ORD-893',
  },
  {
    id: 'd3',
    dateLabel: '26 MAR',
    title: 'Gulabi Lehenga + Sharara',
    subtitle: 'Divya Nair · 2-piece dispatch',
    orderId: 'HOK-ORD-905',
  },
  {
    id: 'd4',
    dateLabel: 'TODAY — 23 MAR',
    isToday: true,
    title: 'Crimson Zardozi Bridal Lehenga',
    subtitle: 'Kabir Malhotra · Dispatch via DHL — courier and tracking already confirmed.',
    orderId: 'HOK-ORD-916',
  },
  {
    id: 'd5',
    dateLabel: '27 MAR',
    title: 'Crimson Zardozi Bridal Lehenga',
    subtitle: 'Meera Kapoor · Scheduled dispatch — booking overlaps HOK-ORD-010\'s rental + cleaning window.',
    orderId: 'HOK-ORD-912',
  },
  {
    id: 'd6',
    dateLabel: '24 MAR',
    title: 'Rose Georgette Anarkali',
    subtitle: 'Ananya Desai · Dispatch via Delhivery — 1-day rental for a mehendi function.',
    orderId: 'HOK-ORD-913',
  },
];