// Validators Utilities
/* ========================================
   Promotions Module - Validators
   Based on HOK_Promotions_Logic_Spec_v150.pdf Section 14.6
   ======================================== */

import { PromoCode, PromoCodeType, PromoMode } from '../types/promotions.types';
import { CODE_PATTERN, CODE_MIN_LENGTH, CODE_MAX_LENGTH } from './constants';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate promo code pattern (Section 14.6)
 * 3-20 chars, A-Z 0-9 and dashes, must not start with dash
 */
export const validateCodePattern = (code: string): ValidationError | null => {
  if (!code || code.trim().length === 0) {
    return { field: 'code', message: 'A code is required.' };
  }
  
  const trimmed = code.trim().toUpperCase();
  if (trimmed.length < CODE_MIN_LENGTH || trimmed.length > CODE_MAX_LENGTH) {
    return { 
      field: 'code', 
      message: `Codes are ${CODE_MIN_LENGTH}-${CODE_MAX_LENGTH} characters — letters, numbers and dashes only.` 
    };
  }
  
  if (!CODE_PATTERN.test(trimmed)) {
    return { 
      field: 'code', 
      message: `Codes are ${CODE_MIN_LENGTH}-${CODE_MAX_LENGTH} characters — letters, numbers and dashes only.` 
    };
  }
  
  return null;
};

/**
 * Validate promo code uniqueness (Section 14.6)
 */
export const validateCodeUniqueness = (
  code: string,
  existingCodes: string[],
  excludeCode?: string
): ValidationError | null => {
  const trimmed = code.trim().toUpperCase();
  const exists = existingCodes.some(c => 
    c.toUpperCase() === trimmed && c !== excludeCode
  );
  if (exists) {
    return { 
      field: 'code', 
      message: `The code ${trimmed} already exists — codes must be unique.` 
    };
  }
  return null;
};

/**
 * Validate reason (Section 14.6)
 */
export const validateReason = (reason: string): ValidationError | null => {
  if (!reason || reason.trim().length === 0) {
    return { 
      field: 'reason', 
      message: 'A reason is required — it\'s the audit answer to why we gave money away.' 
    };
  }
  return null;
};

/**
 * Validate discount value (Section 14.6)
 */
export const validateDiscountValue = (
  type: PromoCodeType,
  value: number | null
): ValidationError | null => {
  if (type === 'freedel') return null;
  
  if (value === null || value <= 0) {
    return { 
      field: 'value', 
      message: 'Discount value must be greater than zero.' 
    };
  }
  
  if (type === 'percent' && value > 100) {
    return { 
      field: 'value', 
      message: 'A percentage discount can\'t exceed 100%.' 
    };
  }
  
  return null;
};

/**
 * Validate flat discount vs minimum order (Section 14.6)
 */
export const validateFlatVsMinimum = (
  type: PromoCodeType,
  value: number | null,
  minOrder: number | null
): ValidationError | null => {
  if (type !== 'flat') return null;
  if (value === null) return null;
  if (!minOrder) return null; // No minimum set, handled elsewhere
  
  if (value >= minOrder) {
    return { 
      field: 'value', 
      message: `The flat discount (${value}) meets or exceeds the minimum order (${minOrder}) — raise the minimum or lower the value.` 
    };
  }
  
  return null;
};

/**
 * Validate discount cap (Section 14.6)
 */
export const validateCap = (cap: number | null): ValidationError | null => {
  if (cap !== null && cap <= 0) {
    return { 
      field: 'maxDiscount', 
      message: 'A discount cap must be greater than zero — leave it blank for no cap.' 
    };
  }
  return null;
};

/**
 * Validate total cap (Section 14.6)
 */
export const validateTotalCap = (cap: number | null): ValidationError | null => {
  if (cap !== null && cap <= 0) {
    return { 
      field: 'usesTotalCap', 
      message: 'Max Uses (total) must be at least 1 — a cap of zero creates a code that is fully redeemed the moment it exists. Leave it blank for no limit.' 
    };
  }
  return null;
};

/**
 * Validate per-customer cap vs total cap (Section 14.6)
 */
export const validatePerCustomerCap = (
  perCustomer: number | null,
  totalCap: number | null
): ValidationError | null => {
  if (perCustomer === null) return null;
  if (totalCap === null) return null;
  if (perCustomer > totalCap) {
    return { 
      field: 'usesPerCustomer', 
      message: `One customer can't use it ${perCustomer} times when the code allows only ${totalCap} uses in total.` 
    };
  }
  return null;
};

/**
 * Validate modes (Section 14.6)
 */
export const validateModes = (modes: PromoMode[]): ValidationError | null => {
  if (!modes || modes.length === 0) {
    return { 
      field: 'modes', 
      message: 'Pick at least one mode the code applies to.' 
    };
  }
  return null;
};

/**
 * Validate date range (Section 14.6)
 */
export const validateDateRange = (
  validFrom: string | null,
  validUntil: string | null
): ValidationError | null => {
  if (!validFrom || !validUntil) return null;
  const from = new Date(validFrom);
  const until = new Date(validUntil);
  if (until < from) {
    return { 
      field: 'validUntil', 
      message: "Valid Until can't be before Valid From." 
    };
  }
  return null;
};

/**
 * Validate private code (Section 14.6)
 */
export const validatePrivateCode = (
  audience: 'public' | 'private',
  customerIds: string[]
): ValidationError | null => {
  if (audience === 'private' && (!customerIds || customerIds.length === 0)) {
    return { 
      field: 'customerIds', 
      message: 'A private code needs at least one assigned customer.' 
    };
  }
  return null;
};

/**
 * Validate restricted scope (Section 14.6)
 */
export const validateRestrictedScope = (
  scopeRestricted: boolean,
  categories: string[],
  designerIds: string[],
  skus: string[]
): ValidationError | null => {
  if (!scopeRestricted) return null;
  if (categories.length === 0 && designerIds.length === 0 && skus.length === 0) {
    return { 
      field: 'scope', 
      message: 'A restricted scope needs at least one category, designer, or piece — or switch back to All products.' 
    };
  }
  return null;
};

/**
 * Run all validations (Section 14.6)
 */
export const validatePromoCode = (
  code: string,
  reason: string,
  type: PromoCodeType,
  value: number | null,
  maxDiscount: number | null,
  minOrder: number | null,
  modes: PromoMode[],
  scopeRestricted: boolean,
  categories: string[],
  designerIds: string[],
  skus: string[],
  validFrom: string | null,
  validUntil: string | null,
  usesTotalCap: number | null,
  usesPerCustomer: number | null,
  audience: 'public' | 'private',
  customerIds: string[],
  existingCodes: string[],
  excludeCode?: string
): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Run each validation in order (Section 14.6)
  const codePattern = validateCodePattern(code);
  if (codePattern) errors.push(codePattern);
  
  const uniqueness = validateCodeUniqueness(code, existingCodes, excludeCode);
  if (uniqueness) errors.push(uniqueness);
  
  const reasonError = validateReason(reason);
  if (reasonError) errors.push(reasonError);
  
  const valueError = validateDiscountValue(type, value);
  if (valueError) errors.push(valueError);
  
  const flatError = validateFlatVsMinimum(type, value, minOrder);
  if (flatError) errors.push(flatError);
  
  const capError = validateCap(maxDiscount);
  if (capError) errors.push(capError);
  
  const totalCapError = validateTotalCap(usesTotalCap);
  if (totalCapError) errors.push(totalCapError);
  
  const perCapError = validatePerCustomerCap(usesPerCustomer, usesTotalCap);
  if (perCapError) errors.push(perCapError);
  
  const modesError = validateModes(modes);
  if (modesError) errors.push(modesError);
  
  const dateError = validateDateRange(validFrom, validUntil);
  if (dateError) errors.push(dateError);
  
  const privateError = validatePrivateCode(audience, customerIds);
  if (privateError) errors.push(privateError);
  
  const scopeError = validateRestrictedScope(scopeRestricted, categories, designerIds, skus);
  if (scopeError) errors.push(scopeError);
  
  return errors;
};