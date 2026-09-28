/**
 * House of Kaira - Terms & Conditions Site Settings & Token Registry
 * Section 8.4 of Build Specification v3.0
 */

export const TERMS_SETTINGS = {
  // Support & Contact
  support_whatsapp: '+91 93401 39300',
  support_whatsapp_raw: '919340139300',
  support_email: 'hello@houseofkaira.com',
  support_sla: '2 hours',
  support_days: 'Seven days a week',
  support_hours: '10 AM to 8 PM IST',
  
  // Pricing & Commercial
  free_delivery_min: '₹2,999',
  gst_rental: '18%',
  gst_preloved: '5%',
  
  // Rental & Inspection Windows
  deposit_refund_window: '3 to 5 business days',
  arrive_before: '2 days',
  window_standard: '4 days',
  window_extended: '7 days',
  deposit_contact: '24 hours',
  inspect_within: '24 hours',
  issue_window: '24 hours',
  offer_response: '24 hours',
  preloved_dispatch: '2 business days',
  
  // Cancellations & Refunds
  rental_cancel_full: '7 days',
  refund_timeline: '7 to 14 days',
  
  // Grievance Redressal
  grievance_ack: '24 hours',
  grievance_resolve: 'one month',
  
  // Company & Legal Details (Placeholders per Section 12)
  legal_name: '[Registered legal name]',
  legal_form: '[its constitution, for example a private limited company incorporated under the Companies Act, 2013]',
  registered_address: '[Registered office address], Indore, Madhya Pradesh',
  cin: '[CIN]',
  gstin: '[GSTIN]',
  site_url: 'www.houseofkaira.com',
  
  // Grievance Officer Contact Details
  grievance_name: '[Name]',
  grievance_title: '[Designation]',
  grievance_email: '[Email address]',
  grievance_phone: '[Phone number]',
  
  // Payments & Lister Operations
  payment_partner: 'Razorpay',
  payout_cycle: '3 working days',
  submission_reply: '48 hours',
  latent_window: '30 days',
  not_returned_after: '5 days',
  balance_due: '7 days',
  
  // Versioning & Dates
  terms_version: 'Version 1.0',
  terms_effective: '7 October 2026',
  terms_updated: '26 September 2026',
  
  // Statutory / Statutory Rules Values
  age_min: '18 years',
  prior_price_days: '30 days',
  gac_days: '30 days',
  nch_phone: '1915',
  nch_whatsapp: '+91 88000 01915',
  nch_web: 'consumerhelpline.gov.in',
  ejagriti_web: 'e-jagriti.gov.in',
};

/**
 * Replace token placeholders in text with Site Settings values.
 * @param {string} text - Text containing {token_name} or direct placeholders.
 * @returns {string} - Interpolated text.
 */
export function interpolateSettings(text) {
  if (!text) return '';
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return TERMS_SETTINGS[key] !== undefined ? TERMS_SETTINGS[key] : match;
  });
}

export default TERMS_SETTINGS;
