// Formatter Utilities
/* ========================================
   Promotions Module - Formatter Utilities
   Based on HOK_Promotions_UI_Spec_v150.pdf
   ======================================== */

import { PromoCode, PromoCodeType, PromoMode } from '../types/promotions.types';
import { MODE_SHARES } from './constants';

/**
 * Format money with ₹ symbol and thousands separators
 * Section 4.11 - Tabular lining numerals
 */
export const formatMoney = (amount: number): string => {
  if (amount === 0) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Format percentage (Section 6.1)
 */
export const formatPercent = (value: number): string => {
  return `${value}%`;
};

/**
 * Format date as "23 Mar 2026" (Section 3.2)
 */
export const formatDate = (date: string | null): string => {
  if (!date) return '';
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

/**
 * Format date for display in table (Section A.4)
 * "starts 23 Mar 2026", "ends 23 Mar 2026", "ended 23 Mar 2026"
 */
export const formatWindowDate = (date: string | null, prefix: string): string => {
  if (!date) return 'no expiry';
  return `${prefix} ${formatDate(date)}`;
};

/**
 * Format value phrase (Section A.4)
 */
export const formatValuePhrase = (code: PromoCode): string => {
  if (code.type === 'freedel') return 'Free delivery';
  if (code.type === 'flat') return `${formatMoney(code.value)} off`;
  // Percentage
  let phrase = `${code.value}% off`;
  if (code.maxDiscount) {
    phrase += ` · cap ${formatMoney(code.maxDiscount)}`;
  }
  return phrase;
};

/**
 * Format offer line for list row (Section A.4)
 * Value phrase · scope phrase · modes
 */
export const formatOfferLine = (code: PromoCode): string => {
  const parts: string[] = [];
  
  // Value phrase
  parts.push(formatValuePhrase(code));
  
  // Scope phrase
  const scopePhrase = formatScopePhrase(code);
  if (scopePhrase) parts.push(scopePhrase);
  
  // Modes
  const modes = code.modes.join(' & ');
  parts.push(modes.length === 3 ? 'All modes' : modes);
  
  return parts.join(' · ');
};

/**
 * Format scope phrase (Section 7.3)
 */
export const formatScopePhrase = (code: PromoCode): string => {
  const { scope } = code;
  const parts: string[] = [];
  
  // Specific pieces first
  if (scope.skus.length > 0) {
    return `${scope.skus.length} specific piece${scope.skus.length > 1 ? 's' : ''}`;
  }
  
  // Designers (up to 2 by name)
  if (scope.designerIds.length > 0) {
    // In reality, would fetch designer names
    const names = scope.designerIds.map(id => id); // Placeholder
    if (names.length <= 2) {
      parts.push(names.join(' & '));
    } else {
      parts.push(`${names.length} designers`);
    }
  }
  
  // Categories
  if (scope.categories.length > 0) {
    const cats = scope.categories.map(c => c); // Placeholder
    if (parts.length === 0) {
      parts.push(cats.length <= 2 ? cats.join(' & ') : `${cats.length} categories`);
    } else if (cats.length > 0) {
      // Join with existing parts
    }
  }
  
  return parts.join(' ');
};

/**
 * Format audience phrase (Section A.4)
 */
export const formatAudiencePhrase = (code: PromoCode): string => {
  if (code.audience === 'public') return 'Public';
  const count = code.customerIds.length;
  return `Private · ${count} customer${count > 1 ? 's' : ''}`;
};

/**
 * Format window phrase for header meta line (Section A.4)
 */
export const formatWindowPhrase = (code: PromoCode): string => {
  if (code.validFrom && code.validUntil) {
    return `${formatDate(code.validFrom)} → ${formatDate(code.validUntil)}`;
  }
  if (code.validFrom) return `from ${formatDate(code.validFrom)}`;
  if (code.validUntil) return `until ${formatDate(code.validUntil)}`;
  return 'no expiry';
};

/**
 * Format used cell (Section 5.9)
 */
export const formatUsedCell = (used: number, cap: number | null): string => {
  if (cap === null) return `${used}`;
  return `${used} / ${cap}`;
};

/**
 * Format meta line (Section A.4)
 */
export const formatMetaLine = (code: PromoCode): string => {
  const parts: string[] = [];
  
  parts.push(formatValuePhrase(code));
  
  const scope = formatScopePhrase(code);
  if (scope) parts.push(scope);
  
  if (code.minOrder) parts.push(`min order ${formatMoney(code.minOrder)}`);
  else parts.push('no minimum');
  
  parts.push(code.modes.join(' & '));
  parts.push(formatWindowPhrase(code));
  
  if (code.firstOrderOnly) parts.push('first order only');
  if (code.visibility === 'drawer') parts.push('listed in the cart drawer');
  if (code.stacksWith.length > 0) {
    parts.push(`stacks with ${code.stacksWith.length === 1 ? code.stacksWith[0] : `${code.stacksWith.length} codes`}`);
  }
  if (code.supersededBy) parts.push(`superseded by ${code.supersededBy}`);
  if (code.supersedes) parts.push(`replaces ${code.supersedes}`);
  
  return parts.join(' · ');
};

/**
 * Format mates line (Section A.4)
 */
export const formatMatesLine = (partners: string[]): string => {
  if (partners.length === 0) {
    return 'No partners picked yet — it stacks with nothing until you add a code below.';
  }
  return `Stacks at checkout with ${partners.join(' · ')} and no other code.`;
};