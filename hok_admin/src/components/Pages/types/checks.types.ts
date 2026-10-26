/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Types: Checks & Rules (Spec §9 & §13.1)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

export type CheckImportance = 'high' | 'medium' | 'low';

export type CheckKind =
  | 'missing-figure'
  | 'retired-figure'
  | 'never-printed-figure'
  | 'waiting-figure'
  | 'missing-date'
  | 'old-figure-typed'
  | 'typed-figure'
  | 'unmatched-amount'
  | 'forbidden-word'
  | 'above-free-delivery'
  | 'hardcoded-year'
  | 'broken-link'
  | 'broken-pick'
  | 'unbuilt-page'
  | 'unreviewed-policy'
  | 'missing-description';

export interface CheckItem {
  id: string;
  pageSlug: string;
  pageName: string;
  location: string;
  kind: CheckKind;
  importance: CheckImportance;
  title: string;
  detail: string;
  targetText?: string;
  matchedWords?: string;
  ruleExplanation?: string;
  suggestedAction?: string;
  suggestedFigureKey?: string;
  acknowledged?: boolean;
  acknowledgementReason?: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolved?: boolean;
}

export interface ForbiddenWordRule {
  id: string;
  ruleName: string;
  pattern: RegExp;
  catches: string;
  why: string;
  importance: CheckImportance;
}

export interface ChecksSummary {
  highImportanceCount: number;
  mediumImportanceCount: number;
  lowImportanceCount: number;
  totalActiveChecks: number;
  acknowledgedChecksCount: number;
}
