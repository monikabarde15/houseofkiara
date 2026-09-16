// Types shared across the Rental Calendar section

export type EventType =
  | 'prep-dispatch'
  | 'dispatched'
  | 'rental-starts'
  | 'return-due'
  | 'cleaning'
  | 'back-in-rotation'
  | 'deposit-due'
  | 'payout-due'
  | 'offer-response-due'
  | 'delivery-followup'
  | 'internal-task';

export interface CalendarEventDetail {
  customerName: string;
  customerLocation: string;
  customerPhone: string;
  orderPlaced: string; // display string, e.g. "15 Mar 2026"
  productName: string;
  productSubtitle: string; // e.g. "Ritu Kumar · Size M · Rental"
  rentalPeriodLabel: string; // "19 Mar 2026 – 21 Mar 2026"
  dispatchByLabel: string;
  dispatchOverdue?: boolean;
  carrierLabel: string;
  rentalAmountLabel: string;
  securityDepositLabel: string;
  depositStatusLabel: string;
  overdueMessage?: string;
}

export interface CalendarEvent {
  id: string;
  type: EventType | string;
  title: string;
  /** ISO date, e.g. "2026-03-18" */
  date: string;
  time?: string;
  assignee?: string;
  description?: string;
  status?: string;
  orderId?: string;
  /** Optional — pills without this simply won't render a hover card. */
  detail?: CalendarEventDetail;
}

export type CalendarViewMode = 'month' | 'agenda' | 'gantt';

export interface DispatchCard {
  id: string;
  /** e.g. "13 MAR" */
  dateLabel: string;
  isToday?: boolean;
  title: string;
  subtitle: string;
  orderId: string;
}

/** Display label + color for every event type, used by both pills and the legend. */
export const EVENT_STYLES: Record<EventType, { label: string; color: string }> = {
  'prep-dispatch': { label: 'Prep Dispatch', color: '#A6822E' },
  dispatched: { label: 'Dispatched', color: '#B54A34' },
  'rental-starts': { label: 'Rental Starts', color: '#3B5D42' },
  'return-due': { label: 'Return Due', color: '#707A3A' },
  cleaning: { label: 'Cleaning', color: '#6B6E76' },
  'back-in-rotation': { label: 'Back in Rotation', color: '#4F7A52' },
  'deposit-due': { label: 'Deposit Due', color: '#C79A2E' },
  'payout-due': { label: 'Payout Due', color: '#211C18' },
  'offer-response-due': { label: 'Offer Response Due', color: '#7A3B5E' },
  'delivery-followup': { label: 'Delivery Follow-up', color: '#3B5A8A' },
  'internal-task': { label: 'Internal Task', color: '#7A4331' },
};

//Agenda
export type AgendaActionType =
  | 'prep-dispatch' | 'dispatched' | 'rental-starts' | 'return-due' | 'cleaning' | 'internal-task';

export interface AgendaEntryDetail {
  title: string;
  subtitle: string;
  dueDate: string;
  relatedOrderId: string;
  relatedCustomer: string;
}

export interface AgendaEntry {
  id: string;
  date: string;
  isoDate: string;
  type: AgendaActionType;
  orderId: string;
  customer: string;
  product: string;
  note: string;
  done?: boolean;
  savedNote?: string;
  detail: AgendaEntryDetail;
}

// Gantt
export type GanttSegmentType = 'dispatch' | 'rental' | 'return' | 'deposit' | 'cleaning';

export interface GanttSegment {
  /** Day of month, 1-31 */
  day?: number;
  start?: string;
  end?: string;
  type: GanttSegmentType;
}

export interface GanttOrderRow {
  id: string;
  orderId: string;
  customer: string;
  product: string;
  segments: GanttSegment[];
}