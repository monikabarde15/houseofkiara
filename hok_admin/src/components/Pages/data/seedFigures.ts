/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL — THE PAGES SECTION
   Seed Data: All 90 Figures (Appendix A, Pages 68-81)
   Admin panel v217 · 20 October 2026
========================================================= */

import { FigureItem, FigureSubjectMeta } from '../types/figures.types';

export const FIGURE_SUBJECTS: FigureSubjectMeta[] = [
  { id: 'delivery-dispatch', label: 'Delivery & dispatch', count: 6, description: 'What delivery costs and how long it takes.' },
  { id: 'rental-window', label: 'Rental window', count: 4, description: 'How long a customer keeps a piece, and when it returns.' },
  { id: 'cancelling-refunds', label: 'Cancelling & refunds', count: 4, description: 'What comes back when plans change, and how fast.' },
  { id: 'deposit', label: 'Deposit', count: 12, description: 'What is held, when it is returned, and what is deducted.' },
  { id: 'problems-late', label: 'Problems & late returns', count: 2, description: 'Daily late fees and deemed purchase thresholds.' },
  { id: 'preloved-offers', label: 'Preloved & offers', count: 2, description: 'Authenticity guarantee and trial window.' },
  { id: 'listing-with-us', label: 'Listing with us', count: 6, description: 'Payout schedules, notice windows and consignment terms.' },
  { id: 'reaching-us', label: 'Reaching us', count: 11, description: 'Contact details and reply times. Most are set in Site Settings.' },
  { id: 'brand', label: 'Brand', count: 4, description: 'Site name, separator, tagline and current year.' },
  { id: 'legal-complaints', label: 'Legal details & complaints', count: 13, description: 'Company name, registered address, GST and grievance officer.' },
  { id: 'tax', label: 'Tax', count: 3, description: 'GST rates across rental, preloved and Buy New.' },
  { id: 'set-by-law', label: 'Set by law', count: 7, description: 'Statutory age, prior price window, appeals and consumer helplines.' },
  { id: 'advice-we-give', label: 'Advice we give', count: 3, description: 'Booking lead times and wedding season guidance.' },
  { id: 'cookies-consent', label: 'Cookies & consent', count: 1, description: 'Consent cookie expiration window.' },
  { id: 'counted-live', label: 'Counted live', count: 3, description: 'Automated counters for active designers, live pieces and cities.' },
  { id: 'page-dates', label: 'Page dates', count: 5, description: 'Version and date stamps printed by pages.' },
  { id: 'never-printed', label: 'Never printed', count: 4, description: 'Internal operating rules, piece by piece shares and courtesy policies.' }
];

export const SEED_FIGURES: FigureItem[] = [
  /* -------------------------------------------------------------
     1. Delivery & dispatch (6 figures, Spec Appendix A, Page 68)
  ------------------------------------------------------------- */
  {
    key: 'free_delivery_min',
    label: 'Free delivery from',
    value: 5000,
    displayValue: '₹5,000',
    subject: 'delivery-dispatch',
    owner: 'Set here',
    status: 'live',
    reachCount: 16,
    usedOnSlugs: ['/shipping-policy', '/pricing', '/faqs', '/how-it-works', '/terms'],
    reachPages: ['/shipping-policy', '/pricing', '/faqs', '/how-it-works', '/terms'],
    notes: 'Standard delivery is free when the pieces in an order come to this amount or more, counted before GST. For a rental it covers both journeys: to the customer and back to us.',
    drives: [
      'Cart: shows how much more brings the order to free delivery',
      'Checkout: the delivery line reads Free at or above it',
      'Promotions: the order calculator applies free delivery before any code',
      'Announcement bar: the free delivery message'
    ],
    format: 'currency',
    legacyValues: [
      { file: 'hok_faq_v6', writtenAs: 'free_delivery_min', fileSays: '₹2,999', kind: 'Old value' },
      { file: 'hok_refund_cancellation_v7', writtenAs: 'free_delivery_min', fileSays: '₹2,999', kind: 'Old value' },
      { file: 'hok_terms_v4', writtenAs: 'free_delivery_min', fileSays: '₹2,999', kind: 'Old value' }
    ]
  },
  {
    key: 'standard_delivery',
    label: 'Standard delivery time',
    value: '3 to 5 business days',
    displayValue: '3 to 5 business days',
    subject: 'delivery-dispatch',
    owner: 'Set here',
    status: 'live',
    reachCount: 4,
    usedOnSlugs: ['/shipping-policy', '/faqs'],
    reachPages: ['/shipping-policy', '/faqs'],
    notes: 'How long standard delivery takes anywhere in India, counted from the day a piece leaves us.',
    drives: [
      'Product pages: the delivery estimate under each piece',
      'Checkout: the delivery dates shown before payment'
    ],
    format: 'days'
  },
  {
    key: 'express_delivery',
    label: 'Express delivery time',
    value: '1 to 2 business days',
    displayValue: '1 to 2 business days',
    subject: 'delivery-dispatch',
    owner: 'Set here',
    status: 'live',
    reachCount: 5,
    usedOnSlugs: ['/shipping-policy', '/faqs', '/refunds'],
    reachPages: ['/shipping-policy', '/faqs', '/refunds'],
    notes: 'Express delivery to most pincodes in India. It is priced for the address at checkout and is never a flat fee.',
    drives: [
      'Checkout: offered with its dates when the address allows'
    ],
    format: 'days'
  },
  {
    key: 'preloved_dispatch',
    label: 'Preloved dispatch, pieces we hold',
    value: '2 business days',
    displayValue: '2 business days',
    subject: 'delivery-dispatch',
    owner: 'Set here',
    status: 'live',
    reachCount: 6,
    usedOnSlugs: ['/faqs', '/shipping-policy', '/terms', '/refunds'],
    reachPages: ['/faqs', '/shipping-policy', '/terms', '/refunds'],
    notes: 'How soon a preloved piece that is already with us leaves after the order.',
    drives: [
      'Dispatch Schedule: the date every preloved order must leave by',
      'Product pages: the dispatch line on preloved pieces we hold'
    ],
    format: 'days'
  },
  {
    key: 'owner_dispatch',
    label: 'Dispatch, pieces kept by their owners',
    value: '10 business days',
    displayValue: '10 business days',
    subject: 'delivery-dispatch',
    owner: 'Set here',
    status: 'live',
    reachCount: 2,
    usedOnSlugs: ['/shipping-policy'],
    reachPages: ['/shipping-policy'],
    notes: 'How soon a piece its owner keeps at home leaves us. We collect it, clean it and check it first, so the product page shows this longer time before payment.',
    drives: [
      'Product pages: the dispatch line on pieces kept at home',
      'Dispatch Schedule: the date those orders must leave by'
    ],
    format: 'days'
  },
  {
    key: 'intl_delivery',
    label: 'International delivery time',
    value: '10 business days',
    displayValue: '10 business days',
    subject: 'delivery-dispatch',
    owner: 'Set here',
    status: 'live',
    reachCount: 3,
    usedOnSlugs: ['/shipping-policy'],
    reachPages: ['/shipping-policy'],
    notes: 'Preloved pieces only. Counted from dispatch. Customs duties and import taxes are paid by the buyer on arrival.',
    drives: [
      'Checkout: the delivery estimate for an address outside India'
    ],
    format: 'days'
  },

  /* -------------------------------------------------------------
     2. Rental window (4 figures, Spec Appendix A, Page 69)
  ------------------------------------------------------------- */
  {
    key: 'window_standard',
    label: 'Standard rental window',
    value: '3 days',
    displayValue: '3 days',
    subject: 'rental-window',
    owner: 'Set here',
    status: 'live',
    reachCount: 13,
    usedOnSlugs: ['/pricing', '/shipping-policy', '/faqs', '/terms', '/refunds'],
    reachPages: ['/pricing', '/shipping-policy', '/faqs', '/terms', '/refunds'],
    notes: 'One price covers the arrival day, the celebration and the return day. Every extra day is added at the piece’s own daily rate.',
    drives: [
      'Booking calendar: the dates offered for every rental',
      'Products: the window every new listing starts with',
      'Pricing & Fees: the worked example adds extra days on top of it',
      'Master Data: the minimum rental length'
    ],
    format: 'days',
    legacyValues: [
      { file: 'hok_faq_v6', writtenAs: 'window_standard', fileSays: '4 days', kind: 'Old value' },
      { file: 'hok_refund_cancellation_v7', writtenAs: 'window_standard', fileSays: '4 days', kind: 'Old value' },
      { file: 'hok_terms_v4', writtenAs: 'window_standard', fileSays: '4 days', kind: 'Old value' }
    ]
  },
  {
    key: 'arrive_before',
    label: 'A rental arrives',
    value: '1 day',
    displayValue: '1 day',
    subject: 'rental-window',
    owner: 'Set here',
    status: 'live',
    reachCount: 8,
    usedOnSlugs: ['/faqs', '/refunds', '/terms', '/care-policy'],
    reachPages: ['/faqs', '/refunds', '/terms', '/care-policy'],
    notes: 'How long before the celebration a rental reaches the customer. The rental window starts on that day.',
    drives: [
      'Booking calendar: the delivery date offered for a celebration',
      'Dispatch Schedule: rental dispatch dates count back from it'
    ],
    format: 'days',
    legacyValues: [
      { file: 'hok_care_policy_v3', writtenAs: 'arrive_before', fileSays: '2 days', kind: 'Old value' },
      { file: 'hok_faq_v6', writtenAs: 'arrive_before', fileSays: '2 days', kind: 'Old value' },
      { file: 'hok_refund_cancellation_v7', writtenAs: 'arrive_before', fileSays: '2 days', kind: 'Old value' },
      { file: 'hok_terms_v4', writtenAs: 'arrive_before', fileSays: '2 days', kind: 'Old value' }
    ]
  },
  {
    key: 'window_extended',
    label: 'Extended rental window',
    value: '7 days',
    displayValue: '7 days',
    subject: 'rental-window',
    owner: 'Set here',
    status: 'retired',
    reachCount: 3,
    usedOnSlugs: ['/faqs', '/refunds', '/terms'],
    reachPages: ['/faqs', '/refunds', '/terms'],
    notes: 'Dropped in October 2026. Every rental now has one standard window, and a longer stay is extra days at the daily rate.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'days',
    legacyValues: [
      { file: 'hok_faq_v6', writtenAs: 'window_extended', fileSays: '7 days', kind: 'Retired figure' },
      { file: 'hok_refund_cancellation_v7', writtenAs: 'window_extended', fileSays: '7 days', kind: 'Retired figure' },
      { file: 'hok_terms_v4', writtenAs: 'window_extended', fileSays: '7 days', kind: 'Retired figure' }
    ]
  },
  {
    key: 'pickup_within',
    label: 'Return pickup within',
    value: '24 hours',
    displayValue: '24 hours',
    subject: 'rental-window',
    owner: 'Set here',
    status: 'retired',
    reachCount: 1,
    usedOnSlugs: ['/faqs'],
    reachPages: ['/faqs'],
    notes: 'Replaced in October 2026. We now book the return pickup for the Return Date itself, with a drop-off at the delivery partner’s nearest office as the alternative.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'hours',
    legacyValues: [
      { file: 'hok_faq_v6', writtenAs: 'pickup_within', fileSays: '24 hours', kind: 'Retired figure' },
      { file: 'hok_refund_cancellation_v7', writtenAs: 'pickup_within', fileSays: '24 hours', kind: 'Retired figure' },
      { file: 'hok_terms_v4', writtenAs: 'pickup_within', fileSays: '24 hours', kind: 'Retired figure' }
    ]
  },

  /* -------------------------------------------------------------
     3. Cancelling & refunds (4 figures, Spec Appendix A, Pages 69–70)
  ------------------------------------------------------------- */
  {
    key: 'rental_cancel_full',
    label: 'Full refund, rentals cancelled more than',
    value: '7 days',
    displayValue: '7 days',
    subject: 'cancelling-refunds',
    owner: 'Set here',
    status: 'live',
    reachCount: 13,
    usedOnSlugs: ['/refunds', '/pricing', '/faqs', '/terms', '/deposit-policy'],
    reachPages: ['/refunds', '/pricing', '/faqs', '/terms', '/deposit-policy'],
    notes: 'Cancel more than this many days before the rental starts and everything comes back: the rental fee, its GST, delivery and the deposit.',
    drives: [
      'Cancel Booking: the refund shown to the customer before she confirms',
      'Orders: the refund worked out for a cancelled rental'
    ],
    format: 'days'
  },
  {
    key: 'rental_cancel_late_refund',
    label: 'Refund inside that window, before dispatch',
    value: '70%',
    displayValue: '70%',
    subject: 'cancelling-refunds',
    owner: 'Set here',
    status: 'live',
    reachCount: 2,
    usedOnSlugs: ['/pricing'],
    reachPages: ['/pricing'],
    notes: 'Cancel inside the full refund window but before dispatch: this share of the rental fee and its GST comes back, with delivery and the deposit in full, or the dates can be changed free instead.',
    drives: [
      'Cancel Booking: the refund shown before she confirms',
      'Orders: refunds, and what we pay on top when we cancel'
    ],
    format: 'percent'
  },
  {
    key: 'refund_timeline',
    label: 'Refunds reach the customer within',
    value: '7 to 14 days',
    displayValue: '7 to 14 days',
    subject: 'cancelling-refunds',
    owner: 'Set here',
    status: 'live',
    reachCount: 9,
    usedOnSlugs: ['/refunds', '/pricing', '/faqs', '/terms'],
    reachPages: ['/refunds', '/pricing', '/faqs', '/terms'],
    notes: 'From the day a refund is approved to the money reaching the original payment method.',
    drives: [
      'Orders: the refund tracker in My Account',
      'Messaging: the refund confirmation'
    ],
    format: 'days',
    legacyValues: [
      { file: 'hok_faq_v6', writtenAs: 'refund_timeline', fileSays: '5 to 7 business days', kind: 'Old value' },
      { file: 'hok_refund_cancellation_v7', writtenAs: 'refund_timeline', fileSays: '5 to 7 business days', kind: 'Old value' }
    ]
  },
  {
    key: 'claim_decision',
    label: 'Decision on a claim within',
    value: '2 business days',
    displayValue: '2 business days',
    subject: 'cancelling-refunds',
    owner: 'Set here',
    status: 'waiting',
    decisionRequired: true,
    reachCount: 1,
    usedOnSlugs: ['/refunds'],
    reachPages: ['/refunds'],
    notes: 'How soon a preloved buyer hears our decision once she has sent the photographs for a claim.',
    drives: [
      'Orders: the claim decision due date'
    ],
    format: 'days'
  },

  /* -------------------------------------------------------------
     4. Deposit (12 figures, Spec Appendix A, Pages 70–71)
  ------------------------------------------------------------- */
  {
    key: 'deposit_due_before',
    label: 'Deposit due',
    value: '10 days',
    displayValue: '10 days',
    subject: 'deposit',
    owner: 'Set here',
    status: 'live',
    reachCount: 5,
    usedOnSlugs: ['/deposit-policy', '/pricing'],
    reachPages: ['/deposit-policy', '/pricing'],
    notes: 'Every rental’s deposit is due this many days before its dispatch date. If it is not paid, the booking may be cancelled on the usual cancellation terms.',
    drives: [
      'Returns & Deposits: the due date on every booking',
      'Rental Calendar: the deposit request on the operations calendar',
      'Messaging: the deposit request and reminders'
    ],
    format: 'days'
  },
  {
    key: 'deposit_late_booking',
    label: 'Deposit due, late bookings',
    value: '48 hours',
    displayValue: '48 hours',
    subject: 'deposit',
    owner: 'Set here',
    status: 'live',
    reachCount: 3,
    usedOnSlugs: ['/deposit-policy', '/pricing'],
    reachPages: ['/deposit-policy', '/pricing'],
    notes: 'For a booking made after the due date has passed: the deposit is due within this time of our request, and always before dispatch.',
    drives: [
      'Returns & Deposits: the due date on late bookings'
    ],
    format: 'hours'
  },
  {
    key: 'deposit_receipt_within',
    label: 'Deposit receipt confirmed within',
    value: '48 hours',
    displayValue: '48 hours',
    subject: 'deposit',
    owner: 'Set here',
    status: 'live',
    reachCount: 4,
    usedOnSlugs: ['/deposit-policy', '/pricing'],
    reachPages: ['/deposit-policy', '/pricing'],
    notes: 'We confirm in writing that a deposit has reached us within this time of it arriving.',
    drives: [
      'Returns & Deposits: the receipt due on every deposit',
      'Messaging: Deposit Received'
    ],
    format: 'hours'
  },
  {
    key: 'deposit_refund_window',
    label: 'Deposit returned within',
    value: '3 to 5 business days',
    displayValue: '3 to 5 business days',
    subject: 'deposit',
    owner: 'Set here',
    status: 'live',
    reachCount: 6,
    usedOnSlugs: ['/deposit-policy', '/pricing', '/terms'],
    reachPages: ['/deposit-policy', '/pricing', '/terms'],
    notes: 'Counted from the inspection being finished. Returned to the account or UPI ID it was paid from.',
    drives: [
      'Returns & Deposits: the refund due date after inspection',
      'Messaging: the deposit refund confirmation'
    ],
    format: 'days'
  },
  {
    key: 'inspect_within',
    label: 'Returned piece inspected within',
    value: '24 hours',
    displayValue: '24 hours',
    subject: 'deposit',
    owner: 'Set here',
    status: 'live',
    reachCount: 9,
    usedOnSlugs: ['/deposit-policy', '/refunds', '/faqs', '/terms', '/care-policy'],
    reachPages: ['/deposit-policy', '/refunds', '/faqs', '/terms', '/care-policy'],
    notes: 'Every returned rental is inspected within this time of reaching us, against the photographs and video taken before dispatch.',
    drives: [
      'Returns & Deposits: the inspection due on every return',
      'Messaging: Return Received'
    ],
    format: 'hours'
  },
  {
    key: 'deduction_notice_within',
    label: 'Deduction explained within',
    value: '2 business days',
    displayValue: '2 business days',
    subject: 'deposit',
    owner: 'Set here',
    status: 'live',
    reachCount: 6,
    usedOnSlugs: ['/care-policy', '/deposit-policy', '/pricing'],
    reachPages: ['/care-policy', '/deposit-policy', '/pricing'],
    notes: 'If a piece needs restoring, the customer sees the photographs, the amount and how it was worked out within this time of the piece reaching us. Nothing is deducted before she sees it.',
    drives: [
      'Returns & Deposits: the deduction notice due date',
      'Messaging: the damage message'
    ],
    format: 'days',
    legacyValues: [
      { file: 'hok_pricing_fees_v4', writtenAs: 'deduction_notice_within', fileSays: '2 days', kind: 'Old value' }
    ]
  },
  {
    key: 'deduction_reply_within',
    label: 'Time to reply to a deduction',
    value: '2 business days',
    displayValue: '2 business days',
    subject: 'deposit',
    owner: 'Set here',
    status: 'live',
    reachCount: 7,
    usedOnSlugs: ['/deposit-policy', '/care-policy', '/pricing'],
    reachPages: ['/deposit-policy', '/care-policy', '/pricing'],
    notes: 'The customer has this long to reply before a deduction is settled. The part not in question is returned straight away.',
    drives: [
      'Returns & Deposits: when a deduction can be settled'
    ],
    format: 'days',
    legacyValues: [
      { file: 'hok_pricing_fees_v4', writtenAs: 'deduction_reply_within', fileSays: '2 days', kind: 'Old value' }
    ]
  },
  {
    key: 'balance_due',
    label: 'Balance above the deposit due within',
    value: '7 days',
    displayValue: '7 days',
    subject: 'deposit',
    owner: 'Set here',
    status: 'live',
    reachCount: 4,
    usedOnSlugs: ['/deposit-policy', '/terms', '/pricing'],
    reachPages: ['/deposit-policy', '/terms', '/pricing'],
    notes: 'If restoration or a Replacement Value comes to more than the deposit, the balance is due within this time of our written statement.',
    drives: [
      'Returns & Deposits: the balance due date'
    ],
    format: 'days'
  },
  {
    key: 'cash_deposit_limit',
    label: 'Cash deposits accepted below',
    value: 20000,
    displayValue: '₹20,000',
    subject: 'deposit',
    owner: 'By law',
    status: 'live',
    locked: true,
    reachCount: 1,
    usedOnSlugs: ['/deposit-policy'],
    reachPages: ['/deposit-policy'],
    notes: 'Only for bookings made in person in Indore. Cash deposits are always refunded by UPI or bank transfer, never in cash.',
    drives: [
      'Returns & Deposits: a cash deposit at or above it is refused'
    ],
    format: 'currency'
  },
  {
    key: 'deposit_account_name',
    label: 'Deposit account holder',
    value: 'Ekta Agrawal',
    displayValue: 'Ekta Agrawal',
    subject: 'deposit',
    owner: 'Set here',
    status: 'live',
    reachCount: 1,
    usedOnSlugs: ['/deposit-policy'],
    reachPages: ['/deposit-policy'],
    notes: 'The name a customer sees when she pays a deposit by UPI or bank transfer.',
    drives: [
      'Messaging: the payment details sent with a deposit request'
    ],
    format: 'text'
  },
  {
    key: 'deposit_business_name',
    label: 'Deposit account business name',
    value: 'Sebshine Apparels',
    displayValue: 'Sebshine Apparels',
    subject: 'deposit',
    owner: 'Set here',
    status: 'live',
    reachCount: 1,
    usedOnSlugs: ['/deposit-policy'],
    reachPages: ['/deposit-policy'],
    notes: 'The business name shown beside the account holder on a UPI or bank transfer.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'text'
  },
  {
    key: 'deposit_contact',
    label: 'Deposit arranged within',
    value: '24 hours',
    displayValue: '24 hours',
    subject: 'deposit',
    owner: 'Set here',
    status: 'retired',
    reachCount: 3,
    usedOnSlugs: ['/faqs', '/refunds', '/terms'],
    reachPages: ['/faqs', '/refunds', '/terms'],
    notes: 'Replaced in October 2026. The deposit is requested once, due before dispatch (or soon after booking for a late booking), and is never taken at checkout at launch.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'hours',
    legacyValues: [
      { file: 'hok_faq_v6', writtenAs: 'deposit_contact', fileSays: '24 hours', kind: 'Retired figure' },
      { file: 'hok_refund_cancellation_v7', writtenAs: 'deposit_contact', fileSays: '24 hours', kind: 'Retired figure' },
      { file: 'hok_terms_v4', writtenAs: 'deposit_contact', fileSays: '24 hours', kind: 'Retired figure' }
    ]
  },

  /* -------------------------------------------------------------
     5. Problems & late returns (2 figures, Spec Appendix A, Page 72)
  ------------------------------------------------------------- */
  {
    key: 'issue_window',
    label: 'Tell us about a problem within',
    value: '24 hours',
    displayValue: '24 hours',
    subject: 'problems-late',
    owner: 'Set here',
    status: 'live',
    reachCount: 49,
    usedOnSlugs: ['/refunds', '/care-policy', '/faqs', '/shipping-policy', '/terms', '/deposit-policy', '/pricing', '/contact', '/seller-guidelines'],
    reachPages: ['/refunds', '/care-policy', '/faqs', '/shipping-policy', '/terms', '/deposit-policy', '/pricing', '/contact', '/seller-guidelines'],
    notes: 'Counted from delivery. A problem with the fit, the freshness, a missing item or the parcel is reported with photographs inside this time.',
    drives: [
      'Orders: a claim can be opened for this long after delivery',
      'My Account: the Report a problem button stays open for this long'
    ],
    format: 'hours'
  },
  {
    key: 'not_returned_after',
    label: 'A rental counts as not returned after',
    value: '5 days',
    displayValue: '5 days',
    subject: 'problems-late',
    owner: 'Set here',
    status: 'live',
    reachCount: 6,
    usedOnSlugs: ['/deposit-policy', '/shipping-policy', '/terms', '/pricing'],
    reachPages: ['/deposit-policy', '/shipping-policy', '/terms', '/pricing'],
    notes: 'Days past the Return Date before a piece is treated as not returned, and its Replacement Value applies. Until then, each late day costs the daily rate plus GST.',
    drives: [
      'Returns & Deposits: the overdue escalation, and the point a piece counts as lost',
      'Messaging: the overdue notices'
    ],
    format: 'days'
  },

  /* -------------------------------------------------------------
     6. Preloved & offers (2 figures, Spec Appendix A, Page 72)
  ------------------------------------------------------------- */
  {
    key: 'latent_window',
    label: 'Hidden flaw window, preloved',
    value: '30 days',
    displayValue: '30 days',
    subject: 'preloved-offers',
    owner: 'Set here',
    status: 'live',
    reachCount: 3,
    usedOnSlugs: ['/terms', '/pricing', '/seller-guidelines'],
    reachPages: ['/terms', '/pricing', '/seller-guidelines'],
    notes: 'For a significant flaw that was not disclosed and could not have been seen when the piece arrived.',
    drives: [
      'Orders: a claim that a piece is not as described stays open this long'
    ],
    format: 'days'
  },
  {
    key: 'offer_response',
    label: 'Offers answered within',
    value: '24 hours',
    displayValue: '24 hours',
    subject: 'preloved-offers',
    owner: 'Set here',
    status: 'live',
    reachCount: 3,
    usedOnSlugs: ['/faqs', '/terms', '/pricing'],
    reachPages: ['/faqs', '/terms', '/pricing'],
    notes: 'Every offer on a preloved piece is answered within this time: accepted, countered, or declined kindly.',
    drives: [
      'Offers & Enquiries: the reply due on every new offer'
    ],
    format: 'hours'
  },

  /* -------------------------------------------------------------
     7. Listing with us (Spec Appendix A, Page 72–73)
  ------------------------------------------------------------- */
  {
    key: 'submission_reply',
    label: 'Reply to a new listing within',
    value: '48 hours',
    displayValue: '48 hours',
    subject: 'listing-with-us',
    owner: 'Set here',
    status: 'live',
    reachCount: 4,
    usedOnSlugs: ['/seller-guidelines', '/terms'],
    reachPages: ['/seller-guidelines', '/terms'],
    notes: 'From a List Your Piece submission to our first reply on WhatsApp.',
    drives: [
      'LYP Submissions: the alert when a submission passes this mark',
      'Notifications: the submission waiting alert'
    ],
    format: 'hours'
  },
  {
    key: 'payout_cycle',
    label: 'Lister payout within',
    value: '3 working days',
    displayValue: '3 working days',
    subject: 'listing-with-us',
    owner: 'Set here',
    status: 'live',
    reachCount: 15,
    usedOnSlugs: ['list-your-piece', 'pricing-fees', 'how-it-works', 'seller-guidelines', 'terms'],
    reachPages: ['List Your Piece 4', 'Pricing & Fees 4', 'How It Works 3', 'Seller Guidelines 3', 'Terms & Conditions'],
    notes: 'For a rental, counted from the return being inspected. For a sale, counted from the buyer receiving the piece. Paid only into an account or UPI ID in the lister’s own name.',
    drives: [
      'Payouts to Listers: the due date on every payout',
      'Platform & Legal: the payout cycle'
    ],
    format: 'days'
  },
  {
    key: 'withdraw_notice',
    label: 'Notice to take back a piece we hold',
    value: '15 days',
    displayValue: '15 days',
    subject: 'listing-with-us',
    owner: 'Set here',
    status: 'live',
    reachCount: 1,
    usedOnSlugs: ['seller-guidelines'],
    reachPages: ['Seller Guidelines'],
    notes: 'A lister gives this much notice to take back a piece that rests with us. Confirmed bookings are honoured first.',
    drives: [
      'Listers: the earliest date a withdrawn piece can leave'
    ],
    format: 'days'
  },
  {
    key: 'borrow_notice',
    label: 'Notice to borrow back a piece we hold',
    value: '15 days',
    displayValue: '15 days',
    subject: 'listing-with-us',
    owner: 'Set here',
    status: 'live',
    reachCount: 1,
    usedOnSlugs: ['seller-guidelines'],
    reachPages: ['Seller Guidelines'],
    notes: 'A lister who would like to wear her own piece gives this much notice. We clean it afterwards at our cost.',
    drives: [
      'Rental Calendar: the dates blocked for the lister'
    ],
    format: 'days'
  },
  {
    key: 'free_return_after',
    label: 'Free return of a piece after',
    value: '90 days',
    displayValue: '90 days',
    subject: 'listing-with-us',
    owner: 'Set here',
    status: 'live',
    reachCount: 5,
    usedOnSlugs: ['seller-guidelines', 'pricing-fees'],
    reachPages: ['Seller Guidelines 4', 'Pricing & Fees'],
    notes: 'Once a piece that rests with us has been live this long, sending it home is on us. Before that, the lister pays the return delivery.',
    drives: [
      'Listers: whether a withdrawal carries a delivery charge'
    ],
    format: 'days'
  },
  {
    key: 'handover_within',
    label: 'A piece kept at home is ready within',
    value: '48 hours',
    displayValue: '48 hours',
    subject: 'listing-with-us',
    owner: 'Set here',
    status: 'live',
    reachCount: 1,
    usedOnSlugs: ['seller-guidelines'],
    reachPages: ['Seller Guidelines'],
    notes: 'When a piece kept at home is booked or sold, the lister has it ready for collection within this time of our message.',
    drives: [
      'Dispatch Schedule: the collection booked from the lister'
    ],
    format: 'hours'
  },

  /* -------------------------------------------------------------
     8. Reaching us (Spec Appendix A, Page 73–75)
  ------------------------------------------------------------- */
  {
    key: 'support_whatsapp',
    label: 'WhatsApp number',
    value: '+91 93401 39300',
    displayValue: '+91 93401 39300',
    subject: 'reaching-us',
    owner: 'Site settings',
    status: 'live',
    reachCount: 9,
    usedOnSlugs: ['faq', 'contact', 'terms', 'list-your-piece', 'deposit-policy', 'seller-guidelines'],
    reachPages: ['Help & FAQs 2', 'Contact Us 2', 'Terms & Conditions 2', 'List Your Piece', 'Deposit Policy', 'Seller Guidelines'],
    notes: 'The number every page, message and the WhatsApp button send customers to. The chat link is worked out from it.',
    drives: [
      'The WhatsApp button on every page',
      'Messaging: every message that signs off with it'
    ],
    format: 'phone'
  },
  {
    key: 'support_phone',
    label: 'Phone number',
    value: '+91 93401 39300',
    displayValue: '+91 93401 39300',
    subject: 'reaching-us',
    owner: 'Site settings',
    status: 'waiting',
    decisionRequired: true,
    reachCount: 1,
    usedOnSlugs: ['contact'],
    reachPages: ['Contact Us'],
    notes: 'The number on the Call row of Contact Us. Shown during support hours.',
    drives: [
      'Nothing outside the pages'
    ],
    legacyValues: [
      { file: 'hok_contact_v2', writtenAs: 'support_phone', fileSays: '[Phone number]', kind: 'Waiting for a decision' }
    ],
    format: 'phone'
  },
  {
    key: 'support_email',
    label: 'Support email',
    value: 'hello@houseofkaira.com',
    displayValue: 'hello@houseofkaira.com',
    subject: 'reaching-us',
    owner: 'Site settings',
    status: 'live',
    reachCount: 17,
    usedOnSlugs: ['terms', 'faq', 'contact', 'refund-cancellation', 'deposit-policy', 'shipping-delivery', 'care-cleaning-damage', 'pricing-fees', 'careers'],
    reachPages: ['Terms & Conditions 4', 'Help & FAQs 2', 'Contact Us 2', 'Refund & Cancellation Policy 2', 'Deposit Policy 2', 'Shipping & Delivery Policy 2', 'Care, Cleaning & Damage Policy', 'Pricing & Fees', 'Careers'],
    notes: 'The inbox every page and form sends customers to.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'email'
  },
  {
    key: 'support_days',
    label: 'Days we answer',
    value: 'Seven days a week',
    displayValue: 'Seven days a week',
    subject: 'reaching-us',
    owner: 'Site settings',
    status: 'live',
    reachCount: 16,
    usedOnSlugs: ['contact', 'faq', 'terms', 'refund-cancellation', 'deposit-policy', 'care-cleaning-damage', 'shipping-delivery', 'pricing-fees', '404', 'empty-search', 'maintenance'],
    reachPages: ['Contact Us 3', 'Help & FAQs 2', 'Terms & Conditions 2', 'Refund & Cancellation Policy 2', 'Deposit Policy', 'Care, Cleaning & Damage Policy', 'Shipping & Delivery Policy', 'Pricing & Fees', 'Page not found', 'No search results', 'Maintenance'],
    notes: 'Printed beside the hours wherever a page says when we reply. Starts capitalized at the start of a sentence, lower case inline.',
    drives: [
      'Contact Us: whether the page says we are here now or back later'
    ],
    legacyValues: [
      { file: 'hok_404_page_v1', writtenAs: 'support_hours', fileSays: 'Monday to Friday, 10 AM to 8 PM', kind: 'Old value' },
      { file: 'hok_no_search_results_v1', writtenAs: 'support_hours', fileSays: 'Monday to Friday, 10 AM to 8 PM', kind: 'Old value' }
    ],
    format: 'text'
  },
  {
    key: 'support_hours',
    label: 'Hours we answer',
    value: '10 AM to 8 PM IST',
    displayValue: '10 AM to 8 PM IST',
    subject: 'reaching-us',
    owner: 'Site settings',
    status: 'live',
    reachCount: 17,
    usedOnSlugs: ['contact', 'faq', 'terms', 'refund-cancellation', 'care-cleaning-damage', 'deposit-policy', 'shipping-delivery', 'pricing-fees', '404', 'empty-search', 'maintenance'],
    reachPages: ['Contact Us 3', 'Help & FAQs 2', 'Terms & Conditions 2', 'Refund & Cancellation Policy 2', 'Care, Cleaning & Damage Policy 2', 'Deposit Policy', 'Shipping & Delivery Policy', 'Pricing & Fees', 'Page not found', 'No search results', 'Maintenance'],
    notes: 'Printed beside the days wherever a page says when we reply.',
    drives: [
      'Contact Us: whether the page says we are here now or back later'
    ],
    format: 'time'
  },
  {
    key: 'support_sla',
    label: 'WhatsApp reply within',
    value: '2 hours',
    displayValue: '2 hours',
    subject: 'reaching-us',
    owner: 'Site settings',
    status: 'live',
    reachCount: 11,
    usedOnSlugs: ['faq', 'refund-cancellation', 'contact', 'list-your-piece', 'terms', 'deposit-policy', 'care-cleaning-damage', 'shipping-delivery', 'pricing-fees'],
    reachPages: ['Help & FAQs 2', 'Refund & Cancellation Policy 2', 'Contact Us', 'List Your Piece', 'Terms & Conditions', 'Deposit Policy', 'Care, Cleaning & Damage Policy', 'Shipping & Delivery Policy', 'Pricing & Fees'],
    notes: 'How quickly we usually reply on WhatsApp during our hours.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'hours'
  },
  {
    key: 'email_sla',
    label: 'Email reply within',
    value: '24 hours',
    displayValue: '24 hours',
    subject: 'reaching-us',
    owner: 'Site settings',
    status: 'live',
    reachCount: 3,
    usedOnSlugs: ['contact'],
    reachPages: ['Contact Us 3'],
    notes: 'How quickly we reply to an email or a note sent from Contact Us.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'hours'
  },
  {
    key: 'visit_area',
    label: 'Where visits happen',
    value: 'Old Palasiya, Indore',
    displayValue: 'Old Palasiya, Indore',
    subject: 'reaching-us',
    owner: 'Site settings',
    status: 'waiting',
    decisionRequired: true,
    reachCount: 1,
    usedOnSlugs: ['contact'],
    reachPages: ['Contact Us'],
    notes: 'Visits are by appointment only, so the full address is shared when a visit is booked.',
    drives: [
      'Nothing outside the pages'
    ],
    legacyValues: [
      { file: 'hok_contact_v2', writtenAs: 'visit_area', fileSays: '[Indore address]', kind: 'Waiting for a decision' }
    ],
    format: 'text'
  },
  {
    key: 'business_days',
    label: 'What business days mean',
    value: 'Monday to Friday, 10 AM to 8 PM IST, excluding public holidays',
    displayValue: 'Monday to Friday, 10 AM to 8 PM IST, excluding public holidays',
    subject: 'reaching-us',
    owner: 'Set here',
    status: 'live',
    reachCount: 2,
    usedOnSlugs: ['deposit-policy', 'shipping-delivery'],
    reachPages: ['Deposit Policy', 'Shipping & Delivery Policy'],
    notes: 'The definition behind every time counted in business days. The team still tries to be available every day of the week.',
    drives: [
      'Nothing outside the pages'
    ],
    legacyValues: [
      { file: 'hok_shipping_policy_v3', writtenAs: 'business_days', fileSays: 'Monday to Friday, 10 AM to 8 PM, excluding public holidays', kind: 'Old value' }
    ],
    format: 'text'
  },
  {
    key: 'site_url',
    label: 'Website address',
    value: 'www.houseofkaira.com',
    displayValue: 'www.houseofkaira.com',
    subject: 'reaching-us',
    owner: 'Site settings',
    status: 'live',
    reachCount: 1,
    usedOnSlugs: ['terms'],
    reachPages: ['Terms & Conditions'],
    notes: 'The address as it is printed in sentences. The canonical domain itself is set under Google in Site Settings.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'url'
  },
  {
    key: 'instagram_handle',
    label: 'Instagram handle',
    value: '@house_of_kaira',
    displayValue: '@house_of_kaira',
    subject: 'reaching-us',
    owner: 'Site settings',
    status: 'waiting',
    decisionRequired: true,
    reachCount: 1,
    usedOnSlugs: ['faq'],
    reachPages: ['Help & FAQs'],
    notes: 'Printed where we invite customers to share their photographs.',
    drives: [
      'Nothing outside the pages'
    ],
    legacyValues: [
      { file: 'hok_404_page_v1', writtenAs: 'instagram_handle', fileSays: 'houseofkaira', kind: 'Waiting for a decision' },
      { file: 'hok_no_search_results_v1', writtenAs: 'instagram_handle', fileSays: 'houseofkaira', kind: 'Waiting for a decision' },
      { file: 'hok_faq_v6', writtenAs: 'instagram_handle', fileSays: '@houseofkaira', kind: 'Waiting for a decision' }
    ],
    format: 'text'
  },

  /* -------------------------------------------------------------
     9. Brand (Spec Appendix A, Page 75–76)
  ------------------------------------------------------------- */
  {
    key: 'site_name',
    label: 'Site name',
    value: 'House of Kaira',
    displayValue: 'House of Kaira',
    subject: 'brand',
    owner: 'Site settings',
    status: 'live',
    reachCount: 21,
    usedOnSlugs: ['faq', 'contact', 'list-your-piece', 'terms', 'privacy-policy', 'cookie-policy', 'refund-cancellation', 'deposit-policy', 'care-cleaning-damage', 'shipping-delivery', 'pricing-fees', 'seller-guidelines', 'designer-partners', 'size-guide', 'sustainability', 'careers', 'press', 'blog', '404', 'empty-search', 'maintenance'],
    reachPages: ['Help & FAQs', 'Contact Us', 'List Your Piece', 'Terms & Conditions', 'Privacy Policy', 'Cookie Policy', 'Refund & Cancellation Policy', 'Deposit Policy', 'Care, Cleaning & Damage Policy', 'Shipping & Delivery Policy', 'Pricing & Fees', 'Seller Guidelines', 'Designer Partners', 'Size & Measurement Guide', 'Sustainability', 'Careers', 'Press', 'Blog', 'Page not found', 'No search results', 'Maintenance'],
    notes: 'Printed in every page’s search title, after the separator.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'text'
  },
  {
    key: 'sep',
    label: 'Title separator',
    value: '·',
    displayValue: '·',
    subject: 'brand',
    owner: 'Site settings',
    status: 'live',
    reachCount: 23,
    usedOnSlugs: ['faq', 'contact', 'about', 'how-it-works', 'list-your-piece', 'terms', 'privacy-policy', 'cookie-policy', 'refund-cancellation', 'deposit-policy', 'care-cleaning-damage', 'shipping-delivery', 'pricing-fees', 'seller-guidelines', 'designer-partners', 'size-guide', 'sustainability', 'careers', 'press', 'blog', '404', 'empty-search', 'maintenance'],
    reachPages: ['Help & FAQs', 'Contact Us', 'About HOK', 'How It Works', 'List Your Piece', 'Terms & Conditions', 'Privacy Policy', 'Cookie Policy', 'Refund & Cancellation Policy', 'Deposit Policy', 'Care, Cleaning & Damage Policy', 'Shipping & Delivery Policy', 'Pricing & Fees', 'Seller Guidelines', 'Designer Partners', 'Size & Measurement Guide', 'Sustainability', 'Careers', 'Press', 'Blog', 'Page not found', 'No search results', 'Maintenance'],
    notes: 'Sits between the page’s name and the site name in a search title.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'text'
  },
  {
    key: 'tagline',
    label: 'Tagline',
    value: 'Circular Luxury Fashion',
    displayValue: 'Circular Luxury Fashion',
    subject: 'brand',
    owner: 'Site settings',
    status: 'live',
    reachCount: 1,
    usedOnSlugs: ['footer'],
    reachPages: ['Site Settings: Footer'],
    notes: 'Printed under the name in the footer.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'text'
  },
  {
    key: 'year',
    label: 'Current year',
    value: '2026',
    displayValue: '2026',
    subject: 'brand',
    owner: 'Counted',
    status: 'live',
    reachCount: 1,
    usedOnSlugs: ['footer'],
    reachPages: ['Site Settings: Footer'],
    notes: 'Printed in the copyright line. Worked out from today’s date, so it never needs changing.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'text'
  },

  /* -------------------------------------------------------------
     10. Legal details & complaints (Spec Appendix A, Page 76–78)
  ------------------------------------------------------------- */
  {
    key: 'legal_name',
    label: 'Legal owner (proprietor)',
    value: 'Ekta Agrawal',
    displayValue: 'Ekta Agrawal',
    subject: 'legal-complaints',
    owner: 'Set here',
    status: 'live',
    reachCount: 4,
    usedOnSlugs: ['terms', 'contact'],
    reachPages: ['Terms & Conditions 3', 'Contact Us'],
    notes: 'Named only where the law needs the legal person: the Terms, the Privacy Policy and Our details on Contact Us. Everywhere else the founder is Soumya Agrawal.',
    drives: [
      'Invoices: the legal name at the top of every invoice'
    ],
    format: 'text'
  },
  {
    key: 'trade_name',
    label: 'Business name',
    value: 'Sebshine Apparels',
    displayValue: 'Sebshine Apparels',
    subject: 'legal-complaints',
    owner: 'Set here',
    status: 'live',
    reachCount: 1,
    usedOnSlugs: ['contact'],
    reachPages: ['Contact Us'],
    notes: 'House of Kaira is a brand of this business.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'text'
  },
  {
    key: 'legal_form',
    label: 'Legal form',
    value: 'a sole proprietorship',
    displayValue: 'a sole proprietorship',
    subject: 'legal-complaints',
    owner: 'Set here',
    status: 'live',
    reachCount: 2,
    usedOnSlugs: ['contact', 'terms'],
    reachPages: ['Contact Us', 'Terms & Conditions'],
    notes: 'Printed in a sentence, so it starts in lower case.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'text'
  },
  {
    key: 'registered_address',
    label: 'Principal place of business',
    value: '24, Dadi Dham (Basement), Joy Builders Colony, Old Palasiya, Indore, Madhya Pradesh 452001',
    displayValue: '24, Dadi Dham (Basement), Joy Builders Colony, Old Palasiya, Indore, Madhya Pradesh 452001',
    subject: 'legal-complaints',
    owner: 'Set here',
    status: 'live',
    reachCount: 2,
    usedOnSlugs: ['terms'],
    reachPages: ['Terms & Conditions 2'],
    notes: 'The address the law requires us to publish. A sole proprietorship has no registered office, so the Terms’ “registered office” prints this address.',
    drives: [
      'Invoices: the address on every invoice'
    ],
    legacyValues: [
      { file: 'hok_terms_v4', writtenAs: 'registered_address', fileSays: '[Registered office address]', kind: 'Placeholder in the file' }
    ],
    format: 'text'
  },
  {
    key: 'gstin',
    label: 'GSTIN',
    value: 'Not added yet',
    displayValue: 'Not added yet',
    subject: 'legal-complaints',
    owner: 'Set here',
    status: 'waiting',
    decisionRequired: true,
    reachCount: 1,
    usedOnSlugs: ['terms'],
    reachPages: ['Terms & Conditions'],
    notes: 'Printed in Who we are on the Terms, and on every invoice.',
    drives: [
      'Invoices: the GSTIN on every invoice'
    ],
    legacyValues: [
      { file: 'hok_terms_v4', writtenAs: 'gstin', fileSays: '[GSTIN]', kind: 'Waiting for a decision' }
    ],
    format: 'text'
  },
  {
    key: 'cin',
    label: 'CIN',
    value: 'Not added yet',
    displayValue: 'Not added yet',
    subject: 'legal-complaints',
    owner: 'Set here',
    status: 'retired',
    reachCount: 1,
    usedOnSlugs: ['terms'],
    reachPages: ['Terms & Conditions'],
    notes: 'A sole proprietorship has no CIN.',
    drives: [
      'Nothing outside the pages'
    ],
    legacyValues: [
      { file: 'hok_terms_v4', writtenAs: 'cin', fileSays: '[CIN]', kind: 'Retired figure' }
    ],
    format: 'text'
  },
  {
    key: 'grievance_name',
    label: 'Grievance Officer',
    value: 'Soumya Agrawal',
    displayValue: 'Soumya Agrawal',
    subject: 'legal-complaints',
    owner: 'Set here',
    status: 'live',
    reachCount: 1,
    usedOnSlugs: ['terms'],
    reachPages: ['Terms & Conditions'],
    notes: 'The person who receives formal complaints. The law requires the name to be published.',
    drives: [
      'Nothing outside the pages'
    ],
    legacyValues: [
      { file: 'hok_terms_v4', writtenAs: 'grievance_name', fileSays: '[Name]', kind: 'Placeholder in the file' }
    ],
    format: 'text'
  },
  {
    key: 'grievance_title',
    label: 'Grievance Officer’s title',
    value: 'Founder',
    displayValue: 'Founder',
    subject: 'legal-complaints',
    owner: 'Set here',
    status: 'live',
    reachCount: 1,
    usedOnSlugs: ['terms'],
    reachPages: ['Terms & Conditions'],
    notes: 'Printed after the name.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'text'
  },
  {
    key: 'grievance_email',
    label: 'Grievance Officer’s email',
    value: 'soumya.agrawal0008@gmail.com',
    displayValue: 'soumya.agrawal0008@gmail.com',
    subject: 'legal-complaints',
    owner: 'Set here',
    status: 'live',
    reachCount: 1,
    usedOnSlugs: ['terms'],
    reachPages: ['Terms & Conditions'],
    notes: 'Where a formal complaint is sent.',
    drives: [
      'Nothing outside the pages'
    ],
    legacyValues: [
      { file: 'hok_terms_v4', writtenAs: 'grievance_email', fileSays: '[Email address]', kind: 'Placeholder in the file' }
    ],
    format: 'email'
  },
  {
    key: 'grievance_phone',
    label: 'Grievance Officer’s phone',
    value: '+91 93401 39300',
    displayValue: '+91 93401 39300',
    subject: 'legal-complaints',
    owner: 'Set here',
    status: 'waiting',
    decisionRequired: true,
    reachCount: 1,
    usedOnSlugs: ['terms'],
    reachPages: ['Terms & Conditions'],
    notes: 'Printed on the Terms and the Privacy Policy.',
    drives: [
      'Nothing outside the pages'
    ],
    legacyValues: [
      { file: 'hok_terms_v4', writtenAs: 'grievance_phone', fileSays: '[Phone number]', kind: 'Waiting for a decision' }
    ],
    format: 'phone'
  },
  {
    key: 'grievance_ack',
    label: 'Complaints acknowledged within',
    value: '24 hours',
    displayValue: '24 hours',
    subject: 'legal-complaints',
    owner: 'Set here',
    status: 'live',
    reachCount: 6,
    usedOnSlugs: ['terms', 'contact', 'refund-cancellation', 'deposit-policy', 'shipping-delivery'],
    reachPages: ['Terms & Conditions 2', 'Contact Us', 'Refund & Cancellation Policy', 'Deposit Policy', 'Shipping & Delivery Policy'],
    notes: 'Every formal complaint is acknowledged within this time.',
    drives: [
      'Notifications: the complaint acknowledgement alert'
    ],
    format: 'hours'
  },
  {
    key: 'grievance_resolve',
    label: 'Complaints resolved within',
    value: 'one month',
    displayValue: 'one month',
    subject: 'legal-complaints',
    owner: 'Set here',
    status: 'live',
    reachCount: 6,
    usedOnSlugs: ['terms', 'contact', 'refund-cancellation', 'deposit-policy', 'shipping-delivery'],
    reachPages: ['Terms & Conditions 2', 'Contact Us', 'Refund & Cancellation Policy', 'Deposit Policy', 'Shipping & Delivery Policy'],
    notes: 'Every formal complaint is resolved within this time.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'text'
  },
  {
    key: 'payment_partner',
    label: 'Payment partner',
    value: 'Razorpay',
    displayValue: 'Razorpay',
    subject: 'legal-complaints',
    owner: 'Set here',
    status: 'live',
    reachCount: 1,
    usedOnSlugs: ['terms'],
    reachPages: ['Terms & Conditions'],
    notes: 'Named where the Terms explain that we never see or store card or UPI details.',
    drives: [
      'Platform & Legal: the payment gateway'
    ],
    format: 'text'
  },

  /* -------------------------------------------------------------
     11. Tax (Spec Appendix A, Page 78)
  ------------------------------------------------------------- */
  {
    key: 'gst_rental',
    label: 'GST on a rental',
    value: '18%',
    displayValue: '18%',
    subject: 'tax',
    owner: 'Set here',
    status: 'live',
    locked: true,
    reachCount: 17,
    usedOnSlugs: ['pricing-fees', 'deposit-policy', 'faq', 'shipping-delivery', 'how-it-works', 'terms', 'refund-cancellation'],
    reachPages: ['Pricing & Fees 6', 'Deposit Policy 4', 'Help & FAQs 2', 'Shipping & Delivery Policy 2', 'How It Works', 'Terms & Conditions', 'Refund & Cancellation Policy'],
    notes: 'SAC 997326, added to the rental fee at checkout. The same rate applies to extra days and late days.',
    drives: [
      'Checkout: the GST line on every rental',
      'Deposit Policy: the worked example'
    ],
    format: 'percent'
  },
  {
    key: 'gst_preloved',
    label: 'GST on a preloved piece',
    value: '5%',
    displayValue: '5%',
    subject: 'tax',
    owner: 'Set here',
    status: 'live',
    locked: true,
    reachCount: 8,
    usedOnSlugs: ['pricing-fees', 'faq', 'how-it-works', 'terms', 'refund-cancellation'],
    reachPages: ['Pricing & Fees 4', 'Help & FAQs', 'How It Works', 'Terms & Conditions', 'Refund & Cancellation Policy'],
    notes: 'HSN 6309, added to the price at checkout.',
    drives: [
      'Checkout: the GST line on every preloved order'
    ],
    format: 'percent'
  },
  {
    key: 'gst_buy_new',
    label: 'GST on Buy New',
    value: '18%',
    displayValue: '18%',
    subject: 'tax',
    owner: 'Set here',
    status: 'live',
    locked: true,
    reachCount: 0,
    usedOnSlugs: [],
    reachPages: ['Not printed yet'],
    notes: 'HSN 6101, already included in a Buy New price.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'percent'
  },

  /* -------------------------------------------------------------
     12. Set by law (Spec Appendix A, Page 79)
  ------------------------------------------------------------- */
  {
    key: 'age_min',
    label: 'Minimum age',
    value: '18 years',
    displayValue: '18 years',
    subject: 'set-by-law',
    owner: 'By law',
    status: 'live',
    locked: true,
    reachCount: 3,
    usedOnSlugs: ['terms', 'seller-guidelines'],
    reachPages: ['Terms & Conditions 2', 'Seller Guidelines'],
    notes: 'The age a person must be to rent, buy or list.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'text'
  },
  {
    key: 'prior_price_days',
    label: 'Earlier price window',
    value: '30 days',
    displayValue: '30 days',
    subject: 'set-by-law',
    owner: 'By law',
    status: 'live',
    locked: true,
    reachCount: 1,
    usedOnSlugs: ['terms'],
    reachPages: ['Terms & Conditions'],
    notes: 'A reduced price shows the lowest price the piece was offered at in this window.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'days'
  },
  {
    key: 'gac_days',
    label: 'Appeal to the Grievance Appellate Committee within',
    value: '30 days',
    displayValue: '30 days',
    subject: 'set-by-law',
    owner: 'By law',
    status: 'live',
    locked: true,
    reachCount: 1,
    usedOnSlugs: ['terms'],
    reachPages: ['Terms & Conditions'],
    notes: 'Counted from the Grievance Officer’s decision.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'days'
  },
  {
    key: 'nch_phone',
    label: 'National Consumer Helpline',
    value: '1915',
    displayValue: '1915',
    subject: 'set-by-law',
    owner: 'By law',
    status: 'live',
    locked: true,
    reachCount: 2,
    usedOnSlugs: ['contact', 'terms'],
    reachPages: ['Contact Us', 'Terms & Conditions'],
    notes: 'The toll-free helpline.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'phone'
  },
  {
    key: 'nch_whatsapp',
    label: 'National Consumer Helpline WhatsApp',
    value: '+91 88000 01915',
    displayValue: '+91 88000 01915',
    subject: 'set-by-law',
    owner: 'By law',
    status: 'live',
    locked: true,
    reachCount: 2,
    usedOnSlugs: ['contact', 'terms'],
    reachPages: ['Contact Us', 'Terms & Conditions'],
    notes: 'The helpline’s WhatsApp number.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'phone'
  },
  {
    key: 'nch_web',
    label: 'National Consumer Helpline website',
    value: 'consumerhelpline.gov.in',
    displayValue: 'consumerhelpline.gov.in',
    subject: 'set-by-law',
    owner: 'By law',
    status: 'live',
    locked: true,
    reachCount: 2,
    usedOnSlugs: ['contact', 'terms'],
    reachPages: ['Contact Us', 'Terms & Conditions'],
    notes: 'The helpline’s website.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'url'
  },
  {
    key: 'ejagriti_web',
    label: 'Consumer commission website',
    value: 'e-jagriti.gov.in',
    displayValue: 'e-jagriti.gov.in',
    subject: 'set-by-law',
    owner: 'By law',
    status: 'live',
    locked: true,
    reachCount: 1,
    usedOnSlugs: ['terms'],
    reachPages: ['Terms & Conditions'],
    notes: 'Where a consumer complaint is filed online.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'url'
  },

  /* -------------------------------------------------------------
     13. Advice we give (Spec Appendix A, Page 79)
  ------------------------------------------------------------- */
  {
    key: 'lead_time',
    label: 'Book a rental at least',
    value: '7 to 10 days',
    displayValue: '7 to 10 days',
    subject: 'advice-we-give',
    owner: 'Set here',
    status: 'live',
    reachCount: 1,
    usedOnSlugs: ['faq'],
    reachPages: ['Help & FAQs'],
    notes: 'A recommendation, not a promise.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'text'
  },
  {
    key: 'peak_lead_time',
    label: 'In wedding season, book',
    value: '3 to 4 weeks',
    displayValue: '3 to 4 weeks',
    subject: 'advice-we-give',
    owner: 'Set here',
    status: 'live',
    reachCount: 2,
    usedOnSlugs: ['faq', 'shipping-delivery'],
    reachPages: ['Help & FAQs', 'Shipping & Delivery Policy'],
    notes: 'For the most loved pieces in the busiest months.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'text'
  },
  {
    key: 'peak_months',
    label: 'Wedding season',
    value: 'November to February, and April to June',
    displayValue: 'November to February, and April to June',
    subject: 'advice-we-give',
    owner: 'Set here',
    status: 'live',
    reachCount: 2,
    usedOnSlugs: ['faq', 'shipping-delivery'],
    reachPages: ['Help & FAQs', 'Shipping & Delivery Policy'],
    notes: 'The months demand is highest.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'text'
  },

  /* -------------------------------------------------------------
     14. Cookies & consent (Spec Appendix A, Page 80)
  ------------------------------------------------------------- */
  {
    key: 'consent_lifetime',
    label: 'A cookie choice is asked again after',
    value: '12 months',
    displayValue: '12 months',
    subject: 'cookies-consent',
    owner: 'Set here',
    status: 'live',
    reachCount: 0,
    usedOnSlugs: [],
    reachPages: ['Not printed yet'],
    notes: 'The cookie card asks again after this long, and sooner if the Cookie Policy changes or a new kind of cookie is added.',
    drives: [
      'The cookie card: when it greets a returning visitor again'
    ],
    format: 'text'
  },

  /* -------------------------------------------------------------
     15. Counted live (Spec Appendix A, Page 80)
  ------------------------------------------------------------- */
  {
    key: 'designer_count',
    label: 'Active designers',
    value: '11',
    displayValue: '11',
    subject: 'counted-live',
    owner: 'Counted',
    status: 'live',
    reachCount: 2,
    usedOnSlugs: ['how-it-works'],
    reachPages: ['How It Works 2'],
    notes: 'Designers marked Active in Designers.',
    drives: [
      'Counted from Designers'
    ],
    format: 'count'
  },
  {
    key: 'live_pieces',
    label: 'Live pieces',
    value: '5',
    displayValue: '5',
    subject: 'counted-live',
    owner: 'Counted',
    status: 'live',
    reachCount: 0,
    usedOnSlugs: [],
    reachPages: ['Not printed yet'],
    notes: 'Products with the status Live.',
    drives: [
      'Counted from Products'
    ],
    format: 'count'
  },
  {
    key: 'pickup_cities',
    label: 'Cities we collect from',
    value: '10',
    displayValue: '10',
    subject: 'counted-live',
    owner: 'Counted',
    status: 'live',
    reachCount: 1,
    usedOnSlugs: ['list-your-piece'],
    reachPages: ['List Your Piece'],
    notes: 'Serviceable cities, with spellings of the same city counted once.',
    drives: [
      'Counted from the serviceable cities list'
    ],
    format: 'count'
  },

  /* -------------------------------------------------------------
     16. Page dates (Spec Appendix A, Page 80–81)
  ------------------------------------------------------------- */
  {
    key: 'terms_version',
    label: 'Terms version',
    value: 'Per page',
    displayValue: 'v4',
    subject: 'page-dates',
    owner: 'Each page',
    status: 'live',
    reachCount: 1,
    usedOnSlugs: ['terms'],
    reachPages: ['Terms & Conditions'],
    notes: 'Stamped when the Terms are published with a change a customer can see.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'text'
  },
  {
    key: 'terms_effective',
    label: 'Terms in force from',
    value: 'Per page',
    displayValue: '20 October 2026',
    subject: 'page-dates',
    owner: 'Each page',
    status: 'live',
    reachCount: 0,
    usedOnSlugs: [],
    reachPages: ['Not printed yet'],
    notes: 'Set in the Terms’ Page settings, under Versions.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'date'
  },
  {
    key: 'terms_updated',
    label: 'Terms last updated',
    value: 'Per page',
    displayValue: '20 October 2026',
    subject: 'page-dates',
    owner: 'Each page',
    status: 'live',
    reachCount: 1,
    usedOnSlugs: ['terms'],
    reachPages: ['Terms & Conditions'],
    notes: 'Stamped when the Terms are published.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'date'
  },
  {
    key: 'page_updated',
    label: 'This page last updated',
    value: 'Per page',
    displayValue: '20 October 2026',
    subject: 'page-dates',
    owner: 'Each page',
    status: 'live',
    reachCount: 1,
    usedOnSlugs: ['seller-guidelines'],
    reachPages: ['Seller Guidelines'],
    notes: 'Each page prints its own date.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'date'
  },
  {
    key: 'page_reviewed',
    label: 'This page last reviewed',
    value: 'Per page',
    displayValue: '20 October 2026',
    subject: 'page-dates',
    owner: 'Each page',
    status: 'live',
    reachCount: 6,
    usedOnSlugs: ['faq', 'refund-cancellation', 'deposit-policy', 'care-cleaning-damage', 'shipping-delivery', 'pricing-fees'],
    reachPages: ['Help & FAQs', 'Refund & Cancellation Policy', 'Deposit Policy', 'Care, Cleaning & Damage Policy', 'Shipping & Delivery Policy', 'Pricing & Fees'],
    notes: 'Each page prints its own date. Set with Mark as reviewed.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'date'
  },

  /* -------------------------------------------------------------
     17. Never printed (Spec Appendix A, Page 81)
  ------------------------------------------------------------- */
  {
    key: 'deposit_reminders',
    label: 'Deposit reminders',
    value: '15, 12 and 10 days',
    displayValue: '15, 12 and 10 days',
    subject: 'never-printed',
    owner: 'Set here',
    status: 'never-printed',
    reachCount: 0,
    usedOnSlugs: [],
    reachPages: ['Never printed'],
    notes: 'WhatsApp or email reminders before the deposit is due. Customers are promised only the due date.',
    drives: [
      'Messaging: the deposit reminders'
    ],
    format: 'text'
  },
  {
    key: 'lister_share',
    label: 'Lister share',
    value: 'Agreed piece by piece',
    displayValue: 'Agreed piece by piece',
    subject: 'never-printed',
    owner: 'Set here',
    status: 'never-printed',
    reachCount: 9,
    usedOnSlugs: ['list-your-piece', 'how-it-works'],
    reachPages: ['List Your Piece 5', 'How It Works 4'],
    notes: 'Never printed. Each share is agreed with the lister for that piece, by its value and the effort of renting or selling it. Also lister_rental_share, lister_resale_share, hok_rental_share, hok_resale_share.',
    drives: [
      'LYP Submissions: the share set when a piece is approved',
      'Payouts to Listers'
    ],
    format: 'text'
  },
  {
    key: 'same_day_weddings',
    label: 'Same day delivery for wedding customers',
    value: 'Free, within Indore',
    displayValue: 'Free, within Indore',
    subject: 'never-printed',
    owner: 'Set here',
    status: 'never-printed',
    reachCount: 0,
    usedOnSlugs: [],
    reachPages: ['Never printed'],
    notes: 'A courtesy, kept off the site.',
    drives: [
      'Checkout: applied by the team on the order'
    ],
    format: 'text'
  },
  {
    key: 'outstation_exception',
    label: 'Outstation weddings and pieces taken abroad',
    value: 'Window and charge decided case by case',
    displayValue: 'Window and charge decided case by case',
    subject: 'never-printed',
    owner: 'Set here',
    status: 'never-printed',
    reachCount: 0,
    usedOnSlugs: [],
    reachPages: ['Never printed'],
    notes: 'The window can be extended when the customer messages before booking. A charge exception is never promised on the site.',
    drives: [
      'Nothing outside the pages'
    ],
    format: 'text'
  }
];

export const FIGURE_COUNTS_BY_STATUS = {
  total: 90,
  live: 76,
  waiting: 6,
  retired: 4,
  neverPrinted: 4,
  changing: 0
};

export const FIGURE_COUNTS_BY_OWNER = {
  setHere: 60,
  siteSettings: 13,
  byLaw: 8,
  counted: 4,
  eachPage: 5
};
