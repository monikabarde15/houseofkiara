/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Types: Answers & Clauses (Spec §7.8, §13.1)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

export type AnswerSide = 'rentals' | 'preloved' | 'both';

export type StatusTagTone = 'good-news' | 'worth-knowing' | 'not-possible' | 'none';

export interface AnswerParagraph {
  id: string;
  kind: 'paragraph' | 'bullet' | 'note';
  text: string;
  sharedFrom?: {
    pageName: string;
    questionTitle: string;
  };
}

export interface AnswerItem {
  id: string;
  question: string;
  section: string;
  side: AnswerSide;
  statusTag?: {
    label: string;
    tone: StatusTagTone;
  };
  paragraphs: AnswerParagraph[];
  searchWords?: string;
  linkName: string;
  teamNote?: string;
  hasChecks?: boolean;
  checkTone?: 'red' | 'amber';
  isShared?: boolean;
  appearsIn?: string[];
  orderIndex: number;
}
