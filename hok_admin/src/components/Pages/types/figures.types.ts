/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Types: Figures & Global Tokens (Spec Appendix A, §5, §10)
   Admin panel v217 · 20 October 2026
========================================================= */

export type FigureSubjectId =
  | 'delivery-dispatch'
  | 'rental-window'
  | 'cancelling-refunds'
  | 'deposit'
  | 'problems-late'
  | 'preloved-offers'
  | 'listing-with-us'
  | 'reaching-us'
  | 'brand'
  | 'legal-complaints'
  | 'tax'
  | 'set-by-law'
  | 'advice-we-give'
  | 'cookies-consent'
  | 'counted-live'
  | 'page-dates'
  | 'never-printed';

export interface FigureSubjectMeta {
  id: FigureSubjectId;
  label: string;
  count: number;
  description?: string;
}

export type FigureOwner =
  | 'Set here'
  | 'Site settings'
  | 'By law'
  | 'Counted'
  | 'Each page';

export type FigureStatus =
  | 'live'
  | 'waiting'
  | 'retired'
  | 'never-printed'
  | 'changing';

export type FigureFormat =
  | 'currency'
  | 'percent'
  | 'days'
  | 'hours'
  | 'time'
  | 'date'
  | 'count'
  | 'text'
  | 'email'
  | 'phone'
  | 'url';

export interface FigureLegacyValue {
  file: string;
  writtenAs: string;
  fileSays: string;
  kind: 'Old value' | 'Retired figure' | 'Waiting for a decision' | 'Placeholder in the file';
}

export interface FigureItem {
  key: string;
  label: string;
  value: string | number;
  displayValue: string;
  unit?: string;
  subject: FigureSubjectId;
  owner: FigureOwner;
  status: FigureStatus;
  reachCount: number;
  usedOnSlugs: string[];
  notes?: string;
  format: FigureFormat;
  pendingValue?: string | number;
  scheduledDate?: string;
  locked?: boolean;
  decisionRequired?: boolean;
  reachPages?: string[];
  hasScheduled?: boolean;
  legacyValues?: FigureLegacyValue[];
  drives?: string[];
}

export interface FigureGroupSummary {
  subject: FigureSubjectId;
  label: string;
  figures: FigureItem[];
}
