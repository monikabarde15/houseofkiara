/**
 * House of Kaira - Seller Guidelines Site Tokens & Settings
 * Section 9 of Build Specification 1.0
 *
 * Every figure on the page is read from Site Tokens.
 * Updating any token here updates all copy, search, and displays across the page.
 */

export const SITE_TOKENS = {
  submission_reply: "48 hours",
  payout_cycle: "3 working days",
  issue_window: "24 hours",
  latent_window: "30 days",
  support_whatsapp: "+91 93401 39300",
  support_whatsapp_raw: "919340139300",
  age_min: "18 years",
  withdraw_notice: "15 days",
  free_return_after: "90 days",
  borrow_notice: "15 days",
  handover_within: "48 hours",
  page_updated: "8 October 2026"
};

export const SELLER_PAGE_CONFIG = {
  title: "Seller Guidelines | House of Kaira",
  meta_description:
    "How listing with House of Kaira works from first photographs to payout, and how your piece is protected along the way.",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Sell with Us", href: "/list-your-piece" },
    { label: "Seller Guidelines", href: null }
  ],
  eyebrow: "Sell with Us",
  h1: "Seller Guidelines",
  lead:
    "Every piece listed with House of Kaira stays yours. With every celebration it joins, it recovers a meaningful part of what you invested in it, and the craft that went into it lives on in more stories. Here is how listing works, and how we look after your piece along the way.",
  lister_terms_label: "Read the Lister Terms",
  lister_terms_url: "/terms#lister-terms",
  search_label: "Search the guidelines",
  search_placeholder: "Try payouts or damage",
  search_suggestion_chips: ["payout", "damage", "take my piece back", "share"]
};

export default SITE_TOKENS;
