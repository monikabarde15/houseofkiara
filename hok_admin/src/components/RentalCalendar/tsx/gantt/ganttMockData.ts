import { GanttOrderRow } from '../../types';

export const ganttMockData: GanttOrderRow[] = [
  {
    id: 'gantt-001', orderId: 'HOK-ORD-001', customer: 'Priya Rathore', product: 'Crimson Zardozi',
    segments: [
      { day: 13, type: 'dispatch' }, { day: 14, type: 'rental' }, { day: 15, type: 'rental' },
      { day: 16, type: 'rental' }, { day: 17, type: 'rental' }, { day: 18, type: 'return' },
      { day: 21, type: 'deposit' },
    ],
  },
  {
    id: 'gantt-003', orderId: 'HOK-ORD-003', customer: 'Neha Kulkarni', product: 'Rose Georgette',
    segments: [
      { day: 20, type: 'dispatch' }, { day: 21, type: 'rental' }, { day: 22, type: 'rental' },
      { day: 23, type: 'rental' }, { day: 24, type: 'rental' }, { day: 25, type: 'return' },
      { day: 28, type: 'deposit' },
    ],
  },
  {
    id: 'gantt-005', orderId: 'HOK-ORD-005', customer: 'Divya Nair', product: 'Gulabi Lehenga',
    segments: [{ day: 26, type: 'dispatch' }, { day: 27, type: 'rental' }],
  },
  {
    id: 'gantt-010', orderId: 'HOK-ORD-010', customer: 'Kabir Malhotra', product: 'Crimson Zardozi',
    segments: [
      { day: 18, type: 'dispatch' }, { day: 19, type: 'rental' }, { day: 20, type: 'rental' },
      { day: 21, type: 'rental' }, { day: 22, type: 'return' },
    ],
  },
  {
    id: 'gantt-012', orderId: 'HOK-ORD-012', customer: 'Meera Kapoor', product: 'Crimson Zardozi',
    segments: [{ day: 24, type: 'dispatch' }],
  },
  {
    id: 'gantt-013', orderId: 'HOK-ORD-013', customer: 'Ananya Desai', product: 'Rose Georgette',
    segments: [{ day: 16, type: 'dispatch' }, { day: 17, type: 'return' }],
  },
  {
    id: 'gantt-014', orderId: 'HOK-ORD-014', customer: 'Vikram Chopra', product: 'Rose Georgette',
    segments: [{ day: 27, type: 'dispatch' }],
  },
  {
    id: 'gantt-011', orderId: 'HOK-ORD-011', customer: 'Ritu Chandra', product: 'Champagne Tissue',
    segments: [{ day: 20, type: 'dispatch' }],
  },
  {
    id: 'gantt-015', orderId: 'HOK-ORD-015', customer: 'Nisha Agarwal', product: 'Champagne Tissue',
    segments: [
      { day: 13, type: 'dispatch' }, { day: 14, type: 'rental' }, { day: 15, type: 'rental' },
      { day: 16, type: 'rental' }, { day: 17, type: 'return' }, { day: 20, type: 'deposit' },
    ],
  },
  {
    id: 'gantt-016', orderId: 'HOK-ORD-016', customer: 'Tara Bhatt', product: 'Rajputana Silk',
    segments: [
      { day: 15, type: 'dispatch' }, { day: 16, type: 'rental' }, { day: 17, type: 'rental' },
      { day: 18, type: 'return' },
    ],
  },
];