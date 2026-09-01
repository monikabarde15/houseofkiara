// usePromotionDetail Hook
/* ========================================
   Promotions Module - usePromotionDetail Hook
   Single code with navigation
   Based on HOK_Promotions_Logic_Spec_v150.pdf Section 15
   ======================================== */

import { useState, useEffect, useCallback } from 'react';
import { PromoCode, DerivedPromoState } from '../types/promotions.types';
import { mockPromoCodes } from '../data/mockPromotions';
import { deriveState } from '../utils/derived';

interface UsePromotionDetailReturn {
  code: PromoCode | null;
  loading: boolean;
  error: string | null;
  derivedState: DerivedPromoState | null;
  redemptions: number;
  navigateToCode: (codeId: string) => void;
  refresh: () => void;
}

export const usePromotionDetail = (initialCodeId?: string): UsePromotionDetailReturn => {
  const [code, setCode] = useState<PromoCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [codeId, setCodeId] = useState<string | undefined>(initialCodeId);

  // Mock redemption counts
  const [redemptionsMap] = useState<Record<string, number>>({
    'KAIRA10': 45,
    'BRIDAL500': 0,
    'FIRST25': 78,
    'FREESHIP': 0,
    'VIP1000': 8,
    'PAUSED20': 15,
    'EXPIRED50': 5,
  });

  const fetchCode = useCallback(async (id: string) => {
    if (!id) {
      setCode(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // In production: await promotionService.getPromotion(id)
      await new Promise(resolve => setTimeout(resolve, 300));
      const found = mockPromoCodes.find(c => c.code === id);
      if (found) {
        setCode(found);
      } else {
        setError(`Code ${id} not found`);
        setCode(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch code');
      setCode(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (codeId) {
      fetchCode(codeId);
    } else {
      setLoading(false);
    }
  }, [codeId, fetchCode]);

  const redemptions = code ? (redemptionsMap[code.code] || 0) : 0;
  const derivedState = code ? deriveState(code, redemptions) : null;

  const navigateToCode = useCallback((id: string) => {
    setCodeId(id);
  }, []);

  const refresh = useCallback(() => {
    if (codeId) {
      fetchCode(codeId);
    }
  }, [codeId, fetchCode]);

  return {
    code,
    loading,
    error,
    derivedState,
    redemptions,
    navigateToCode,
    refresh,
  };
};