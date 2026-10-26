// src/data/pricing/pricingSettings.js
// Central tokens and configuration for Pricing & Fees specification

export const PRICING_TOKENS = {
  // Support and Concierge contact
  support_whatsapp: "+91 93401 39300",
  support_whatsapp_raw: "919340139300",
  support_email: "hello@houseofkaira.com",
  support_sla: "2 hours",
  support_days: "Seven days a week",
  support_hours: "10 AM to 8 PM IST",

  // Delivery thresholds and standard windows
  free_delivery_min: "₹5,000",
  window_standard: "3 days",

  // Applicable Goods and Services Tax rates
  gst_rental: "18%",
  gst_preloved: "5%",

  // Security deposit parameters
  deposit_refund_window: "3 to 5 business days",
  deposit_due_before: "10 days",
  deposit_late_booking: "48 hours",
  deposit_receipt_within: "48 hours",

  // Deductions, balances and returns
  deduction_notice_within: "2 days",
  deduction_reply_within: "2 days",
  balance_due: "7 days",
  not_returned_after: "5 days",

  // Inspection, disputes and latent issues
  issue_window: "24 hours",
  latent_window: "30 days",

  // Order cancellation and refunds
  rental_cancel_full: "7 days",
  rental_cancel_late_refund: "70%",
  refund_timeline: "7 to 14 days",

  // Lister payouts and wardrobe logistics
  payout_cycle: "3 working days",
  free_return_after: "90 days",
  offer_reply: "24 hours",
};

export const PRICING_SETTINGS = PRICING_TOKENS;

export const PRICING_PAGE_CONFIG = {
  pageTitle: "Pricing & Fees | House of Kaira",
  pageDescription: "Every number, every percentage, plain and simple. What you pay to rent or buy, and what you earn when you list your wardrobe.",
  canonicalUrl: "https://houseofkaira.com/pricing-fees",
  lastUpdated: "April 2025",
};
