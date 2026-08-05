// src/components/LYP/utils/templates.ts

import { getFirstName } from './formatter';

// WhatsApp Message Templates
export const WHATSAPP_TEMPLATES = {
  // Terms ask
  TERMS_ASK: (firstName: string): string => {
    return `Hi ${firstName}! Before your piece moves ahead we need a quick yes on the House of Kaira Lister Terms (LST-2026-01). Reply "AGREE" right here and we'll record it — takes ten seconds. 🔗`;
  },

  // More Info Presets
  MORE_INFO_DAYLIGHT: (firstName: string, piece: string): string => {
    return `Hi ${firstName}! To finish reviewing your ${piece}, could you share 2-3 photos in natural daylight - full front, back, and a close-up of the work?`;
  },

  MORE_INFO_PURCHASE: (firstName: string, designer: string): string => {
    return `Hi ${firstName}! For a ${designer || 'designer'} piece we do a quick authenticity check - could you share the purchase invoice or any proof of purchase?`;
  },

  MORE_INFO_CARE: (firstName: string, piece: string): string => {
    return `Hi ${firstName}! Quick one on the ${piece} - has it been dry-cleaned, altered, or repaired anywhere? Helps us grade it fairly.`;
  },

  MORE_INFO_FULLSET: (firstName: string, piece: string): string => {
    return `Hi ${firstName}! Could you share one photo with every component of the ${piece} laid out together - so nothing gets missed at pickup?`;
  },

  // Nudge
  NUDGE: (firstName: string, piece: string): string => {
    return `Hi ${firstName}! A gentle nudge on ${piece} - the moment the details land, your review is straight back in motion.`;
  },

  // Rejection
  REJECTION: (firstName: string, piece: string, reasonCode: string, optionalNote?: string): string => {
    const note = optionalNote ? ` — ${optionalNote}` : '';
    return `Hi ${firstName}, thank you for offering ${piece} to House of Kaira. We took a careful look — ${reasonCode}${note}. We'd truly love to see the next one.`;
  },

  // Approval - New Lister
  APPROVAL_NEW: (firstName: string, piece: string): string => {
    return `Welcome to House of Kaira, ${firstName}! Wonderful news: ${piece} is approved ✓ Next we schedule pickup, authenticate, and shoot it beautifully — you approve every image before it goes live.`;
  },

  // Approval - Existing Lister
  APPROVAL_EXISTING: (firstName: string, piece: string): string => {
    return `Hi ${firstName} — wonderful news: ${piece} is approved ✓ Next we schedule pickup, authenticate, and shoot it beautifully — you approve every image before it goes live.`;
  },

  // Approval - Revived
  APPROVAL_REVIVED: (firstName: string, piece: string): string => {
    return `Welcome back to House of Kaira, ${firstName}! Wonderful news: ${piece} is approved ✓ Next we schedule pickup, authenticate, and shoot it beautifully — you approve every image before it goes live.`;
  },

  // Withdrawal
  WITHDRAWAL: (firstName: string, piece: string): string => {
    return `Noted, ${firstName} — ${piece} is withdrawn as requested. Thank you for thinking of us; the door stays open.`;
  },

  // Expired
  EXPIRED: (firstName: string, piece: string): string => {
    return `Hi ${firstName} — we haven't heard back on ${piece}, so we're closing this submission for now. The door stays open for a fresh submission any time.`;
  },

  // Statement
  STATEMENT: (firstName: string): string => {
    return `Hi ${firstName}, here's your payout statement from House of Kaira. Let us know if you have any questions!`;
  },
};

// History Entry Templates
export const HISTORY_TEMPLATES = {
  RECEIPT: (subid: string, channel: string, by: string): string => {
    return `Submission recorded via ${channel} — by ${by}`;
  },

  MORE_INFO_REQUESTED: (subid: string, text: string): string => {
    return `More info requested via WhatsApp — ${text}`;
  },

  NUDGE_SENT: (): string => {
    return `Nudge sent on WhatsApp`;
  },

  REPLY_RECEIVED: (): string => {
    return `Lister replied - back in review; a fresh 48-hour decision window starts`;
  },

  APPROVED: (sku: string): string => {
    return `Approved - draft product ${sku} created`;
  },

  REJECTED: (code: string): string => {
    return `Rejected — ${code}`;
  },

  WITHDRAWN: (reason: string): string => {
    return `Withdrawn — ${reason}`;
  },

  EXPIRED: (reason: string): string => {
    return `Expired — ${reason}`;
  },

  MEDIA_ADDED: (count: number, type: string): string => {
    return `${count} ${type}(s) added to the record`;
  },

  APPLICATION_APPROVED: (subid: string): string => {
    return `Application approved — first submission ${subid} accepted; lister verified`;
  },

  APPLICATION_REJECTED: (): string => {
    return `Application closed — submission rejected`;
  },

  APPLICATION_EXPIRED: (): string => {
    return `Application closed — expired, no response`;
  },

  APPLICATION_WITHDRAWN: (): string => {
    return `Application closed — submission withdrawn`;
  },

  LISTER_REVIVED: (): string => {
    return `Lister revived — fresh submission approved; the door stayed open`;
  },

  TERMS_REQUESTED: (version: string): string => {
    return `Lister Terms (${version}) requested on WhatsApp`;
  },
};

// Communication Log Templates
export const COMM_TEMPLATES = {
  RECEIPT: (subid: string, piece: string): string => {
    return `Submission ${subid} recorded — ${piece}`;
  },

  MORE_INFO: (subid: string, text: string): string => {
    return `More info requested on ${subid} — ${text}`;
  },

  NUDGE: (subid: string): string => {
    return `Gentle nudge on ${subid} - still need the details to keep the review moving`;
  },

  APPROVED: (subid: string, piece: string): string => {
    return `Submission ${subid} approved - ${piece} begins intake: pickup - authentication - studio shoot - your image approval`;
  },

  REJECTED: (subid: string, code: string, note?: string): string => {
    const noteText = note ? ` — ${note}` : '';
    return `Submission ${subid} declined — ${code}${noteText}`;
  },

  WITHDRAWN: (subid: string): string => {
    return `Withdrawal noted for ${subid} - acknowledged with thanks`;
  },

  EXPIRED: (subid: string): string => {
    return `Submission ${subid} closed - no response; door left open`;
  },

  STATEMENT_SENT: (paidCount: number, pendingCount: number): string => {
    return `Payout statement sent - ${paidCount} paid - ${pendingCount} upcoming`;
  },

  WELCOME_NEW: (): string => {
    return `Welcome to House of Kaira — your application is approved and on its way to the storefront ✓`;
  },

  WELCOME_BACK: (): string => {
    return `Welcome back to House of Kaira — your application is approved and on its way to the storefront ✓`;
  },

  APPLICATION_DECLINED: (reason: string): string => {
    return `Application update — we passed on this piece (${reason}). We'd love to see the next one.`;
  },
};

// Lister Activity Templates
export const ACTIVITY_TEMPLATES = {
  RECEIPT: (subid: string, piece: string): string => {
    return `Submission recorded manually — ${piece} (${subid})`;
  },

  APPROVED_FIRST: (subid: string): string => {
    return `Application approved — first submission ${subid} accepted`;
  },

  APPROVED: (subid: string, sku: string): string => {
    return `Submission ${subid} approved — draft ${sku} created`;
  },

  REJECTED: (subid: string, code: string): string => {
    return `Submission ${subid} rejected — ${code}`;
  },

  WITHDRAWN: (subid: string): string => {
    return `Submission ${subid} withdrawn`;
  },

  EXPIRED: (subid: string): string => {
    return `Submission ${subid} expired — no response`;
  },

  APPLICATION_CLOSED_REJECTED: (): string => {
    return `Application closed — submission rejected`;
  },

  APPLICATION_CLOSED_EXPIRED: (): string => {
    return `Application closed — expired, no response`;
  },

  APPLICATION_CLOSED_WITHDRAWN: (): string => {
    return `Application closed — withdrawn by applicant`;
  },

  LISTER_REVIVED: (): string => {
    return `Lister revived — fresh submission approved; the door stayed open`;
  },

  LISTER_VERIFIED: (): string => {
    return `Application approved — first submission accepted; lister verified`;
  },

  TERMS_REQUESTED: (version: string): string => {
    return `Lister Terms (${version}) requested on WhatsApp`;
  },

  TERMS_ACCEPTED: (version: string): string => {
    return `Lister Terms (${version}) accepted`;
  },

  NUDGE_SENT: (): string => {
    return `Nudge sent on WhatsApp`;
  },

  REPLY_RECEIVED: (): string => {
    return `Reply received — back in review`;
  },

  MEDIA_ADDED: (count: number, type: string): string => {
    return `${count} ${type}(s) added to the record`;
  },
};