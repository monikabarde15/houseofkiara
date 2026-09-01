// Checkout Rules Service
/* ========================================
   Promotions Module - Checkout Rules Service
   Based on HOK_Promotions_Logic_Spec_v150.pdf Section 3.3
   ======================================== */

import { CheckoutRules } from '../types/promotions.types';
import { DEFAULT_FREE_SHIP_THRESHOLD, DEFAULT_MAX_COMBINED_PCT } from '../utils/constants';

const defaultRules: CheckoutRules = {
  stacking: 'single',
  maxCombinedFlat: null,
  maxCombinedPct: DEFAULT_MAX_COMBINED_PCT,
  freeShipThreshold: DEFAULT_FREE_SHIP_THRESHOLD,
  freeShipBasis: 'pre',
};

export const checkoutRulesService = {
  async getRules(): Promise<CheckoutRules> {
    // In production: GET to /api/promotions/rules
    await new Promise(resolve => setTimeout(resolve, 300));
    return defaultRules;
  },

  async updateRules(rules: Partial<CheckoutRules>): Promise<CheckoutRules> {
    // In production: PUT to /api/promotions/rules
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...defaultRules, ...rules };
  },
};