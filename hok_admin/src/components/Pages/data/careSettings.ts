/**
 * House of Kaira · Admin Panel
 * Care, Cleaning & Damage Policy Site Settings
 * Spec § 8.14
 */

export const CARE_SETTINGS = {
  support_whatsapp: '+91 93401 39300',
  support_whatsapp_raw: '919340139300',
  support_email: 'hello@houseofkaira.com',
  support_sla: '2 hours',
  support_days: 'Seven days a week',
  support_hours: '10 AM to 8 PM IST',
  arrive_before: '1 day',
  issue_window: '24 hours',
  inspect_within: '24 hours',
  deposit_refund_window: '3 to 5 business days',
  balance_due: '7 days',
  deduction_notice_within: '2 business days',
  deduction_reply_within: '2 business days',
  last_reviewed: '7 October 2026'
};

export const CARE_FIGURES = [
  { key: 'issue_window', label: 'Tell us about a problem within', value: '24 hours', count: '8×' },
  { key: 'deduction_reply_within', label: 'Time to reply to a deduction', value: '2 business days', count: '3×' },
  { key: 'deduction_notice_within', label: 'Deduction explained within', value: '2 business days', count: '3×' },
  { key: 'support_hours', label: 'Hours we answer', value: '10 AM to 8 PM IST', count: '2×' },
  { key: 'arrive_before', label: 'A rental arrives', value: '1 day', count: '1×' },
  { key: 'inspect_within', label: 'Returned piece inspected within', value: '24 hours', count: '1×' }
];

export default CARE_SETTINGS;
