// useCheckoutRules Hook
/* ========================================
   Promotions Module - useCheckoutRules Hook
   Platform rules CRUD
   Based on HOK_Promotions_Logic_Spec_v150.pdf Section 3.3
   ======================================== */

import { useState, useEffect, useCallback } from 'react';
import { CheckoutRules } from '../types/promotions.types';
import { DEFAULT_FREE_SHIP_THRESHOLD, DEFAULT_MAX_COMBINED_PCT } from '../utils/constants';

interface UseCheckoutRulesReturn {
  rules: CheckoutRules;
  loading: boolean;
  error: string | null;
  updateRules: (newRules: Partial<CheckoutRules>) => Promise<boolean>;
  refresh: () => void;
}

const defaultRules: CheckoutRules = {
  stacking: 'single',
  maxCombinedFlat: null,
  maxCombinedPct: DEFAULT_MAX_COMBINED_PCT,
  freeShipThreshold: DEFAULT_FREE_SHIP_THRESHOLD,
  freeShipBasis: 'pre',
};

export const useCheckoutRules = (): UseCheckoutRulesReturn => {
  const [rules, setRules] = useState<CheckoutRules>(defaultRules);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // In production: await checkoutRulesService.getRules()
      await new Promise(resolve => setTimeout(resolve, 300));
      setRules(defaultRules);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const updateRules = useCallback(async (newRules: Partial<CheckoutRules>): Promise<boolean> => {
    setError(null);
    try {
      // In production: await checkoutRulesService.updateRules(newRules)
      await new Promise(resolve => setTimeout(resolve, 300));
      setRules(prev => ({ ...prev, ...newRules }));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update rules');
      return false;
    }
  }, []);

  const refresh = useCallback(() => {
    fetchRules();
  }, [fetchRules]);

  return {
    rules,
    loading,
    error,
    updateRules,
    refresh,
  };
};