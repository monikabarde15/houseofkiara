import { AgendaEntry } from '../../types';

export const agendaMockData: AgendaEntry[] = [
  {
    id: 'agenda-001', date: 'Wed, 11 Mar', isoDate: '2026-03-11',
    type: 'prep-dispatch', orderId: 'HOK-ORD-001', customer: 'Priya Rathore',
    product: 'Crimson Zardozi Bridal Lehenga',
    note: 'T-2 reminder — prepare packaging and DHL waybill.',
    done: false,
    detail: {
      title: 'Prep Dispatch — Crimson Zardozi Bridal Lehenga',
      subtitle: 'T-2 reminder — prepare packaging and DHL waybill.',
      dueDate: 'Wed, 11 Mar, 2026',
      relatedOrderId: 'HOK-ORD-001', relatedCustomer: 'Priya Rathore',
    },
  },
  {
    id: 'agenda-002', date: 'Fri, 13 Mar', isoDate: '2026-03-13',
    type: 'dispatched', orderId: 'HOK-ORD-001', customer: 'Priya Rathore',
    product: 'Crimson Zardozi Bridal Lehenga', note: 'Dispatch via DHL',
    detail: {
      title: 'Dispatched — Crimson Zardozi Bridal Lehenga',
      subtitle: 'Dispatch via DHL',
      dueDate: 'Fri, 13 Mar, 2026',
      relatedOrderId: 'HOK-ORD-001', relatedCustomer: 'Priya Rathore',
    },
  },
  {
    id: 'agenda-003', date: 'Sun, 15 Mar', isoDate: '2026-03-15',
    type: 'rental-starts', orderId: 'HOK-ORD-001', customer: 'Priya Rathore',
    product: 'Crimson Zardozi Bridal Lehenga',
    note: 'Rental window 15–18 Mar 2026 (4 days)',
    detail: {
      title: 'Rental Starts — Crimson Zardozi Bridal Lehenga',
      subtitle: 'Rental window 15–18 Mar 2026 (4 days)',
      dueDate: 'Sun, 15 Mar, 2026',
      relatedOrderId: 'HOK-ORD-001', relatedCustomer: 'Priya Rathore',
    },
  },
  {
    id: 'agenda-004', date: 'Tue, 17 Mar', isoDate: '2026-03-17',
    type: 'dispatched', orderId: 'HOK-ORD-015', customer: 'Nisha Agarwal',
    product: 'Champagne Tissue Sharara', note: 'Dispatch via Delhivery',
    detail: {
      title: 'Dispatched — Champagne Tissue Sharara',
      subtitle: 'Dispatch via Delhivery',
      dueDate: 'Tue, 17 Mar, 2026',
      relatedOrderId: 'HOK-ORD-015', relatedCustomer: 'Nisha Agarwal',
    },
  },
  {
    id: 'agenda-005', date: 'Wed, 18 Mar', isoDate: '2026-03-18',
    type: 'return-due', orderId: 'HOK-ORD-001', customer: 'Priya Rathore',
    product: 'Crimson Zardozi Bridal Lehenga', note: 'Return due — deposit held',
    detail: {
      title: 'Return Due — Crimson Zardozi Bridal Lehenga',
      subtitle: 'Return due — deposit held',
      dueDate: 'Wed, 18 Mar, 2026',
      relatedOrderId: 'HOK-ORD-001', relatedCustomer: 'Priya Rathore',
    },
  },
  {
    id: 'agenda-006', date: 'Wed, 18 Mar', isoDate: '2026-03-18',
    type: 'prep-dispatch', orderId: 'HOK-ORD-003', customer: 'Neha Kulkarni',
    product: 'Rose Georgette Anarkali',
    note: 'T-2 reminder — prepare packaging and Delhivery waybill.',
    detail: {
      title: 'Prep Dispatch — Rose Georgette Anarkali',
      subtitle: 'T-2 reminder — prepare packaging and Delhivery waybill.',
      dueDate: 'Wed, 18 Mar, 2026',
      relatedOrderId: 'HOK-ORD-003', relatedCustomer: 'Neha Kulkarni',
    },
  },
  {
    id: 'agenda-007', date: 'Wed, 18 Mar', isoDate: '2026-03-18',
    type: 'dispatched', orderId: 'HOK-ORD-016', customer: 'Tara Bhatt',
    product: 'Rajputana Silk Bridal Lehenga', note: 'Dispatch via DHL',
    detail: {
      title: 'Dispatched — Rajputana Silk Bridal Lehenga',
      subtitle: 'Dispatch via DHL',
      dueDate: 'Wed, 18 Mar, 2026',
      relatedOrderId: 'HOK-ORD-016', relatedCustomer: 'Tara Bhatt',
    },
  },
  {
    id: 'agenda-008', date: 'Thu, 19 Mar', isoDate: '2026-03-19',
    type: 'cleaning', orderId: 'HOK-ORD-001', customer: 'Priya Rathore',
    product: 'Crimson Zardozi Bridal Lehenga',
    note: 'Day 1 of 3 — post-return cleaning window',
    detail: {
      title: 'Cleaning — Crimson Zardozi Bridal Lehenga',
      subtitle: 'Day 1 of 3 — post-return cleaning window',
      dueDate: 'Thu, 19 Mar, 2026',
      relatedOrderId: 'HOK-ORD-001', relatedCustomer: 'Priya Rathore',
    },
  },
  {
    id: 'agenda-009', date: 'Thu, 19 Mar', isoDate: '2026-03-19',
    type: 'rental-starts', orderId: 'HOK-ORD-015', customer: 'Nisha Agarwal',
    product: 'Champagne Tissue Sharara',
    note: 'Rental window 19–21 Mar 2026 (3 days)',
    detail: {
      title: 'Rental Starts — Champagne Tissue Sharara',
      subtitle: 'Rental window 19–21 Mar 2026 (3 days)',
      dueDate: 'Thu, 19 Mar, 2026',
      relatedOrderId: 'HOK-ORD-015', relatedCustomer: 'Nisha Agarwal',
    },
  },
];