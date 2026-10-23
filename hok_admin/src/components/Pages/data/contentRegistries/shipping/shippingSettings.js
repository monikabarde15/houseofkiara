/**
 * House of Kaira: Shipping & Delivery Policy Settings & Tokens
 * Section 10 of Build Specification v2 (hok_shipping_policy_v3)
 */

export const SHIPPING_TOKENS = {
  support_whatsapp: "+91 93401 39300",
  support_whatsapp_raw: "919340139300",
  support_email: "hello@houseofkaira.com",
  support_sla: "2 hours",
  support_days: "Seven days a week",
  support_hours: "10 AM to 8 PM IST",
  free_delivery_min: "₹5,000",
  window_standard: "3 days",
  peak_months: "November to February, and April to June",
  peak_lead_time: "3 to 4 weeks",
  preloved_dispatch: "2 business days",
  standard_delivery: "3 to 5 business days",
  express_delivery: "1 to 2 business days",
  issue_window: "24 hours",
  not_returned_after: "5 days",
  deposit_refund_window: "3 to 5 business days",
  gst_rental: "18%",
  business_days: "Monday to Friday, 10 AM to 8 PM, excluding public holidays",
  grievance_ack: "24 hours",
  grievance_resolve: "one month",
  owner_dispatch: "10 business days",
  intl_delivery: "10 business days"
};

export const SHIPPING_SETTINGS = SHIPPING_TOKENS;

export const SHIPPING_PAGE_CONFIG = {
  key: "shipping-policy",
  route: "/shipping-policy",
  title: "Shipping & Delivery Policy · House of Kaira",
  meta_description:
    "How delivery works at House of Kaira: your rental window, delivery charges and free delivery, preloved dispatch times, returns, international delivery, and what happens if something goes wrong.",
  lastReviewed: "10 October 2026",
  version: "v3"
};
