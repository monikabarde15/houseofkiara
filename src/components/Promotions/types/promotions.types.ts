// Promotions Types
/* ========================================
   Promotions Module - Type Definitions
   Based on HOK_Promotions_Logic_Spec_v150.pdf Section 3
   ======================================== */

// --- Core Types (Section 3.1) ---

export type PromoCodeType = 'percent' | 'flat' | 'freedel';
export type PromoCodeStatus = 'Active' | 'Paused';
export type PromoCodeVisibility = 'share' | 'drawer';
export type PromoAudience = 'public' | 'private';
export type PromoMode = 'Rental' | 'Preloved' | 'Buy New';
export type PromoRedemptionSource = 'entered' | 'drawer';

export interface PromoCodeScope {
  categories: string[];
  designerIds: string[];
  skus: string[];
}

export interface PromoCode {
  // Core fields
  code: string; // Primary key, uppercase, 3-20 chars
  type: PromoCodeType;
  value: number; // Percentage (1-100) or rupee amount
  maxDiscount: number | null; // Ceiling in rupees, only for percent
  
  // Eligibility
  minOrder: number | null;
  modes: PromoMode[]; // At least one
  scope: PromoCodeScope; // All empty = all products
  stacksWith: string[]; // Array of code strings
  
  // Audience
  audience: PromoAudience;
  customerIds: string[]; // Required when private, empty when public
  firstOrderOnly: boolean;
  
  // Usage caps
  usesTotalCap: number | null; // Max redemptions across all customers
  usesPerCustomer: number | null; // Max redemptions by one customer
  
  // Validity
  validFrom: string | null; // ISO YYYY-MM-DD
  validUntil: string | null; // ISO YYYY-MM-DD
  
  // Status & Visibility
  status: PromoCodeStatus;
  visibility: PromoCodeVisibility;
  
  // Meta fields (Section 3.2)
  publicDesc: string; // Shopper-facing, max 60 chars
  reason: string; // Internal only, required
  notes: string;
  createdBy: string;
  createdOn: string; // Display date "23 Mar 2026"
  history: PromoHistoryEntry[];
  attnSnooze: Record<string, string>; // flagKey: YYYY-MM-DD
  
  // Supersede (Section 3.2)
  supersedes?: string; // Code it was copied from
  supersededBy?: string; // Copy that replaced it
}

export interface PromoHistoryEntry {
  e: string; // What changed
  t: string; // "date - who"
}

// --- Order Fields Added by Promotions (Section 3.2) ---

export interface PromoOrderFields {
  promoCode?: string; // Code carried by this order
  discountAmt: number; // Rupees discounted
  redemptionSource: PromoRedemptionSource; // 'entered' or 'drawer'
  refund?: PromoRefund; // Present when part of order is returned
}

export interface PromoRefund {
  date: string;
  kind: string;
  reason: string;
  lineldx: number[]; // Indices into order items array
}

// --- Platform Settings (Section 3.3) ---

export interface CheckoutRules {
  stacking: 'single' | 'stackable';
  maxCombinedFlat: number | null; // Rupee ceiling
  maxCombinedPct: number | null; // Percentage ceiling (25 default)
  freeShipThreshold: number | null; // 2999 default
  freeShipBasis: 'pre' | 'post'; // 'pre' default
}

// --- Shopper Messages (Section 10.2) ---

export interface ShopperMessages {
  exists: string;
  notlive: string;
  expired: string;
  paused: string;
  capitol: string;
  privatemis: string;
  firstorder: string;
  mode: string;
  scope: string;
  offerline: string;
  minimum: string;
  percust: string;
  apolicyone: string;
  nolinks: string;
  cpartial: string;
}

// --- Derived Types ---

export type DerivedPromoState = 
  | 'Paused'
  | 'Scheduled'
  | 'Expired'
  | 'Fully redeemed'
  | 'Active';

export interface PromoSnapshot {
  liveCodes: number;
  redemptions: number;
  orderValueThroughCodes: number;
  discountFundedByHOK: number;
}

// --- Refused Attempts (Section 22) ---

export interface RefusedAttempt {
  timestamp: string;
  code: string; // What was typed
  customer: string | null; // Customer ID or null
  check: number; // Which check refused it
  messageKey: keyof ShopperMessages;
  bagValue: number;
}

// --- Test Bag (Section 17.7) ---

export interface TestBagItem {
  productId: string;
  name: string;
  sku: string;
  mode: PromoMode;
  price: number;
  isAcceptedOffer: boolean;
}

export type ShopperArchetype = 'first-time' | 'returning' | 'already-used';

export interface TestBagResult {
  qualifies: boolean;
  refusedCheck?: number;
  sentence?: string;
  qualifyingLines: TestBagLineResult[];
  discount: number;
  gst: number;
  deliveryFree: boolean;
  orderTotal: number;
}

export interface TestBagLineResult {
  name: string;
  qualifies: boolean;
  share: number;
}

// --- Component Props ---

export interface PromoCodeFilter {
  status?: DerivedPromoState;
  snapshot?: 'live' | 'redemptions' | 'orderValue' | 'discountFunded';
  search?: string;
}

export interface PromoCodeSort {
  field: 'code' | 'used' | 'window' | 'status';
  direction: 'asc' | 'desc';
}