/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Settings & Figures: Seller Guidelines (Spec § 8.17, Screen 58)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

export const SELLER_TOKENS = {
  submission_reply: '48 hours',
  payout_cycle: '3 working days',
  issue_window: '24 hours',
  latent_window: '30 days',
  support_whatsapp: '+91 93401 39300',
  support_whatsapp_raw: '919340139300',
  age_min: '18 years',
  withdraw_notice: '15 days',
  free_return_after: '90 days',
  borrow_notice: '15 days',
  handover_within: '48 hours',
  page_updated: '8 October 2026'
};

export const SELLER_CHECKS = [
  {
    id: 'chk_seller_designer_partners',
    type: 'high',
    title: 'Links to a page that is not built: Designer Partners',
    location: 'Chapters · Who can list a piece with House of Kaira?'
  }
];

export const SELLER_FIGURES = [
  {
    key: 'free_return_after',
    label: 'Free return of a piece after',
    value: '90 days',
    count: '4×'
  },
  {
    key: 'payout_cycle',
    label: 'Lister payout within',
    value: '3 working days',
    count: '3×'
  },
  {
    key: 'submission_reply',
    label: 'Reply to a new listing within',
    value: '48 hours',
    count: '3×'
  },
  {
    key: 'support_whatsapp',
    label: 'WhatsApp number',
    value: '+91 93401 39300',
    count: '1×'
  },
  {
    key: 'issue_window',
    label: 'Tell us about a problem within',
    value: '24 hours',
    count: '1×'
  },
  {
    key: 'title_separator',
    label: 'Title separator',
    value: '·',
    count: '1×'
  }
];

export const SELLER_PAGE_CONFIG = {
  title: 'Seller Guidelines | House of Kaira',
  meta_description:
    'How listing with House of Kaira works from first photographs to payout, and how your piece is protected along the way.',
  eyebrow: 'Sell with Us',
  h1: 'Seller Guidelines',
  lead:
    'Every piece listed with House of Kaira stays yours. With every celebration it joins, it recovers a meaningful part of what you invested in it, and the craft that went into it lives on in more stories. Here is how listing works, and how we look after your piece along the way.',
  lister_terms_label: 'Read the Lister Terms',
  lister_terms_url: '/terms#lister-terms',
  search_placeholder: 'Try payouts or damage',
  search_suggestion_chips: ['payout', 'damage', 'take my piece back', 'share']
};

export default SELLER_TOKENS;
