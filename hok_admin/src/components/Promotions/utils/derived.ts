// Derived Utilities
/* ========================================
   Promotions Module - Derived State Utilities
   Based on HOK_Promotions_Logic_Spec_v150.pdf Section 4
   ======================================== */

import { PromoCode, DerivedPromoState } from '../types/promotions.types';

/**
 * Derive code state (Section 4)
 * Order: Paused > Scheduled > Expired > Fully redeemed > Active
 * First match wins
 */
export const deriveState = (
  code: PromoCode,
  redemptions: number,
  today: Date = new Date()
): DerivedPromoState => {
  // 1. Paused
  if (code.status === 'Paused') return 'Paused';
  
  // 2. Scheduled
  if (code.validFrom) {
    const from = new Date(code.validFrom);
    if (today < from) return 'Scheduled';
  }
  
  // 3. Expired
  if (code.validUntil) {
    const until = new Date(code.validUntil);
    // Inclusive: works through the whole day
    const endOfDay = new Date(until);
    endOfDay.setHours(23, 59, 59, 999);
    if (today > endOfDay) return 'Expired';
  }
  
  // 4. Fully redeemed
  if (code.usesTotalCap !== null && redemptions >= code.usesTotalCap) {
    return 'Fully redeemed';
  }
  
  // 5. Active
  return 'Active';
};

/**
 * Check if code is expiring soon (7 days or fewer) (Section 12)
 */
export const isExpiringSoon = (code: PromoCode, today: Date = new Date()): boolean => {
  if (!code.validUntil || code.status !== 'Active') return false;
  const until = new Date(code.validUntil);
  const diffDays = Math.ceil((until.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 7 && diffDays > 0;
};

/**
 * Check if code has zero traction (14+ days active, zero redemptions) (Section 12)
 */
export const hasZeroTraction = (
  code: PromoCode,
  redemptions: number,
  createdOn: string,
  today: Date = new Date()
): boolean => {
  if (redemptions > 0) return false;
  if (code.audience === 'private') return false;
  if (code.status !== 'Active') return false;
  
  const created = new Date(createdOn);
  const diffDays = Math.ceil((today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 14;
};

/**
 * Check if code has no live matches (Section 12)
 */
export const hasNoLiveMatches = (code: PromoCode, livePieces: number): boolean => {
  if (code.status !== 'Active') return false;
  if (code.scope.categories.length === 0 && 
      code.scope.designerIds.length === 0 && 
      code.scope.skus.length === 0) {
    return false; // All products, so there's always matches
  }
  return livePieces === 0;
};

/**
 * Check if code is superseded (Section 12)
 */
export const isSuperseded = (code: PromoCode): boolean => {
  return !!code.supersededBy;
};

/**
 * Check if code is exhausted (Section 12)
 */
export const isExhausted = (code: PromoCode, redemptions: number): boolean => {
  return code.usesTotalCap !== null && redemptions >= code.usesTotalCap;
};

/**
 * Check if code is misconfigured (Section 12)
 * Flat discount meets or exceeds minimum order
 */
export const isMisconfigured = (code: PromoCode): boolean => {
  if (code.type !== 'flat') return false;
  if (!code.minOrder) return true; // No minimum set
  return code.value >= code.minOrder;
};

/**
 * Get attention flags (Section 12)
 */
export interface AttentionFlag {
  key: string;
  chip: string;
  fullSentence: string;
  trigger: string;
  door: string;
}

export const getAttentionFlags = (
  code: PromoCode,
  redemptions: number,
  livePieces: number,
  createdOn: string,
  today: Date = new Date()
): AttentionFlag[] => {
  const flags: AttentionFlag[] = [];
  
  // Check each flag condition
  if (isMisconfigured(code)) {
    flags.push({
      key: 'misconfig',
      chip: 'Fix rules',
      fullSentence: 'Discount exceeds the minimum order — fix the rules',
      trigger: 'a flat discount meets or exceeds the minimum order — the code pays for the qualification',
      door: 'Rules tab',
    });
  }
  
  if (isExpiringSoon(code, today)) {
    flags.push({
      key: 'expiring',
      chip: `Expires ${formatDateRelative(code.validUntil!, today)}`,
      fullSentence: `Expires in ${formatDateDiff(code.validUntil!, today)} — extend or let it lapse`,
      trigger: 'the code is Active and Valid Until is 7 days or fewer away',
      door: 'Rules tab',
    });
  }
  
  // Refusals flag (3+ refusals, 0 redemptions) - requires refusal data
  // Will be computed with refusal data
  
  if (isSuperseded(code)) {
    flags.push({
      key: 'superseded',
      chip: 'Superseded',
      fullSentence: `Replaced by ${code.supersededBy} — retire this one so they don't compete`,
      trigger: 'its terms were edited after redemptions, so a copy was made and this code is still live',
      door: 'Rules tab',
    });
  }
  
  if (isExhausted(code, redemptions)) {
    flags.push({
      key: 'exhausted',
      chip: 'Cap reached',
      fullSentence: 'Fully redeemed — stop pointing announcements here',
      trigger: 'non-cancelled redemptions have reached Max Uses (total)',
      door: 'Rules tab',
    });
  }
  
  if (hasZeroTraction(code, redemptions, createdOn, today)) {
    flags.push({
      key: 'zerotraction',
      chip: 'Zero traction',
      fullSentence: `Live ${formatDateDiff(createdOn, today)}, zero redemptions — repromote or retire`,
      trigger: 'a public code has been Active for 14+ days with zero non-cancelled redemptions',
      door: 'Repromote',
    });
  }
  
  if (hasNoLiveMatches(code, livePieces)) {
    const isListed = code.visibility === 'drawer';
    flags.push({
      key: 'nomatch',
      chip: '0 live matches',
      fullSentence: isListed 
        ? 'Nothing live qualifies — it can\'t appear in the drawer or be redeemed'
        : 'Nothing live qualifies — widen the scope or pause the code',
      trigger: 'the code is Active and no Live piece qualifies for it in a covered mode',
      door: 'Rules tab',
    });
  }
  
  return flags;
};

// Helper functions
const formatDateRelative = (date: string, today: Date): string => {
  const d = new Date(date);
  const diffDays = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Expired';
  if (diffDays === 1) return 'Expires tomorrow';
  return `Expires in ${diffDays}d`;
};

const formatDateDiff = (date: string, today: Date): string => {
  const d = new Date(date);
  const diffDays = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return '0 days';
  if (diffDays === 1) return '1 day';
  return `${diffDays} days`;
};

/**
 * Check if flag is snoozed (Section 12.2)
 */
export const isFlagSnoozed = (
  code: PromoCode,
  flagKey: string,
  today: Date = new Date()
): boolean => {
  const snoozeUntil = code.attnSnooze?.[flagKey];
  if (!snoozeUntil) return false;
  const until = new Date(snoozeUntil);
  return today <= until;
};

/**
 * Get visible flags (excluding snoozed) (Section 12.2)
 */
export const getVisibleFlags = (
  flags: AttentionFlag[],
  code: PromoCode,
  today: Date = new Date()
): AttentionFlag[] => {
  return flags.filter(flag => !isFlagSnoozed(code, flag.key, today));
};

/**
 * Get snoozed flags count
 */
export const getSnoozedFlagsCount = (
  flags: AttentionFlag[],
  code: PromoCode,
  today: Date = new Date()
): number => {
  return flags.filter(flag => isFlagSnoozed(code, flag.key, today)).length;
};