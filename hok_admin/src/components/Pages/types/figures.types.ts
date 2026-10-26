/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Types: Figures & Register (Spec §5, §13.1 & Appendix A)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

export type FigureOwner = 'Set here' | 'Site Settings' | 'By law' | 'Counted' | 'Each page';

export type FigureStatus = 'live' | 'waiting' | 'retired' | 'never-printed';

export type FigureValueType = 
  | 'amount' 
  | 'percentage' 
  | 'time' 
  | 'range' 
  | 'list' 
  | 'words' 
  | 'phone' 
  | 'email' 
  | 'counted' 
  | 'page date';

export interface FigureHistoryEntry {
  value: string;
  dateInForce: string;
  who: string;
  why: string;
  recordedAt: string;
}

export interface FigureScheduledChange {
  value: string;
  fromDate: string;
  who: string;
  why: string;
}

export interface FigureWaitingChange {
  value: string;
  when: 'now' | 'date';
  date?: string;
  why: string;
  who: string;
  at: string;
}

export interface FigureLocation {
  pageName: string;
  pageSlug: string;
  part: string;
  locationKind: 'answer' | 'clause' | 'field' | 'statement' | 'step';
  contextSentence: string;
  nowSentence?: string;
  afterSentence?: string;
}

export interface FigureItem {
  key: string;
  label: string;
  subject: string;
  type?: FigureValueType;
  owner: FigureOwner;
  status: FigureStatus;
  value: any;
  displayValue: string;
  description?: string;
  notes?: string;
  reachCount?: number;
  pageCount?: number;
  reachPages?: string[];
  usedOnSlugs?: string[];
  locked?: boolean;
  isLocked?: boolean;
  lockReason?: string;
  contractual?: boolean;
  waitingNote?: string;
  retiredReason?: string;
  ruleLine?: string;
  wordsAfter?: string;
  olderNames?: string[];
  format?: string;
  drives?: string[];
  legacyValues?: Array<{
    file: string;
    writtenAs: string;
    fileSays: string;
    kind: string;
  }>;
  typedByHandLocations?: Array<{
    pageName: string;
    pageSlug: string;
    sentence: string;
  }>;
  locations?: FigureLocation[];
  history?: FigureHistoryEntry[];
  scheduledChange?: FigureScheduledChange;
  waitingChange?: FigureWaitingChange;
  hasScheduled?: boolean;
  hasPendingChange?: boolean;
}

export interface FigureSubjectMeta {
  id: string;
  label: string;
  count: number;
  description: string;
  name?: string;
  summary?: string;
  figuresCount?: number;
}
