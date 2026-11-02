/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Settings & Tokens: Pricing & Fees Policy (Spec § 8.16)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

export const PRICING_TOKENS = {
  support_whatsapp: '+91 93401 39300',
  support_whatsapp_raw: '919340139300',
  support_email: 'hello@houseofkaira.com',
  support_sla: '2 hours',
  support_days: 'Seven days a week',
  support_hours: '10 AM to 8 PM IST',
  free_delivery_min: '₹5,000',
  window_standard: '3 days',
  gst_rental: '18%',
  gst_preloved: '5%',
  deposit_refund_window: '3 to 5 business days',
  deposit_due_before: '10 days',
  deposit_late_booking: '48 hours',
  deposit_receipt_within: '48 hours',
  deduction_notice_within: '2 days',
  deduction_reply_within: '2 days',
  balance_due: '7 days',
  not_returned_after: '5 days',
  issue_window: '24 hours',
  latent_window: '30 days',
  rental_cancel_full: '7 days',
  rental_cancel_late_refund: '70%',
  refund_timeline: '7 to 14 days',
  payout_cycle: '3 working days',
  free_return_after: '90 days',
  offer_reply: '24 hours'
};

export const PRICING_SETTINGS = PRICING_TOKENS;

export const PRICING_PAGE_CONFIG = {
  key: 'pricing',
  route: '/pricing',
  title: 'Pricing & Fees · House of Kaira',
  summary:
    'Every charge for renting and buying, and how a lister earns, side by side. No lister share is printed: shares are agreed piece by piece.',
  lastReviewed: '11 October 2026',
  version: 'Version 4',
  builtFrom: 'hok_pricing_fees_v4'
};

export interface PricingFigureOccurrence {
  key: string;
  label: string;
  value: string;
  count: number;
}

export const PRICING_FIGURES: PricingFigureOccurrence[] = [
  { key: 'rental_window_days', label: 'Standard rental window', value: '3 days', count: 6 },
  { key: 'gst_rental', label: 'GST on a rental', value: '18%', count: 6 },
  { key: 'free_delivery_min', label: 'Free delivery from', value: '₹5,000', count: 5 },
  { key: 'gst_preloved', label: 'GST on a preloved piece', value: '5%', count: 4 },
  { key: 'lister_payout_days', label: 'Lister payout within', value: '3 working days', count: 3 },
  { key: 'deposit_refund_window', label: 'Deposit returned within', value: '3 to 5 business days', count: 3 }
];

export const PRICING_CHECKS = [
  {
    id: 'chk_pricing_designer',
    type: 'high' as const,
    title: 'Links to a page that is not built: Designer Partners',
    location: 'Answers · I am a designer or a boutique'
  }
];
