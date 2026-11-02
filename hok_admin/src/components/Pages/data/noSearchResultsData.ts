/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Data: No search results (/search) System Page (Spec § 8.19, Screen 60)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

export interface NoSearchScenario {
  id: string;
  label: string;
  eyebrow: string;
  headingPrefix: string;
  queryPlaceholder: string;
  headingSuffix: string;
  subtitle: string;
  searchInputValue: string;
  didYouMean?: string;
  widenNotice?: string;
  wordChips?: string[];
  designerLink?: string;
}

export const NO_SEARCH_SCENARIOS: NoSearchScenario[] = [
  {
    id: 'nowhere',
    label: 'Nothing anywhere',
    eyebrow: 'SEARCH',
    headingPrefix: 'Nothing matches “',
    queryPlaceholder: 'what was searched',
    headingSuffix: '” yet',
    subtitle:
      'New pieces arrive all the time. Try a designer, an occasion or a colour, or let our team look for it for you.',
    searchInputValue: ''
  },
  {
    id: 'misspelling',
    label: 'A misspelling',
    eyebrow: 'SEARCH',
    headingPrefix: 'Nothing matches “',
    queryPlaceholder: 'what was searched',
    headingSuffix: '” yet',
    subtitle:
      'New pieces arrive all the time. Try a designer, an occasion or a colour, or let our team look for it for you.',
    searchInputValue: 'sabyasachee lehnga',
    didYouMean: 'sabyasachi lehenga'
  },
  {
    id: 'more_words',
    label: 'More words than we can match',
    eyebrow: 'SEARCH',
    headingPrefix: 'Nothing matches “',
    queryPlaceholder: 'what was searched',
    headingSuffix: '” yet',
    subtitle:
      'Try fewer words, or start with one of the words below that find pieces on their own.',
    searchInputValue: 'sabyasachi bridal red lehenga heavy',
    wordChips: ['sabyasachi', 'lehenga', 'red', 'bridal']
  },
  {
    id: 'asked_rent',
    label: 'Asked to rent',
    eyebrow: 'SEARCH',
    headingPrefix: 'Nothing to rent matches “',
    queryPlaceholder: 'what was searched',
    headingSuffix: '” yet',
    subtitle:
      'The same words find pieces when you look beyond rentals.',
    searchInputValue: 'Anita Dongre saree',
    widenNotice: 'See 3 preloved pieces'
  },
  {
    id: 'designer_empty',
    label: 'A designer with nothing live',
    eyebrow: 'SEARCH',
    headingPrefix: 'Nothing by ',
    queryPlaceholder: 'the designer',
    headingSuffix: ' is with us right now',
    subtitle:
      'Pieces by designers come and go as they are rented and sold. Our team can tell you the moment the next one arrives.',
    searchInputValue: 'Rahul Mishra',
    designerLink: 'See every designer, A to Z'
  }
];

export interface OccasionCardItem {
  num: string;
  title: string;
  action: string;
  href: string;
}

export const NO_SEARCH_OCCASIONS: OccasionCardItem[] = [
  { num: 'I', title: 'Bridal', action: 'EXPLORE', href: '/main-page?section=bridal' },
  { num: 'II', title: 'Wedding Guest', action: 'EXPLORE', href: '/main-page?section=wedding-guest' },
  { num: 'III', title: 'Mehendi & Sangeet', action: 'EXPLORE', href: '/main-page?section=mehendi' },
  { num: 'IV', title: 'Festive', action: 'EXPLORE', href: '/main-page?section=festive' },
  { num: 'V', title: 'Cocktail', action: 'EXPLORE', href: '/main-page?section=cocktail' },
  { num: 'VI', title: 'Reception', action: 'EXPLORE', href: '/main-page?section=reception' },
  { num: 'VII', title: 'Engagement', action: 'EXPLORE', href: '/main-page?section=engagement' },
  { num: 'A to Z', title: 'All designers', action: 'BROWSE', href: '/main-page?section=designers' }
];

export const NO_SEARCH_TRENDING_CHIPS: string[] = [
  'Sabyasachi lehenga',
  'Bridal red lehenga',
  'Manish Malhotra saree',
  'Torani anarkali',
  'Wedding guest outfit',
  'Mehendi sharara',
  'Raw Mango saree',
  'Cocktail gown'
];

export const NO_SEARCH_FIGURES = [
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
