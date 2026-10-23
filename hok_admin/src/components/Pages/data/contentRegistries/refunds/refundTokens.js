/**
 * Dynamic Admin Tokens & Figures for Refund & Cancellation Policy Page
 * Spec v1.2 · Section 13.3
 */

export const REFUND_TOKENS = {
  support_whatsapp: {
    value: "+91 98765 43210",
    owner: "Site Settings",
    status: "Confirmed",
  },
  support_whatsapp_raw: {
    value: "919876543210",
    owner: "Site Settings",
    status: "Confirmed",
  },
  support_email: {
    value: "hello@houseofkaira.com",
    owner: "Site Settings",
    status: "Confirmed",
  },
  support_sla: {
    value: "2 hours",
    owner: "Site Settings",
    status: "Confirmed",
  },
  support_days: {
    value: "Seven days a week",
    owner: "Site Settings",
    status: "Confirmed",
  },
  support_hours: {
    value: "10 AM to 8 PM IST",
    owner: "Site Settings",
    status: "Confirmed",
  },
  free_delivery_min: {
    value: "₹2,999",
    owner: "Site Settings",
    status: "Confirmed",
  },
  gst_rental: {
    value: "18%",
    owner: "Platform & Legal",
    status: "Confirmed",
  },
  gst_preloved: {
    value: "5%",
    owner: "Platform & Legal",
    status: "Confirmed",
  },
  deposit_refund_window: {
    value: "3 to 5 business days",
    owner: "Platform & Legal",
    status: "Confirmed",
  },
  arrive_before: {
    value: "2 days",
    owner: "Platform & Legal",
    status: "Confirmed",
  },
  window_standard: {
    value: "4 days",
    owner: "Product (per listing default)",
    status: "Confirmed",
  },
  window_extended: {
    value: "7 days",
    owner: "Product (per listing default)",
    status: "Confirmed",
  },
  deposit_contact: {
    value: "24 hours",
    owner: "Platform & Legal",
    status: "Confirmed",
  },
  pickup_within: {
    value: "24 hours",
    owner: "Platform & Legal",
    status: "Confirmed",
  },
  inspect_within: {
    value: "24 hours",
    owner: "Platform & Legal",
    status: "Confirmed",
  },
  issue_window: {
    value: "24 hours",
    owner: "Platform & Legal",
    status: "Confirmed",
  },
  preloved_dispatch: {
    value: "2 business days",
    owner: "Platform & Legal",
    status: "Confirmed",
  },
  express_delivery: {
    value: "1 to 2 business days",
    owner: "Platform & Legal",
    status: "Confirmed",
  },
  rental_cancel_full: {
    value: "7 days",
    owner: "Platform & Legal",
    status: "Confirmed",
  },
  refund_timeline: {
    value: "5 to 7 business days",
    owner: "Platform & Legal",
    status: "Awaiting decision",
  },
  claim_decision: {
    value: "2 business days",
    owner: "Platform & Legal",
    status: "Awaiting decision",
  },
  grievance_ack: {
    value: "48 hours",
    owner: "Platform & Legal",
    status: "Awaiting decision",
  },
  grievance_resolve: {
    value: "one month",
    owner: "Platform & Legal",
    status: "Awaiting decision",
  },
};

/**
 * Returns plain string token replacement
 */
export const resolveTokenValue = (tokenKey) => {
  return REFUND_TOKENS[tokenKey]?.value || `{{${tokenKey}}}`;
};

/**
 * Replaces all {{token_name}} tokens inside a text string
 */
export const replaceTokensInText = (text) => {
  if (!text || typeof text !== "string") return text;
  return text.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (match, tokenKey) => {
    return resolveTokenValue(tokenKey);
  });
};

export const REFUND_PAGE_METADATA = {
  lastReviewedDate: "23 September 2026",
};
