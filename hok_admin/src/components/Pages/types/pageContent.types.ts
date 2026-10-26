/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Types: Page Content Definitions (Spec §8.1 to §8.26)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

export interface PageContentPart {
  id: string;
  label: string;
  count?: number;
  hasChecks?: boolean;
}

export interface PageHeroContent {
  tagline: string;
  headingPrefix: string;
  headingGoldItalic: string;
  headingSuffix?: string;
  lead: string;
  searchPlaceholder: string;
  popularQuestions: string[];
}

export interface PageOpeningContent {
  sideLabel?: string;
  text: string;
  figures: Array<{
    key: string;
    label: string;
    displayValue: string;
    contextBefore: string;
    contextAfter: string;
  }>;
}

export interface PageContentDefinition {
  slug: string;
  parts: PageContentPart[];
  hero: PageHeroContent;
  opening: PageOpeningContent;
  hasTwoSides?: boolean;
  rentalAnswersCount?: number;
  prelovedAnswersCount?: number;
}
