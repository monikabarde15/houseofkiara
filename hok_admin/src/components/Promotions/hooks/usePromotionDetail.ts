// usePromotionDetail Hook
/* ========================================
   Promotions Module - usePromotionDetail Hook
   Single code with navigation
   Based on HOK_Promotions_Logic_Spec_v150.pdf Section 15
   ======================================== */

import { useState, useEffect, useCallback } from 'react';
import { PromoCode, DerivedPromoState } from '../types/promotions.types';
import { deriveState } from '../utils/derived';
import { promotionService } from '../services/promotionService';
import * as orderApi from '../../../services/orderApi';

interface UsePromotionDetailReturn {
  code: PromoCode | null;
  loading: boolean;
  error: string | null;
  derivedState: DerivedPromoState | null;
  redemptions: number;
  promotionOrders: any[];
  navigateToCode: (codeId: string) => void;
  refresh: () => void;
}

export const usePromotionDetail = (initialCodeId?: string): UsePromotionDetailReturn => {
  const [code, setCode] = useState<PromoCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [codeId, setCodeId] = useState<string | undefined>(initialCodeId);
  const [promotionOrders, setPromotionOrders] = useState<any[]>([]);

  const fetchCode = useCallback(async (id: string) => {
    if (!id) {
      setCode(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [found, allOrders] = await Promise.all([
        promotionService.getPromotion(id),
        orderApi.getOrders().catch(() => []),
      ]);
      if (found) {
        setCode(found);
        const normalizedCode = String(found.code || id).trim().toUpperCase();
        setPromotionOrders((allOrders || []).filter((order: any) =>
          String(order.promoCode || '').trim().toUpperCase() === normalizedCode
        ));
      } else {
        setError(`Code ${id} not found`);
        setCode(null);
        setPromotionOrders([]);
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

  const redemptions = promotionOrders.length;
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
    promotionOrders,
    navigateToCode,
    refresh,
  };
};
