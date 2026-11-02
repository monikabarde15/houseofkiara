/* =========================================================
   HOUSE OF KAIRA · ADMIN PANEL · THE PAGES SECTION
   Data: Maintenance Page Data (Spec §8.20, Screen 61)
   Admin panel v217 · 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

export interface MaintenanceScenario {
  id: 'planned' | 'late' | 'unexpected';
  label: string;
  eyebrow: string;
  headingPrefix: string;
  headingGoldItalic: string;
  lead: string;
  statusText: string;
  dotColor: 'sage' | 'gold';
}

export const MAINTENANCE_SCENARIOS: MaintenanceScenario[] = [
  {
    id: 'planned',
    label: 'Planned, with a time',
    eyebrow: 'A SHORT PAUSE',
    headingPrefix: "We'll be back ",
    headingGoldItalic: 'very shortly',
    lead: "We're making a few refinements to House of Kaira. Everything will be exactly where you left it, from your wishlist to your bookings.",
    statusText: 'Expected back by 6:00 PM IST today',
    dotColor: 'sage'
  },
  {
    id: 'late',
    label: 'Running late',
    eyebrow: 'A SHORT PAUSE',
    headingPrefix: "We'll be back ",
    headingGoldItalic: 'very shortly',
    lead: "We're making a few refinements to House of Kaira. Everything will be exactly where you left it, from your wishlist to your bookings.",
    statusText: 'Taking a little longer than planned. Thank you for waiting with us.',
    dotColor: 'sage'
  },
  {
    id: 'unexpected',
    label: 'Unexpected',
    eyebrow: 'A SHORT PAUSE',
    headingPrefix: "We'll be back ",
    headingGoldItalic: 'very shortly',
    lead: 'House of Kaira is taking a short pause while we put something right. Everything will be exactly where you left it.',
    statusText: "We're on it, and will be back as soon as we can.",
    dotColor: 'gold'
  }
];

export const MAINTENANCE_FIGURES = [
  { key: 'support_days', label: 'Days we answer', value: 'Seven days a week', count: '1÷' },
  { key: 'support_hours', label: 'Hours we answer', value: '10 AM to 8 PM IST', count: '1÷' },
  { key: 'title_separator', label: 'Title separator', value: '·', count: '1÷' },
  { key: 'site_name', label: 'Site name', value: 'House of Kaira', count: '1÷' }
];

export const MAINTENANCE_CHECKS = [
  {
    id: 'maint_chk_year',
    type: 'medium',
    title: 'A year typed by hand in a copyright line',
    location: 'Words · Footnote'
  }
];
