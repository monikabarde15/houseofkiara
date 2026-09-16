import { useState, useEffect, useMemo, useCallback } from 'react';
import { PromoCode, PromoCodeFilter, PromoCodeSort, DerivedPromoState } from '../types/promotions.types';
import { promotionService } from '../services/promotionService';
import { deriveState } from '../utils/derived';
import { formatOfferLine, formatAudiencePhrase } from '../utils/formatter';
import * as orderApi from '../../../services/orderApi';

interface UsePromotionsReturn {
  codes: PromoCode[];
  filteredCodes: PromoCode[];
  loading: boolean;
  error: string | null;
  filter: PromoCodeFilter;
  sort: PromoCodeSort;
  setFilter: (filter: PromoCodeFilter) => void;
  setSort: (sort: PromoCodeSort) => void;
  clearFilter: () => void;
  refresh: () => void;
  getRedemptions: (code: PromoCode) => number;
  getDerivedState: (code: PromoCode) => DerivedPromoState;
  promotionOrders: any[];
}

export const usePromotions = (): UsePromotionsReturn => {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<PromoCodeFilter>({});
  const [sort, setSort] = useState<PromoCodeSort>({ field: 'code', direction: 'asc' });

  const [redemptionsMap, setRedemptionsMap] = useState<Record<string, number>>({});
  const [promotionOrders, setPromotionOrders] = useState<any[]>([]);

  // Fetch codes from backend
  const fetchCodes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, orders] = await Promise.all([
        promotionService.getPromoCodes(),
        orderApi.getOrders().catch(() => []),
      ]);
      setCodes(data);
      setPromotionOrders(orders || []);
      const counts = (orders || []).reduce((result: Record<string, number>, order: any) => {
        const code = String(order.promoCode || '').trim().toUpperCase();
        if (code) result[code] = (result[code] || 0) + 1;
        return result;
      }, {});
      setRedemptionsMap(counts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch promo codes');
      setCodes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);


  // Get redemptions for a code
  const getRedemptions = useCallback((code: PromoCode): number => {
    return redemptionsMap[String(code.code || '').trim().toUpperCase()] || 0;
  }, [redemptionsMap]);

  // Get derived state for a code
  const getDerivedState = useCallback((code: PromoCode): DerivedPromoState => {
    const redemptions = getRedemptions(code);
    return deriveState(code, redemptions);
  }, [getRedemptions]);

  // Filter codes
  const filteredCodes = useMemo(() => {
    let result = [...codes];

    // Search filter
    if (filter.search) {
      const search = (filter.search || '').toLowerCase();
      result = result.filter(code =>
        (code.code || '').toLowerCase().includes(search) ||
        formatOfferLine(code).toLowerCase().includes(search) ||
        (code.publicDesc || '').toLowerCase().includes(search) ||
        (code.reason || '').toLowerCase().includes(search) ||
        formatAudiencePhrase(code).toLowerCase().includes(search)
      );
    }

    // Status filter
    if (filter.status) {
      result = result.filter(code => getDerivedState(code) === filter.status);
    }

    // Snapshot filter
    if (filter.snapshot) {
      switch (filter.snapshot) {
        case 'live':
          result = result.filter(code => getDerivedState(code) === 'Active');
          break;
        case 'redemptions':
          result = result.filter(code => getRedemptions(code) > 0);
          break;
        case 'orderValue':
          // In production: filter by order value
          result = result.filter(code => getRedemptions(code) > 0);
          break;
        case 'discountFunded':
          // In production: filter by discount funded
          result = result.filter(code => getRedemptions(code) > 0);
          break;
      }
    }

    return result;
  }, [codes, filter, getDerivedState, getRedemptions]);

  // Sort codes
  const sortedCodes = useMemo(() => {
    const result = [...filteredCodes];
    const { field, direction } = sort;
    const multiplier = direction === 'asc' ? 1 : -1;

    result.sort((a, b) => {
      let comparison = 0;
      switch (field) {
        case 'code':
          comparison = a.code.localeCompare(b.code);
          break;
        case 'used':
          comparison = (getRedemptions(a) || 0) - (getRedemptions(b) || 0);
          break;
        case 'window':
          // Sort by expiry date
          const aDate = a.validUntil ? new Date(a.validUntil).getTime() : Infinity;
          const bDate = b.validUntil ? new Date(b.validUntil).getTime() : Infinity;
          comparison = aDate - bDate;
          break;
        case 'status':
          const aState = getDerivedState(a);
          const bState = getDerivedState(b);
          comparison = aState.localeCompare(bState);
          break;
        default:
          comparison = 0;
      }
      return comparison * multiplier;
    });

    return result;
  }, [filteredCodes, sort, getRedemptions, getDerivedState]);

  const clearFilter = useCallback(() => {
    setFilter({});
  }, []);

  const refresh = useCallback(() => {
    fetchCodes();
  }, [fetchCodes]);

  return {
    codes: sortedCodes,
    filteredCodes: sortedCodes,
    loading,
    error,
    filter,
    sort,
    setFilter,
    setSort,
    clearFilter,
    refresh,
    getRedemptions,
    getDerivedState,
    promotionOrders,
  };
};
