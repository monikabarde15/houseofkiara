// src/components/Notifications/utils/formatting.ts

/**
 * §5.4 — Indian numbering system, leading rupee sign, no decimals.
 * ₹1,93,000 — not ₹140,000, not ₹140000.00.
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * §5.3 / §17.6 — the date format used for "since {name} last looked, {date}"
 * and the folded/put-down date stamps: "23 Mar 2026".
 */
export function formatDisplayDate(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/**
 * §5.3 / §17.7 — the machine-readable put-down date format: "2026-03-30".
 */
export function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Generic singular/plural count phrase, e.g. pluralize(1, 'thing') => "1 thing",
 * pluralize(12, 'thing') => "12 things". Covers the several places the spec
 * gives an explicit singular exception: "1 thing to do today", "1 new item",
 * "1 more check is clear or put down".
 */
export function pluralize(
  n: number,
  singular: string,
  plural?: string,
): string {
  const word = n === 1 ? singular : (plural ?? `${singular}s`);
  return `${n} ${word}`;
}

/**
 * §5.3 — the summary card headline, exact two forms.
 */
export function formatThingsHeadline(n: number): string {
  if (n === 0) return "Nothing needs doing today";
  return `${pluralize(n, "thing", "things")} to do today`;
}

/**
 * §1.4 — the bell's native tooltip, exact two forms.
 */
export function formatBellTooltip(n: number): string {
  if (n === 0) return "Nothing needs doing today";
  return `${pluralize(n, "thing", "things")} to do today`;
}
