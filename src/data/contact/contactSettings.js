/**
 * House of Kaira: Contact Us Site Tokens & Settings
 * Section 03 & Section 04 of Build Specification v2
 */

export const CONTACT_TOKENS = {
  // Existing tokens
  support_whatsapp: "+91 93401 39300",
  support_whatsapp_raw: "919340139300",
  support_email: "hello@houseofkaira.com",
  support_sla: "2 hours",
  support_days: "Seven days a week",
  support_hours: "10 AM to 8 PM IST",
  site_url: "www.houseofkaira.com",
  issue_window: "24 hours",
  grievance_name: "Soumya Agrawal",
  grievance_title: "Founder",
  grievance_email: "soumya.agrawal0008@gmail.com",
  grievance_phone: "+91 93401 39300",
  grievance_ack: "24 hours",
  grievance_resolve: "one month",
  legal_name: "Ekta Agrawal",
  legal_form: "a sole proprietorship",
  trade_name: "Sebshine Apparels",
  business_address: "24, Dadi Dham (Basement), Joy Builders Colony, Old Palasiya, Indore, Madhya Pradesh 452001",
  nch_phone: "1915",
  nch_whatsapp: "+91 88000 01915",
  nch_whatsapp_raw: "918800001915",
  nch_web: "consumerhelpline.gov.in",
  
  // New tokens for Contact Us
  email_sla: "24 hours",
  support_phone: "+91 93401 39300",
  support_phone_raw: "+919340139300",
  visit_area: "Old Palasiya, Indore"
};

/**
 * Support Hours Rule (Section 4.2)
 * Calculated strictly in Asia/Kolkata (India Standard Time).
 */
export const SUPPORT_HOURS_RULE = {
  days: [0, 1, 2, 3, 4, 5, 6], // 0 is Sunday, 6 is Saturday: seven days a week
  opens: "10:00",
  closes: "20:00", // open up to, not including, 20:00 (8:00 PM)
  timeZone: "Asia/Kolkata"
};

/**
 * Contact Us Page Configuration & Meta (Section 01)
 */
export const CONTACT_PAGE_CONFIG = {
  page: "Contact Us",
  title: "Contact Us · House of Kaira",
  meta_description:
    "Reach House of Kaira on WhatsApp, by email or by phone, visit us in Indore by appointment, and find our Grievance Officer and business details.",
  breadcrumb: "Home / Contact Us",
  adminSwitches: {
    showCallRow: true,
    showVisitCard: true
  }
};
