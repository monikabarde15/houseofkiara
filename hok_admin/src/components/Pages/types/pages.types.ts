/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Types: Pages & Workspace (Spec §1.2, §4, §7, §8)
   Admin panel v217 · 20 October 2026
========================================================= */

export type PageGroupId =
  | 'content-help'
  | 'policies'
  | 'not-built'
  | 'system';

export interface PageGroupMeta {
  id: PageGroupId;
  label: string;
  count: number;
  description: string;
}

export type PageHealth =
  | 'clean'
  | 'needs-attention'
  | 'not-built'
  | 'scheduled';

export interface PageCardData {
  id: string;
  slug: string;
  title: string;
  group: PageGroupId;
  summary: string;
  builtFrom?: string;
  health: PageHealth;
  version: string;
  lastPublished: string;
  lastEditor: string;
  wordsCount: number;
  figuresCount: number;
  checksCount: number;
  highChecksCount: number;
  mediumChecksCount: number;
  lowChecksCount: number;
  isBuilt: boolean;
  hasScheduled: boolean;
  scheduledDate?: string;
  scheduledSummary?: string;
  connectedSlugs?: string[];
  readingTimeMinutes?: number;
  datesLine?: string;
  countsLine?: string;
  healthLine?: string;
  statusBadge?: 'Live' | 'Not built' | 'System' | string;
}

export type TopLevelTab = 'pages' | 'figures' | 'links';

export type WorkspaceTab = 'edit' | 'preview' | 'checks' | 'history' | 'reach';

export interface PageStatsSummary {
  pagesTotal: number;
  pagesBuilt: number;
  pagesNotBuilt: number;
  pagesNeedLook: number;
  scheduledChangesCount: number;
}
