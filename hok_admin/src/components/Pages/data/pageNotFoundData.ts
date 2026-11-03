/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Data: Page not found (404) System Page (Spec § 8.18, Screen 59)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

export interface NotFoundScenario {
  id: string;
  label: string;
  eyebrow: string;
  headingPrefix: string;
  headingGoldItalic: string;
  hasPieceToken?: boolean;
  body: string;
  suggestQuery: string;
  piecesBandEyebrow: string;
  piecesBandTitlePrefix: string;
  piecesBandTitleToken?: string;
  piecesBandLink: string;
  conciergeTitlePrefix: string;
  conciergeTitleItalic: string;
  conciergeDesc: string;
}

export const NOT_FOUND_SCENARIOS: NotFoundScenario[] = [
  {
    id: 'sold',
    label: 'A piece that has sold',
    eyebrow: 'NO LONGER AVAILABLE',
    headingPrefix: 'This piece has ',
    headingGoldItalic: 'found its next home',
    hasPieceToken: true,
    body: 'The the piece by the designer now belongs to someone who will treasure it. Here are pieces in the same spirit, or our team can look for one like it for you.',
    suggestQuery: 'Sabyasachi lehenga',
    piecesBandEyebrow: 'STILL AVAILABLE',
    piecesBandTitlePrefix: 'More from ',
    piecesBandTitleToken: 'the designer',
    piecesBandLink: 'ALL THE DESIGNER PIECES',
    conciergeTitlePrefix: 'Looking for a piece ',
    conciergeTitleItalic: 'like it?',
    conciergeDesc: 'Tell us what you loved about it and our team will look for something like it. The piece is already named in the message, so there is nothing to copy.'
  },
  {
    id: 'gone',
    label: 'A piece its owner took back',
    eyebrow: 'NO LONGER AVAILABLE',
    headingPrefix: 'This piece has ',
    headingGoldItalic: 'moved on',
    hasPieceToken: true,
    body: 'The the piece by the designer is no longer with the house. Here are pieces in the same spirit, or our team can look for one like it for you.',
    suggestQuery: 'Sabyasachi lehenga',
    piecesBandEyebrow: 'STILL AVAILABLE',
    piecesBandTitlePrefix: 'In the same spirit',
    piecesBandLink: 'ALL BRIDAL LEHENGAS',
    conciergeTitlePrefix: 'Looking for a piece ',
    conciergeTitleItalic: 'like it?',
    conciergeDesc: 'Tell us what you loved about it and our team will look for something like it. The piece is already named in the message, so there is nothing to copy.'
  },
  {
    id: 'mistyped',
    label: 'A mistyped link to a piece',
    eyebrow: 'PAGE NOT FOUND',
    headingPrefix: 'This page has ',
    headingGoldItalic: 'moved on',
    hasPieceToken: false,
    body: 'The link may be mistyped, but we found words in it that lead to these pieces. Let us help you find your way.',
    suggestQuery: 'Sabyasachi',
    piecesBandEyebrow: 'STILL AVAILABLE',
    piecesBandTitlePrefix: 'Close to what you were looking for',
    piecesBandLink: 'SEE EVERY MATCH',
    conciergeTitlePrefix: 'Looking for something in ',
    conciergeTitleItalic: 'particular?',
    conciergeDesc: 'Tell us what you had in mind and our team will look for it, or the closest thing to it. The link you followed is already in the message, so there is nothing to copy.'
  },
  {
    id: 'old_link',
    label: 'An old link on our own site',
    eyebrow: 'PAGE NOT FOUND',
    headingPrefix: 'This page has ',
    headingGoldItalic: 'moved on',
    hasPieceToken: false,
    body: 'The link you followed has been updated or retired as we refreshed our collection. Let us help you find your way.',
    suggestQuery: 'bridal lehenga',
    piecesBandEyebrow: 'JUST ARRIVED',
    piecesBandTitlePrefix: 'New to the house',
    piecesBandLink: 'ALL NEW ARRIVALS',
    conciergeTitlePrefix: 'Looking for something in ',
    conciergeTitleItalic: 'particular?',
    conciergeDesc: 'Tell us what you had in mind and our team will look for it, or the closest thing to it. The link you followed is already in the message, so there is nothing to copy.'
  },
  {
    id: 'nothing',
    label: 'A link with nothing to go on',
    eyebrow: 'PAGE NOT FOUND',
    headingPrefix: 'This page has ',
    headingGoldItalic: 'moved on',
    hasPieceToken: false,
    body: 'The link may be old or mistyped, or the piece it led to may have already found its next home. Let us help you find your way.',
    suggestQuery: '',
    piecesBandEyebrow: 'JUST ARRIVED',
    piecesBandTitlePrefix: 'New to the house',
    piecesBandLink: 'ALL NEW ARRIVALS',
    conciergeTitlePrefix: 'Looking for something in ',
    conciergeTitleItalic: 'particular?',
    conciergeDesc: 'Tell us what you had in mind and our team will look for it, or the closest thing to it. The link you followed is already in the message, so there is nothing to copy.'
  }
];

export const NOT_FOUND_FIGURES = [
  {
    key: 'support_days',
    label: 'Days we answer',
    value: 'Seven days a week',
    count: '1×'
  },
  {
    key: 'support_hours',
    label: 'Hours we answer',
    value: '10 AM to 8 PM IST',
    count: '1×'
  },
  {
    key: 'title_separator',
    label: 'Title separator',
    value: '·',
    count: '1×'
  },
  {
    key: 'site_name',
    label: 'Site name',
    value: 'House of Kaira',
    count: '1×'
  }
];

export const NOT_FOUND_QUIET_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Designers, A to Z', href: '/designers' },
  { label: 'Help & FAQs', href: '/faqs' },
  { label: 'Contact Us', href: '/contact' }
];
