// Constants
/* ========================================
   Promotions Module - Constants
   Based on HOK_Promotions_Logic_Spec_v150.pdf
   ======================================== */

import { PromoMode, ShopperMessages } from '../types/promotions.types';

// --- Default Values ---

export const DEFAULT_MODES: PromoMode[] = ['Rental', 'Preloved'];
export const DEFAULT_FREE_SHIP_THRESHOLD = 2999;
export const DEFAULT_MAX_COMBINED_PCT = 25;

// --- Mode Shares (Section 2.2) ---

export const MODE_SHARES: Record<PromoMode, { lister: number; hok: number }> = {
  'Rental': { lister: 40, hok: 60 },
  'Preloved': { lister: 75, hok: 25 },
  'Buy New': { lister: 0, hok: 0 }, // Margin depends on buying terms
};

// --- GST Rates (Section 2.3) ---

export const GST_RATES: Record<PromoMode, { rate: number; code: string; behaviour: string }> = {
  'Rental': { rate: 18, code: 'SAC 997326', behaviour: 'Added on top of discounted line value' },
  'Preloved': { rate: 5, code: 'HSN 6309', behaviour: 'Added on top of discounted line value' },
  'Buy New': { rate: 18, code: 'HSN 6101', behaviour: 'Embedded in displayed price, not added' },
};

// --- Code Pattern (Section 3.1) ---

export const CODE_PATTERN = /^[A-Z0-9][A-Z0-9\-]{1,18}[A-Z0-9]$/;
export const CODE_MIN_LENGTH = 3;
export const CODE_MAX_LENGTH = 20;

// --- Default Shopper Messages (Section 10.2) ---

export const DEFAULT_SHOPPER_MESSAGES: ShopperMessages = {
  exists: "This code isn't one of ours — check the spelling?",
  notlive: 'This code goes live on {date}.',
  expired: 'This code expired on {date}.',
  paused: 'This code is taking a pause right now.',
  capitol: 'This code has been fully redeemed.',
  privatemis: 'This code is linked to a different account.',
  firstorder: "This one's for first orders — but we love that you're back.",
  mode: 'This code applies to {modes} orders.',
  scope: 'This code applies to {scope} — nothing in your bag qualifies just yet.',
  offerline: 'Your negotiated price on {piece} is already better than this code — {code} applies to the rest of your bag.',
  minimum: 'Add {x} more in qualifying pieces to use this code — the deposit doesn\'t count toward it.',
  percust: "You've already used this code the maximum number of times.",
  apolicyone: 'One code per order — remove {other} to use this one instead.',
  nolinks: '{code} doesn\'t combine with other codes.',
  cpartial: '{code} doesn\'t combine with {unlinked code} — remove it to use {code}.',
};

// --- Message Keys ---

export const MESSAGE_KEYS = [
  'exists',
  'notlive',
  'expired',
  'paused',
  'capitol',
  'privatemis',
  'firstorder',
  'mode',
  'scope',
  'offferline',
  'minimum',
  'percust',
  'apolicyone',
  'nolinks',
  'cpartial',
] as const;

// --- Discount Type Options ---

export const DISCOUNT_TYPE_OPTIONS = [
  { value: 'percent', label: '% Off' },
  { value: 'flat', label: 'Fixed Amount Off (₹)' },
  { value: 'freedel', label: 'Free Delivery' },
] as const;

// --- Mode Options ---

export const MODE_OPTIONS: PromoMode[] = ['Rental', 'Preloved', 'Buy New'];

// --- Audience Options ---

export const AUDIENCE_OPTIONS = [
  { value: 'public', label: 'Public — anyone can use it' },
  { value: 'private', label: 'Private — specific customers only' },
] as const;

// --- Visibility Switch Labels (Section 8.1) ---

export const VISIBILITY_LABELS = {
  off: 'Share only — nowhere on the site',
  on: 'Listed in the cart\'s offers drawer',
  private: 'Share only — private codes are never listed',
};

// --- Stacking Switch Labels (Section 8.1) ---

export const STACKING_LABELS = {
  off: 'Exclusive — never combines',
  on: 'Combines — with the codes picked below',
};

// --- First Order Switch Labels (Section 8.1) ---

export const FIRST_ORDER_LABELS = {
  off: 'Any order — no first-order restriction',
  on: 'First order only — a returning customer can\'t use it',
};

// --- Snapshot Card Labels (Section 5.2) ---

export const SNAPSHOT_CARDS = [
  { id: 'live', label: 'LIVE CODES', tooltip: 'Show only the codes a shopper can use right now' },
  { id: 'redemptions', label: 'REDEMPTIONS', tooltip: 'Show only the codes that have actually been used, most-used first' },
  { id: 'orderValue', label: 'ORDER VALUE THROUGH CODES', tooltip: 'Show the codes that brought orders in, biggest earner first' },
  { id: 'discountFunded', label: 'DISCOUNT FUNDED BY HOK', tooltip: 'Show the codes that cost you money, most expensive first' },
] as const;

// --- Status Badge Colors ---

export const STATUS_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  Active: { bg: '#EAF0E5', text: '#3D6B30' },
  Scheduled: { bg: '#F0EDE8', text: '#8A7E72' },
  Expired: { bg: '#F0EDE8', text: '#8A7E72' },
  'Fully redeemed': { bg: '#F0EDE8', text: '#8A7E72' },
  Paused: { bg: '#F0EDE8', text: '#8A7E72' },
};