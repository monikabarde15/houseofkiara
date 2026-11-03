/**
 * House of Kaira - Deposit Policy Site Settings
 * Section 4 of Build Specification v2.0 (hok_deposit_policy_v2)
 *
 * Every figure on the page is a Site Setting. Changing a setting changes the page with no other edit.
 */

export const DEPOSIT_SETTINGS = {
  // Existing Platform & Contact Settings
  support_whatsapp: "+91 93401 39300",
  support_whatsapp_raw: "919340139300",
  support_email: "hello@houseofkaira.com",
  support_sla: "2 hours",
  support_days: "Seven days a week",
  support_hours: "10 AM to 8 PM IST",
  gst_rental: "18%",
  gst_rate_decimal: 0.18,

  // Existing Policy Windows
  deposit_refund_window: "3 to 5 business days",
  inspect_within: "24 hours",
  issue_window: "24 hours",
  rental_cancel_full: "7 days",
  not_returned_after: "5 days",
  balance_due: "7 days",
  grievance_ack: "24 hours",
  grievance_resolve: "one month",

  // New Deposit Policy Settings
  deposit_due_before: "10 days",
  deposit_due_before_days: 10,
  deposit_late_booking: "48 hours",
  deposit_receipt_within: "48 hours",
  deduction_notice_within: "2 business days",
  deduction_reply_within: "2 business days",
  deposit_account_name: "Ekta Agrawal",
  deposit_business_name: "Sebshine Apparels",
  business_days: "Monday to Friday, 10 AM to 8 PM IST, excluding public holidays",
  cash_deposit_limit: "₹20,000",
  cash_deposit_limit_num: 20000,

  // Worked out example dates (Section 4)
  ex_dispatch: "Wednesday 16 December",
  ex_due: "Sunday 6 December",

  // Last reviewed date
  last_reviewed_date: "6 October 2026"
};

export default DEPOSIT_SETTINGS;
