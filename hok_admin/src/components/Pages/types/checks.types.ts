/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Types: Checks & Health (Spec §4.2, §9, §14.2)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

export type CheckImportance = 'high' | 'medium' | 'low';

export type CheckCategory =
  | 'figure-outdated'
  | 'broken-link'
  | 'law-update'
  | 'draft-conflict'
  | 'empty-placeholder'
  | 'style-guide'
  | 'forbidden-word'
  | 'handwritten-figure';

export type CheckKind =
  | 'unresolved-figure'
  | 'retired-figure'
  | 'never-printed-figure'
  | 'waiting-decision-figure'
  | 'missing-date'
  | 'old-figure-handwritten'
  | 'figure-handwritten'
  | 'amount-handwritten'
  | 'forbidden-word'
  | 'above-free-delivery'
  | 'copyright-year'
  | 'broken-target'
  | 'lost-source'
  | 'handwritten-example'
  | 'words-not-loaded'
  | 'unbuilt-page'
  | 'unreviewed-old'
  | 'no-search-description';

export type CheckActionType =
  | 'open'
  | 'use-figure'
  | 'is-example'
  | 'is-right-here'
  | 'the-page'
  | 'the-figure'
  | 'i-checked-it'
  | 'mark-reviewed'
  | 'decide-page';

export interface CheckItem {
  id: string;
  pageSlug: string;
  pageTitle: string;
  importance: CheckImportance;
  category: CheckCategory;
  kind?: CheckKind;
  title: string;
  description: string;
  part?: string;
  clauseId?: string;
  surroundingWords?: string;
  actionLabel: string;
  availableActions?: CheckActionType[];
  figureKey?: string;
  targetSlug?: string;
  resolved: boolean;
  acknowledged?: boolean;
  acknowledgedReason?: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  createdDate?: string;
}

export interface ChecksSummary {
  total: number;
  high: number;
  medium: number;
  low: number;
  pagesAffected: number;
}

export interface ForbiddenWordRule {
  id: string;
  rule: string;
  catches: string[];
  why: string;
  importance: CheckImportance;
}

