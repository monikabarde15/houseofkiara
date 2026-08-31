// src/components/Notifications/types/notification.types.ts

// ---- Bands (§7.1) ----
// Order matters — this is the fixed render order and the urgency order (§6.2.1, §17.3)
export type BandKey = 'today' | 'waiting' | 'them' | 'know' | 'blocked';

export const BAND_ORDER: BandKey[] = ['today', 'waiting', 'them', 'know', 'blocked'];

// Urgency order, most urgent first — used to dedupe a record into exactly one band (§6.2.1)
export const URGENCY_ORDER: BandKey[] = ['today', 'waiting', 'them', 'know'];

export interface BandMeta {
  key: BandKey;
  header: string;
  explanation: string;
}

export const BAND_META: Record<BandKey, BandMeta> = {
  today: {
    key: 'today',
    header: 'Needs doing today',
    explanation: 'Dated, breached, or money at risk. Nothing here can be put down.',
  },
  waiting: {
    key: 'waiting',
    header: 'Waiting on us',
    explanation: 'Someone is waiting and we have not broken a promise yet.',
  },
  them: {
    key: 'them',
    header: 'Waiting on them',
    explanation:
      'The ball is in their court. Not our failure — but it still needs nudging or closing.',
  },
  know: {
    key: 'know',
    header: 'Worth knowing',
    explanation: 'No deadline. These can be put down for a week, in the open.',
  },
  blocked: {
    key: 'blocked',
    header: 'Cannot be seen yet',
    explanation:
      'Asked for, and not derivable from what the panel holds today.',
  },
};

// ---- Row kinds (§9) — derived at render time, never stored ----
export type RowKind = 'standard' | 'routed' | 'clear' | 'putDown' | 'blocked' | 'folded';

// ---- Target / doors (§16) ----
export interface AlertTarget {
  section?: string; // e.g. "returns", used by action buttons (§16.2)
  type?: string; // e.g. "order", "submission", "offer", "payout", "lister", "product"
  id?: string;
  tab?: string; // e.g. "return", "deposit" — which sub-tab to land on
  filter?: string; // e.g. "pendingCollection" — filter to apply on arrival
}

// ---- A single record behind an alert (§19.1 records[]) ----
export interface AlertRecord {
  id: string; // the RECORD id — assignment keys on this alone (§17.5)
  label: string; // e.g. "HOK-ORD-015 · Nisha Agarwal"
  sub: string; // e.g. "2 days late · ₹12,000 held"
  blocks?: string | null; // the blocking line (§10.5), null when none
  money?: number | null; // null when not a money row
  target: AlertTarget;
  isNew?: boolean; // computed against the user's seen list (§17.6)
  ownerId?: string | null; // resolved from the assignment map, not stored on the record itself
}

// ---- One alert definition (§18, §19.1) ----
export interface Alert {
  key: string; // stable alert key, e.g. "overdue"
  band: BandKey;
  surface: 'desk' | 'record'; // 'record' alerts render only on the record page, never here (§17.2)
  title: string;
  what: string; // the explanation line (§8.5)
  elsewhere?: string | null; // "the Return Pipeline" — non-null when routed (§8.4)
  act?: string | null; // primary action button label (§10.7)
  actTarget?: AlertTarget | null;
  message?: string | null; // joined message id, null when none (§8.9, §11)
  blocked: boolean; // true only for the one "cannot be seen yet" alert
  notCounted: boolean; // excluded from every total (§17.2)
  canPutDown: boolean; // only 4 alerts, all in "know" (§17.7)
  records: AlertRecord[];
}

// ---- Put-down state ----
export interface PutDownState {
  [alertKey: string]: string; // alert key -> ISO end date
}

// ---- Seen state, per user (§17.6) ----
export interface SeenState {
  list: string[]; // deduplicated record ids that were on the page when last marked seen
  at: string | null; // display-formatted date, e.g. "23 Mar 2026"
}

// ---- Assignment, keyed to record id alone (§17.5) ----
export interface AssignmentEntry {
  by: string;
  at: string;
}
export type AssignmentMap = Record<string, AssignmentEntry>;

// ---- SLA thresholds, read not hard-coded (§19.4) ----
export interface SlaConfig {
  submissionHours: number;
  offerHours: number;
  cleaningBufferDays: number;
}

// ---- The full computed response shape (§19.1) ----
export interface NotificationsResponse {
  computedAt: string;
  team: string[]; // roster, in order — e.g. ["Priya (Ops)", "Soumya"]
  currentUser: string;
  slas: SlaConfig;
  alerts: Alert[];
  putDown: PutDownState;
  seen: SeenState;
  assigned: AssignmentMap;
}

// ---- Narrowing state (§28) ----
export interface NarrowingState {
  band: BandKey | null;
  person: string | null; // a name from `team`, or the literal 'nobody' for unassigned
}

// ---- Derived per-record urgency map, built once per paint (§6.2.1, §17.3) ----
// recordId -> the single most-urgent band that record reaches
export type UrgencyMap = Record<string, BandKey>;

// ---- The reconciled summary figures (§6.2, §6.5) ----
export interface SummaryCounts {
  today: number;
  waiting: number;
  them: number;
  know: number; // excludes put-down and not-counted alerts
  open: number; // today + waiting + them + know
  byPerson: Record<string, number>;
  nobodyYet: number;
  putDownCount: number;
  moneyAtRisk: number; // §5.4
}
// ---- Render-ready alert (band-deduped, owner-resolved) — consumed by NotifBand/NotifRow ----
export interface AlertRecordView extends AlertRecord {
  ownerId: string | null;
}
export interface AlertDef extends Omit<Alert, 'records'> {
  records: AlertRecordView[];
  putDown: boolean;
}