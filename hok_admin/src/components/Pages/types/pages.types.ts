/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Types: Pages & Navigation (Spec §1.2, §3, §4, §13.1)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

export type TopLevelTab = 'pages' | 'figures' | 'links';

export type PageGroupId = 'content-help' | 'policies' | 'not-built' | 'system';

export type PageKind = 'content' | 'help' | 'policy' | 'not-built' | 'system';

export type PageStatus = 'Live' | 'System' | 'Not built' | 'Waiting';

export interface PageGroup {
  id: PageGroupId;
  label: string;
  description: string;
}

export type PageGroupMeta = PageGroup;

export interface PageCardData {
  key: string;
  name: string;
  title: string;
  slug: string;
  address: string;
  group: PageGroupId;
  kind: PageKind;
  isBuilt: boolean;
  waitingForFile?: boolean;
  pageFile?: string;
  olderNames?: string[];
  summary: string;
  datesLine: string;
  countsLine: string;
  healthLine: string;
  checksCount: number;
  highChecksCount: number;
  mediumChecksCount: number;
  lowChecksCount: number;
  health: 'clean' | 'attention';
  version?: string;
  lastReviewed?: string;
  lastPublished?: string;
  lastEditor?: string;
  wordsCount: number;
  figuresCount: number;
  hasScheduled?: boolean;
  decisionNote?: string;
}

export interface PageStatsSummary {
  pagesTotal: number;
  pagesBuilt: number;
  pagesNotBuilt: number;
  pagesNeedLook: number;
  scheduledChangesCount: number;
}

export type WorkspaceTab = 'paper' | 'answers' | 'clauses' | 'settings';

export interface UserRoleAccess {
  role: 'Super Admin' | 'Operations Manager' | 'Content Manager' | 'Viewer';
  accessLevel: 'Full Access' | 'Edit' | 'View Only';
}
